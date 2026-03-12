'use client';
export function SettingsModule() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="dot-matrix" style={{ gridTemplateColumns: 'repeat(3, 4px)' }}>
        {Array(9).fill(0).map((_, i) => (
          <div key={i} className="dot active"></div>
        ))}
      </div>
    </div>
  );
}
