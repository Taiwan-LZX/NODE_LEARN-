# Nothing OS - Web UI Standard Guide

This document serves as the standard guideline and changelog for the UI architecture of this application. It ensures consistency across all future UI generations and modifications.

## 1. Core Philosophy (核心理念)
* **Aesthetic**: Monochrome (Black/White) with stark Red (`#EB0000`) accents.
* **Typography**: Monospace fonts for data/labels, heavy sans-serif for headings.
* **Grid System**: Bento Grid layout with dense packing to eliminate visual holes.
* **Physics**: Fluid, heavy, and deliberate spring animations. Nothing feels "instant" or "snappy"; everything has mass.

## 2. Animation & Physics Standard (动画与物理反馈标准)
All interactive elements must use `framer-motion` with specific spring physics to simulate mass and resistance.

### Standard Spring Config
```javascript
// Use this for layout transitions, drag & drop, and expansions
transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 1.2 }}
```

## 3. Layout & Grid Algorithm (布局与网格算法)
The `LayoutEngine` uses CSS Grid with `grid-auto-flow: dense` to automatically pack items. 

### Auto-Expansion & Filler Algorithm (自动扩张与平面填充)
To prevent the screen from looking empty when modules are removed, the system implements a dynamic fill algorithm:
1. **Dynamic Span**: If active modules are ≤ 3, they automatically expand their `colSpan` and `rowSpan` to take up more space.
2. **Decorative Fillers**: If active modules are < 4, the system injects blank, semi-transparent decorative blocks (`bg-card-black` / `bg-card-white`) to maintain the structural integrity of the grid.

---

## 4. Modification History & Standards (修改记录与标准范例)

### [MODIFIED] Drag & Drop Elasticity (拖拽弹性物理)
* **Original**: `transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}` (Instant snap)
* **Modified**: `transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 1.2 }}` (Slow squeeze)
* **Description**: Changed the drag-and-drop collision effect from an instant pop to a slow, heavy "squeeze" effect. Modules now feel like they have mass and push each other out of the way gradually, resembling a ball slowly squeezing into a tight space before snapping.

### [MODIFIED] Shape-Aware Auto-Expansion (智能形态扩张算法)
* **Modified**: Dynamic `colSpan` and `rowSpan` calculation in `LayoutEngine.tsx`.
* **Removed**: Decorative filler blocks (`bg-card-black` / `bg-card-white`) have been completely removed to keep the interface clean and avoid "extra black frames".
* **Description**: The auto-expansion algorithm is now **shape-aware**. 
  * `rect` modules expand aggressively to fill space (up to 5x4 if alone).
  * `square` modules expand symmetrically (up to 3x3) to maintain their aspect ratio.
  * `circle` modules **never expand** (locked to 1x1) to ensure they remain standard-sized circular buttons and never distort into giant ovals.

### [ADDED] Drag Anticipation & Reaction (拖拽预备与碰撞反馈)
* **Added**: `hoveredTargetIndex` state and a 350ms anticipation delay in `LayoutEngine.tsx`.
* **Added**: `isDragTarget` prop and corresponding `animate` states (`scale: 0.92, rotate: -2, opacity: 0.7`) in `ModuleContainer.tsx`.
* **Description**: Replaced the instant, rigid drag-and-drop swap with a "handshake" anticipation phase. When a module is dragged over another, the target module visually reacts (shrinks, tilts, and dims) as if being "called out" or squeezed. After a 350ms delay (or upon dropping), the actual layout swap occurs. This creates a much more natural, deliberate, and physical interaction.
* **Added**: `expandedModule` state in Zustand store.
* **Added**: `AnimatePresence` overlay in `LayoutEngine.tsx` with `layoutId` matching the module.
* **Description**: Allows specific modules (e.g., AI Chat, Knowledge Graph) to be clicked and expanded into a full-screen, centered hero view with a backdrop blur, providing a seamless transition from grid item to focused view.

### [ADDED] Floating Origin Menu (悬浮原点菜单)
* **Added**: `FloatingOrigin` component in the top-left corner.
* **Description**: Acts as a storage hub for inactive modules. Modules removed from the grid return to this origin, keeping the interface clean while allowing easy retrieval.
