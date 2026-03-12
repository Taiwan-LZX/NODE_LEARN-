'use client';
import { useEffect, useState } from 'react';
import { ModuleProps } from '@/src/core/layout/ModuleRegistry';

export function AiChatModule({ isExpanded }: ModuleProps) {
  const [dots, setDots] = useState<boolean[]>(Array(8).fill(false));
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.map(() => Math.random() > 0.5));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="font-mono uppercase text-[11px] tracking-wider">
          <span className="status-dot"></span>ACTIVE_PROMPT
        </div>
        <div className="dot-matrix">
          {dots.map((active, i) => (
            <div key={i} className={`dot ${active ? 'active' : ''}`}></div>
          ))}
        </div>
      </div>
      <div className={`${isExpanded ? 'text-4xl mt-8' : 'text-2xl mt-2'} font-black leading-none transition-all`}>
        如何理解尼采的「永恆輪迴」概念與存在焦慮？<span className="cursor-blink"></span>
      </div>
      
      {isExpanded && (
        <div className="mt-12 font-mono text-sm leading-relaxed text-text-main/80 space-y-6 animate-in fade-in duration-700">
          <p>&gt; 正在從本地知識庫檢索相關文獻...</p>
          <div className="p-6 bg-black/5 rounded-2xl border border-black/10">
            <p className="font-bold mb-2">尼采《查拉圖斯特拉如是說》</p>
            <p>「萬物去而復來，存在之輪永遠旋轉。萬物死而復生，存在之年永遠運行...」</p>
          </div>
          <p>永恆輪迴（Eternal Return）並非一種物理學的宇宙論，而是一種思想實驗與存在主義的重擔。它要求我們面對一個問題：如果你的生命，連同其中所有的痛苦與快樂，都將無限次地重複，你是否還能對這個生命說「是」？</p>
          <p>這種概念引發的存在焦慮在於，它剝夺了我們對「來世」或「最終救贖」的幻想，將生命的全部重量壓在「此時此刻」。</p>
        </div>
      )}

      {!isExpanded && (
        <div className="font-mono uppercase text-[11px] tracking-wider text-text-dim mt-5">
          AI 正在檢索知识庫...
        </div>
      )}
    </>
  );
}
