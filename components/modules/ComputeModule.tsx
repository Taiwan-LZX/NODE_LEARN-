'use client';
export function ComputeModule() {
  return (
    <>
      <div className="font-mono uppercase text-[11px] tracking-wider">COMPUTE</div>
      <div>
        <div className="font-mono uppercase text-[11px] tracking-wider">LLM: QWEN_2.5_7B</div>
        <div className="w-full h-1 bg-black/10 rounded-sm mt-3">
          <div className="h-full bg-card-black rounded-sm" style={{ width: '65%' }}></div>
        </div>
        <div className="font-mono uppercase text-[9px] tracking-wider mt-2">TOKEN_GEN: 45 T/S</div>
      </div>
    </>
  );
}
