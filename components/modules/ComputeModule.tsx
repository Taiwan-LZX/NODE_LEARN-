'use client';
import { useAiChatStore } from '@/components/modules/AiChatModule';

export function ComputeModule() {
  const { currentModel, totalTokens, tokenLimit } = useAiChatStore();
  
  // Calculate percentage for the progress bar
  const percentage = Math.min(100, Math.max(0, (totalTokens / tokenLimit) * 100));

  return (
    <>
      <div className="font-mono uppercase text-[11px] tracking-wider">COMPUTE</div>
      <div>
        <div className="font-mono uppercase text-[11px] tracking-wider truncate" title={currentModel}>
          LLM: {currentModel.toUpperCase()}
        </div>
        <div className="w-full h-1 bg-black/10 rounded-sm mt-3 relative overflow-hidden">
          <div 
            className="h-full bg-card-black rounded-sm transition-all duration-500" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="font-mono uppercase text-[9px] tracking-wider mt-2 flex justify-between">
          <span>TOKENS_USED: {totalTokens.toLocaleString()}</span>
          <span className="opacity-50">LIMIT: {tokenLimit.toLocaleString()}</span>
        </div>
      </div>
    </>
  );
}
