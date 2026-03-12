'use client';
import { useEffect, useState, useRef } from 'react';
import { ModuleProps } from '@/src/core/layout/ModuleRegistry';
import { useLayoutStore } from '@/src/core/layout/useLayoutStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { create } from 'zustand';

// Create a local store to preserve state across unmounts/remounts
// This fixes the issue where text disappears when the module expands/collapses
interface AiChatState {
  text: string;
  setText: (text: string) => void;
  hasLearned: boolean;
  setHasLearned: (hasLearned: boolean) => void;
  generatedTitle: string;
  setGeneratedTitle: (title: string) => void;
  aiResponse: string;
  setAiResponse: (response: string) => void;
  thinkingProcess: string;
  setThinkingProcess: (process: string) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  // Global stats for ComputeModule
  currentModel: string;
  setCurrentModel: (model: string) => void;
  totalTokens: number;
  addTokens: (tokens: number) => void;
  tokenLimit: number;
  setTokenLimit: (limit: number) => void;
  // Settings
  apiEndpoint: string;
  setApiEndpoint: (endpoint: string) => void;
  modelName: string;
  setModelName: (modelName: string) => void;
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
}

export const useAiChatStore = create<AiChatState>((set) => ({
  text: '',
  setText: (text) => set({ text }),
  hasLearned: false,
  setHasLearned: (hasLearned) => set({ hasLearned }),
  generatedTitle: '',
  setGeneratedTitle: (generatedTitle) => set({ generatedTitle }),
  aiResponse: '',
  setAiResponse: (aiResponse) => set({ aiResponse }),
  thinkingProcess: '',
  setThinkingProcess: (thinkingProcess) => set({ thinkingProcess }),
  isSearching: false,
  setIsSearching: (isSearching) => set({ isSearching }),
  currentModel: 'DETECTING...',
  setCurrentModel: (currentModel) => set({ currentModel }),
  totalTokens: 0,
  addTokens: (tokens) => set((state) => ({ totalTokens: state.totalTokens + tokens })),
  tokenLimit: 100000, // Default configurable limit
  setTokenLimit: (tokenLimit) => set({ tokenLimit }),
  apiEndpoint: 'http://localhost:1234/api/v1/chat',
  setApiEndpoint: (apiEndpoint) => set({ apiEndpoint }),
  modelName: 'qwen3.5-9b-ultimate-irrefusable-heretic',
  setModelName: (modelName) => set({ modelName }),
  systemPrompt: '你是一个拥有深度思考能力的智能助手。请清晰、有逻辑地回答问题，并使用与用户相同的语言。',
  setSystemPrompt: (systemPrompt) => set({ systemPrompt }),
}));

export function AiChatModule({ isExpanded }: ModuleProps) {
  const setExpandedModule = useLayoutStore(s => s.setExpandedModule);
  const isDragging = useLayoutStore(s => s.isDragging);
  
  // Use global store for this module to preserve data
  const {
    text, setText,
    hasLearned, setHasLearned,
    generatedTitle, setGeneratedTitle,
    aiResponse, setAiResponse,
    thinkingProcess, setThinkingProcess,
    isSearching, setIsSearching,
    currentModel, setCurrentModel, addTokens,
    apiEndpoint, modelName, systemPrompt
  } = useAiChatStore();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(false);

  // Top right dot matrix animation
  const [dots, setDots] = useState<boolean[]>(Array(8).fill(false));
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.map(() => Math.random() > 0.5));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-resize textarea to fit content seamlessly (Infinite growth)
  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [text, isExpanded]);

  // Handle focus and cursor position when expanding
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
      // Move cursor to the end of the text
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isExpanded]);

  // Auto-expand if text gets too long
  useEffect(() => {
    if (text.length > 10 && !isExpanded) {
      setExpandedModule('ai-chat');
    }
  }, [text, isExpanded, setExpandedModule]);

  const handleInteraction = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent default ModuleContainer expansion
    
    if (isDragging) return; // Prevent accidental click after drag and drop
    
    if (isExpanded) {
      // Already expanded, just focus the input
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    if (hasLearned || text.trim().length > 0) {
      // If text is generated or user has typed something, single click expands
      setExpandedModule('ai-chat');
      return;
    }

    // Empty text and not generated -> double click to expand, single to focus
    if (clickTimeoutRef.current) {
      // Double click detected
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      setExpandedModule('ai-chat');
    } else {
      // Single click detected
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
        if (inputRef.current) inputRef.current.focus();
      }, 250); // 250ms double-click window
    }
  };

  const handleSearch = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!text.trim() || isSearching) return;

    setIsSearching(true);
    setHasLearned(true);
    setGeneratedTitle('正在提取核心议题...');
    setIsThinkingExpanded(false); // Reset thinking expansion
    setThinkingProcess(''); // Clear previous thinking
    setAiResponse(''); // Clear previous response
    
    try {
      // 1. Set title to "探讨：" + full text, CSS will handle truncation
      setTimeout(() => {
        setGeneratedTitle(`探讨：${text}`);
      }, 400);

      // 2. Call local model using custom API format
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelName,
          system_prompt: systemPrompt,
          input: text
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      // Parse response based on typical custom API formats
      let content = data.response || data.content || data.choices?.[0]?.message?.content || JSON.stringify(data);
      let reasoning = data.reasoning_content || data.choices?.[0]?.message?.reasoning_content || "";

      // Fallback for models that output <think> tags directly in the main content
      if (content.includes('<think>')) {
        const match = content.match(/<think>([\s\S]*?)<\/think>/);
        if (match) {
          reasoning = match[1].trim();
          content = content.replace(/<think>[\s\S]*?<\/think>/, '').trim();
        }
      }

      setThinkingProcess(reasoning);
      setAiResponse(content || "未能生成有效回答。");

      // Update token usage (Gemini doesn't provide exact tokens in the same way, but we can approximate or skip)
      addTokens(Math.floor(content.length / 2));
      
      // Auto expand to show results if not already expanded
      if (!isExpanded) {
        setExpandedModule('ai-chat');
      }

      // Automatically generate knowledge graph
      const { useKnowledgeGraphStore } = await import('@/components/modules/store/useKnowledgeGraphStore');
      useKnowledgeGraphStore.getState().generateGraph(text, content, apiEndpoint);

    } catch (error) {
      console.error('Error fetching from Gemini model:', error);
      setAiResponse(`**无法连接到大模型**\n\n请确保已配置正确的环境变量。`);
      if (!isExpanded) setExpandedModule('ai-chat');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div 
      className="h-full flex flex-col w-full cursor-text"
      onClick={handleInteraction}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div className="font-mono uppercase text-[11px] tracking-widest flex items-center gap-2 font-black">
          {/* Status Dot: Pixelated square, Red when learned/active */}
          <span className={`w-3 h-3 ${hasLearned ? 'bg-accent-red animate-pulse' : 'bg-black/40 dark:bg-white/20'}`}></span>
          {hasLearned ? 'ACTIVE_LEARNING' : 'IDLE_STATE'}
        </div>
        
        <div className="dot-matrix">
          {dots.map((active, i) => (
            <div key={i} className={`dot ${active ? 'active' : ''}`}></div>
          ))}
        </div>
      </div>

      {/* Main Content Area - Fully Scrollable */}
      <div className="flex-1 flex flex-col min-h-0 relative overflow-y-auto pr-2 pb-4">
        
        {/* Generated Title (Appears above input after searching, pushes text down) */}
        <AnimatePresence>
          {generatedTitle && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-accent-red font-black text-2xl md:text-3xl mb-4 shrink-0 flex items-center gap-3 overflow-hidden"
            >
              <span className="w-4 h-4 bg-accent-red shrink-0" />
              <span className="py-2 truncate">{generatedTitle}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Seamless Input Area */}
        <div className="relative flex flex-col shrink-0">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              adjustTextareaHeight();
            }}
            placeholder="你有什么新的想法？"
            rows={1}
            className={`w-full bg-transparent border-none outline-none p-0 focus:ring-0 resize-none font-medium leading-relaxed placeholder:text-text-main/30 dark:placeholder:text-white/30 caret-accent-red overflow-hidden transition-opacity duration-300 ${
              hasLearned ? 'opacity-60' : 'opacity-100'
            } text-base md:text-lg`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSearch();
              }
            }}
          />

          {/* Floating Search Button */}
          <AnimatePresence>
            {text.trim() && !hasLearned && isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-0 right-0 flex items-center gap-2 z-10 translate-y-full pt-4"
              >
                <span className="text-[10px] font-mono opacity-40 uppercase hidden md:inline">Cmd + Enter to Search</span>
                <button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-red text-white rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 text-sm font-bold shadow-lg"
                >
                  {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                  搜索文献
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Response Area (Embedded directly, no black box, separated by a line) */}
        <AnimatePresence>
          {(hasLearned || isSearching) && isExpanded && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 pt-8 border-t border-black/10 dark:border-white/10 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {isSearching ? (
                <div className="flex items-center gap-3 text-accent-red opacity-70">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="font-mono text-sm uppercase tracking-wider">正在检索与分析...</span>
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* Deep Thinking Section */}
                  {thinkingProcess && (
                    <div className="mb-6">
                      <button 
                        onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
                        className="font-mono text-[10px] uppercase tracking-widest border border-black/20 dark:border-white/20 rounded px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-2 text-black/70 dark:text-white/70"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isThinkingExpanded ? 'bg-accent-red' : 'bg-black/40 dark:bg-white/40'}`} />
                        DEEP_THINKING
                      </button>
                      
                      <AnimatePresence>
                        {isThinkingExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 bg-black/5 dark:bg-white/5 rounded-lg p-4 font-mono text-xs text-black/60 dark:text-white/60 whitespace-pre-wrap border border-black/10 dark:border-white/10">
                              {thinkingProcess}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Main AI Response */}
                  <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/5 dark:prose-pre:bg-white/5 prose-pre:border prose-pre:border-black/10 dark:prose-pre:border-white/10 prose-blockquote:border-l-accent-red prose-blockquote:bg-black/5 dark:prose-blockquote:bg-white/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-strong:text-accent-red">
                    {aiResponse ? (
                      <div className="markdown-body">
                        <ReactMarkdown>{aiResponse}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="space-y-6 opacity-80">
                        <p className="italic opacity-50">AI 分析结果将在此处显示...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
