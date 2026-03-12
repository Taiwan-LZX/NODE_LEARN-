'use client';

import { useState, useRef } from 'react';
import { useLayoutStore } from '@/src/core/layout/useLayoutStore';
import { MODULE_REGISTRY } from '@/src/core/layout/ModuleRegistry';
import { ModuleContainer } from './ModuleContainer';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export function LayoutEngine() {
  const activeModules = useLayoutStore(s => s.activeModules);
  const moveModule = useLayoutStore(s => s.moveModule);
  const expandedModule = useLayoutStore(s => s.expandedModule);
  const setExpandedModule = useLayoutStore(s => s.setExpandedModule);
  
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoveredTargetIndex, setHoveredTargetIndex] = useState<number | null>(null);
  const swapTimerRef = useRef<NodeJS.Timeout | null>(null);

  return (
    <>
      <div 
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full max-w-[1200px] mx-auto p-4"
        style={{
          gridAutoRows: '160px',
          gridAutoFlow: 'dense' // 优化填充算法，解决镂空问题
        }}
      >
        <AnimatePresence mode="popLayout">
          {activeModules.map((id, index) => {
            const config = MODULE_REGISTRY[id];
            if (!config) return null;
            const Component = config.component;
            
            // 如果模块被展开，在网格中保留一个透明占位符，保持布局稳定
            if (expandedModule === id) {
              return (
                <div 
                  key={`placeholder-${id}`} 
                  className={`col-span-${config.colSpan || 1} row-span-${config.rowSpan || 1}`}
                />
              );
            }

            // 算法：智能形态扩张填充
            // 根据模块的 shape 属性决定扩张策略，防止圆形或方形被拉伸变形
            let dynamicColSpan = config.colSpan || 1;
            let dynamicRowSpan = config.rowSpan || 1;
            
            if (config.shape === 'rect') {
              // 矩形可以自由拉伸
              if (activeModules.length === 1) {
                dynamicColSpan = 5;
                dynamicRowSpan = 4;
              } else if (activeModules.length === 2) {
                dynamicColSpan = index === 0 ? 3 : 2;
                dynamicRowSpan = 3;
              } else if (activeModules.length === 3) {
                dynamicColSpan = index === 0 ? 3 : 2;
                dynamicRowSpan = 2;
              }
            } else if (config.shape === 'square') {
              // 方形保持等宽等高
              if (activeModules.length === 1) {
                dynamicColSpan = 3;
                dynamicRowSpan = 3;
              } else if (activeModules.length <= 3) {
                dynamicColSpan = 2;
                dynamicRowSpan = 2;
              }
            } else if (config.shape === 'circle') {
              // 圆形保持其配置的比例，但通过 CSS (max-w-full max-h-full) 确保它不会溢出网格
              if (activeModules.length === 1) {
                dynamicColSpan = 3;
                dynamicRowSpan = 3;
              } else if (activeModules.length <= 3) {
                dynamicColSpan = 2;
                dynamicRowSpan = 2;
              }
            }

            return (
              <ModuleContainer
                key={id}
                moduleId={id}
                theme={config.theme}
                colSpan={dynamicColSpan as any}
                rowSpan={dynamicRowSpan as any}
                shape={config.shape}
                draggable
                isDragTarget={hoveredTargetIndex === index}
                className={draggedIndex === index ? 'opacity-40 scale-95 z-0' : 'z-10'}
                onDragStart={(e: any) => {
                  setDraggedIndex(index);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragEnter={(e: any) => {
                  e.preventDefault();
                }}
                onDragOver={(e: any) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (draggedIndex !== null && draggedIndex !== index && hoveredTargetIndex !== index) {
                    setHoveredTargetIndex(index);
                    if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
                    swapTimerRef.current = setTimeout(() => {
                      moveModule(draggedIndex, index);
                      setDraggedIndex(index);
                      setHoveredTargetIndex(null);
                    }, 350); // 350ms anticipation delay before swapping
                  }
                }}
                onDragLeave={(e: any) => {
                  if (hoveredTargetIndex === index) {
                    setHoveredTargetIndex(null);
                    if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
                  }
                }}
                onDrop={(e: any) => {
                  e.preventDefault();
                  if (draggedIndex !== null && draggedIndex !== index) {
                    moveModule(draggedIndex, index);
                    setDraggedIndex(null);
                    setHoveredTargetIndex(null);
                    if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
                  }
                }}
                onDragEnd={() => {
                  setDraggedIndex(null);
                  setHoveredTargetIndex(null);
                  if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
                }}
              >
                <Component />
              </ModuleContainer>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 扩张动画的半透明页面 (Expanded Overlay) */}
      <AnimatePresence>
        {expandedModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-md p-4 md:p-12"
            onClick={() => setExpandedModule(null)}
          >
            <motion.div
              layoutId={`module-${expandedModule}`}
              className="w-full max-w-5xl h-[85vh] bg-card-white rounded-[48px] shadow-2xl overflow-hidden relative cursor-default border border-black/10 flex flex-col"
              onClick={(e) => e.stopPropagation()}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <button
                onClick={() => setExpandedModule(null)}
                className="absolute top-8 right-8 z-50 w-12 h-12 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
              
              <div className="w-full h-full p-8 md:p-16 overflow-y-auto">
                {(() => {
                  const config = MODULE_REGISTRY[expandedModule];
                  if (!config) return null;
                  const Component = config.component;
                  return <Component isExpanded={true} />;
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
