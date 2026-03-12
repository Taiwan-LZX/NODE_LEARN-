'use client';

import { HTMLMotionProps, motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useLayoutStore } from '@/src/core/layout/useLayoutStore';
import { MODULE_REGISTRY } from '@/src/core/layout/ModuleRegistry';

interface ModuleContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  theme?: 'light' | 'dark' | 'red';
  colSpan?: 1 | 2 | 3 | 4 | 5;
  rowSpan?: 1 | 2 | 3 | 4 | 5;
  shape?: 'square' | 'rect' | 'circle';
  moduleId?: string;
  isDragTarget?: boolean;
}

export function ModuleContainer({ 
  children, 
  className, 
  theme = 'light', 
  colSpan = 1,
  rowSpan = 1,
  shape = 'rect',
  moduleId,
  isDragTarget,
  ...props
}: ModuleContainerProps) {
  const removeModule = useLayoutStore(s => s.removeModule);
  const setExpandedModule = useLayoutStore(s => s.setExpandedModule);
  const [showConfirm, setShowConfirm] = useState(false);

  const isExpandable = moduleId ? MODULE_REGISTRY[moduleId]?.expandable : false;

  const themeClasses = {
    light: 'bg-card-white text-text-main border border-black/5',
    dark: 'bg-card-black text-white',
    red: 'bg-accent-red text-white flex-col justify-center items-center text-center',
  };

  const shapeClasses = {
    square: 'aspect-square',
    rect: '',
    circle: 'rounded-full aspect-square place-self-center w-full max-w-full max-h-full flex items-center justify-center text-center',
  };

  const colSpanClass = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-2 md:col-span-3',
    4: 'col-span-2 md:col-span-4',
    5: 'col-span-2 md:col-span-4 lg:col-span-5',
  }[colSpan] || 'col-span-1';

  const rowSpanClass = {
    1: 'row-span-1',
    2: 'row-span-1 md:row-span-2',
    3: 'row-span-1 md:row-span-3',
    4: 'row-span-1 md:row-span-4',
    5: 'row-span-1 md:row-span-4 lg:row-span-5',
  }[rowSpan] || 'row-span-1';

  const handleClick = () => {
    if (isExpandable && moduleId) {
      setExpandedModule(moduleId);
    }
  };

  return (
    <motion.div
      layout
      layoutId={moduleId ? `module-${moduleId}` : undefined}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={isDragTarget ? { scale: 0.92, rotate: -2, opacity: 0.7, y: 4 } : { opacity: 1, scale: 1, rotate: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      whileHover={{ scale: 0.98 }}
      whileTap={{ scale: 0.95 }}
      // 修改：将瞬间弹射的物理效果 (stiffness: 400) 改为缓慢挤开的厚重感 (stiffness: 120, mass: 1.2)
      transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 1.2 }}
      onClick={handleClick}
      className={cn(
        'group p-6 flex flex-col justify-between relative overflow-hidden cursor-grab active:cursor-grabbing',
        shape === 'circle' ? 'rounded-full' : 'rounded-[32px]',
        themeClasses[theme],
        shapeClasses[shape],
        colSpanClass,
        rowSpanClass,
        className
      )}
      {...props}
    >
      {moduleId && !showConfirm && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowConfirm(true);
          }}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20 w-8 h-8 bg-black/20 rounded-full flex items-center justify-center hover:bg-accent-red hover:text-white text-white cursor-pointer"
        >
          <X size={16} />
        </button>
      )}

      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-card-black/90 backdrop-blur-md flex flex-col items-center justify-center text-white p-4"
          >
            <div className="font-mono text-sm mb-4 text-center tracking-widest">REMOVE MODULE?</div>
            <div className="flex gap-4">
              <button 
                onClick={(e) => { e.stopPropagation(); removeModule(moduleId!); }} 
                className="px-6 py-2 bg-accent-red rounded-full font-bold text-xs hover:scale-105 transition-transform"
              >
                YES
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }} 
                className="px-6 py-2 bg-white/20 rounded-full font-bold text-xs hover:scale-105 transition-transform"
              >
                NO
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </motion.div>
  );
}
