'use client';
import { ModuleProps } from '@/src/core/layout/ModuleRegistry';

export function KnowledgeGraphModule({ isExpanded }: ModuleProps) {
  return (
    <>
      <div className="font-mono uppercase text-[11px] tracking-wider">KNOWLEDGE_GRAPH</div>
      <div className="mb-10">
        <div className={`${isExpanded ? 'text-4xl mt-8' : 'text-2xl mt-2'} font-black leading-none transition-all`}>哲學導論 : 第一章</div>
        <div className="font-mono uppercase text-[11px] tracking-wider text-accent-red mt-2">
          &gt;&gt; 發現 4 個未關聯節點
        </div>
      </div>
      
      {isExpanded ? (
        <div className="w-full h-96 mt-8 border border-white/10 rounded-3xl relative overflow-hidden bg-black/20 flex items-center justify-center animate-in fade-in duration-700">
           <svg width="100%" height="100%" viewBox="0 0 400 300">
            <circle cx="200" cy="150" r="8" fill="white"/>
            <text x="215" y="155" fill="white" fontSize="12" fontFamily="monospace">存在主義</text>
            
            <circle cx="100" cy="80" r="6" fill="white" opacity="0.6"/>
            <text x="115" y="85" fill="white" fontSize="10" opacity="0.6" fontFamily="monospace">尼采</text>
            
            <circle cx="300" cy="100" r="6" fill="white" opacity="0.6"/>
            <text x="315" y="105" fill="white" fontSize="10" opacity="0.6" fontFamily="monospace">薩特</text>
            
            <circle cx="150" cy="250" r="6" fill="#EB0000"/>
            <text x="165" y="255" fill="#EB0000" fontSize="10" fontFamily="monospace">未關聯: 虛無主義</text>

            <line x1="200" y1="150" x2="100" y2="80" stroke="white" strokeWidth="1" opacity="0.3"/>
            <line x1="200" y1="150" x2="300" y2="100" stroke="white" strokeWidth="1" opacity="0.3"/>
            <line x1="200" y1="150" x2="150" y2="250" stroke="#EB0000" strokeWidth="1" strokeDasharray="4"/>
          </svg>
        </div>
      ) : (
        <>
          <svg className="absolute -right-5 -bottom-5 opacity-10 hidden md:block" width="200" height="200" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="2" fill="white"/>
            <circle cx="20" cy="30" r="2" fill="white"/>
            <circle cx="80" cy="40" r="2" fill="white"/>
            <circle cx="40" cy="80" r="2" fill="white"/>
            <line x1="50" y1="50" x2="20" y2="30" stroke="white" strokeWidth="0.5"/>
            <line x1="50" y1="50" x2="80" y2="40" stroke="white" strokeWidth="0.5"/>
            <line x1="50" y1="50" x2="40" y2="80" stroke="white" strokeWidth="0.5"/>
          </svg>
          <div className="font-mono uppercase text-[11px] tracking-wider z-10 mt-auto">點擊進入畫布視圖</div>
        </>
      )}
    </>
  );
}
