'use client';
import { useEffect, useState } from 'react';
import { useAiChatStore } from '@/components/modules/AiChatModule';
import { ModuleProps } from '@/src/core/layout/ModuleRegistry';

export function SettingsModule({ isExpanded }: ModuleProps) {
  const { 
    tokenLimit, setTokenLimit,
    apiEndpoint, setApiEndpoint,
    modelName, setModelName,
    systemPrompt, setSystemPrompt
  } = useAiChatStore();

  const [dots, setDots] = useState<boolean[]>(Array(9).fill(false));
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.map(() => Math.random() > 0.5));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (isExpanded) {
    return (
      <div className="flex flex-col h-full text-white">
        <div className="font-mono uppercase text-[11px] tracking-widest mb-8 opacity-50 flex items-center gap-4">
          <div className="dot-matrix" style={{ gridTemplateColumns: 'repeat(3, 4px)', gap: '4px' }}>
            {dots.map((active, i) => (
              <div key={i} className={`w-1 h-1 rounded-full transition-colors duration-300 ${active ? 'bg-white' : 'bg-white/20'}`}></div>
            ))}
          </div>
          SYSTEM_CONFIGURATION
        </div>
        
        <div className="space-y-8 overflow-y-auto pr-4 pb-8">
          {/* Section 1: Network & API */}
          <section>
            <h3 className="font-mono text-xs uppercase tracking-widest text-accent-red mb-4 border-b border-white/10 pb-2">Network & API</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider mb-2 opacity-60">
                  Local Inference Endpoint
                </label>
                <input 
                  type="text" 
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  className="bg-black/20 border border-white/10 rounded px-3 py-2.5 w-full font-mono text-sm focus:outline-none focus:border-accent-red transition-colors backdrop-blur-md"
                  placeholder="http://localhost:1234/api/v1/chat"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Model Behavior */}
          <section>
            <h3 className="font-mono text-xs uppercase tracking-widest text-accent-red mb-4 border-b border-white/10 pb-2">Model Behavior</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider mb-2 opacity-60">
                  Model Name
                </label>
                <input 
                  type="text" 
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="bg-black/20 border border-white/10 rounded px-3 py-2.5 w-full font-mono text-sm focus:outline-none focus:border-accent-red transition-colors backdrop-blur-md"
                  placeholder="qwen3.5-9b-ultimate-irrefusable-heretic"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider mb-2 opacity-60">
                  System Prompt (Directive)
                </label>
                <textarea 
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="bg-black/20 border border-white/10 rounded px-3 py-2.5 w-full font-mono text-sm focus:outline-none focus:border-accent-red transition-colors resize-none backdrop-blur-md"
                  rows={4}
                />
              </div>
            </div>
          </section>

          {/* Section 3: Resource Limits */}
          <section>
            <h3 className="font-mono text-xs uppercase tracking-widest text-accent-red mb-4 border-b border-white/10 pb-2">Resource Limits</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider mb-2 opacity-60">
                  Token Usage Limit (Compute Module)
                </label>
                <input 
                  type="number" 
                  value={tokenLimit}
                  onChange={(e) => setTokenLimit(Number(e.target.value) || 100000)}
                  className="bg-black/20 border border-white/10 rounded px-3 py-2.5 w-full font-mono text-sm focus:outline-none focus:border-accent-red transition-colors backdrop-blur-md"
                  step="10000"
                  min="10000"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between h-full">
      <div className="font-mono uppercase text-[11px] tracking-wider opacity-50">SETTINGS</div>
      <div className="flex items-center justify-center flex-1">
        <div className="dot-matrix" style={{ gridTemplateColumns: 'repeat(3, 4px)' }}>
          {dots.map((active, i) => (
            <div key={i} className={`dot ${active ? 'active' : ''}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
