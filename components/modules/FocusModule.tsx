'use client';
export function FocusModule() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full">
      {/* Decorative circular track */}
      <div className="absolute inset-0 rounded-full border border-white/20 border-dashed pointer-events-none" />
      <div className="absolute inset-0 rounded-full border-t-2 border-white pointer-events-none animate-[spin_10s_linear_infinite]" />
      
      <div className="font-mono uppercase text-[9px] tracking-[0.2em] opacity-70 mb-1">FOCUS</div>
      <div className="font-mono text-4xl font-bold leading-none tracking-tighter">42</div>
      <div className="font-mono uppercase text-[9px] tracking-[0.2em] opacity-70 mt-1">MIN</div>
    </div>
  );
}
