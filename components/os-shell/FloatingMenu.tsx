'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutStore } from '@/src/core/layout/useLayoutStore';
import { MODULE_REGISTRY } from '@/src/core/layout/ModuleRegistry';

export function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const availableModules = useLayoutStore(s => s.availableModules);
  const addModule = useLayoutStore(s => s.addModule);

  return (
    <div className="fixed top-8 left-8 z-50">
      <motion.button
        layout
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-card-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform cursor-pointer"
      >
        <div className="dot-matrix" style={{ gridTemplateColumns: 'repeat(3, 4px)' }}>
          {Array(9).fill(0).map((_, i) => (
            <div key={i} className="dot active"></div>
          ))}
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -20, y: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -20, y: -20 }}
            className="absolute top-20 left-0 bg-card-white border border-black/10 p-4 rounded-[24px] shadow-2xl w-64 flex flex-col gap-2 origin-top-left"
          >
            <h3 className="font-mono text-[11px] tracking-wider text-text-dim mb-2 px-2">AVAILABLE MODULES</h3>
            {availableModules.length === 0 && (
              <div className="text-sm text-text-dim px-2 font-mono">All modules active</div>
            )}
            {availableModules.map(id => (
              <button
                key={id}
                onClick={() => addModule(id)}
                className="text-left px-4 py-3 rounded-xl hover:bg-black/5 transition-colors font-mono text-xs font-bold flex items-center gap-3 cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-accent-red"></div>
                {MODULE_REGISTRY[id].name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
