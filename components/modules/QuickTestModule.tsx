'use client';
import { ModuleProps } from '@/src/core/layout/ModuleRegistry';

export function QuickTestModule({ isExpanded }: ModuleProps) {
  return (
    <>
      <div className="font-mono uppercase text-[11px] tracking-wider">QUICK_TEST</div>
      <div className={`${isExpanded ? 'text-4xl mt-8' : 'text-lg mt-2'} font-black leading-none transition-all`}>意向性 (Intentionality)</div>
      <div className="font-mono uppercase text-[11px] tracking-wider text-accent-red mt-2">待複習</div>
      
      {isExpanded && (
        <div className="mt-12 animate-in fade-in duration-700">
          <div className="p-6 bg-black/5 rounded-2xl border border-black/10 mb-6">
            <p className="font-bold mb-4">問題：</p>
            <p className="text-lg">在胡塞爾的現象學中，「意向性」的核心特徵是什麼？</p>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left p-4 rounded-xl border border-black/10 hover:bg-black/5 transition-colors">
              A. 意識总是关于某物的意识
            </button>
            <button className="w-full text-left p-4 rounded-xl border border-black/10 hover:bg-black/5 transition-colors">
              B. 人的自由意志决定行为
            </button>
            <button className="w-full text-left p-4 rounded-xl border border-black/10 hover:bg-black/5 transition-colors">
              C. 潜意识对梦境的投射
            </button>
          </div>
        </div>
      )}
    </>
  );
}
