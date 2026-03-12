'use client';
import { useEffect, useState } from 'react';
export function SystemStatusModule() {
  const [time, setTime] = useState('00:00');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div className="font-mono uppercase text-[11px] tracking-wider">SYSTEM_STATUS</div>
      <div>
        <div className="font-mono text-[40px] font-bold leading-none">{time}</div>
        <div className="font-mono uppercase text-[11px] tracking-wider text-[#555] mt-1">LOC_TOKYO_HUB</div>
      </div>
    </>
  );
}
