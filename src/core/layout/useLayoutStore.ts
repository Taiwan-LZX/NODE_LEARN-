import { create } from 'zustand';

interface LayoutState {
  activeModules: string[];
  availableModules: string[];
  expandedModule: string | null;
  addModule: (id: string) => void;
  removeModule: (id: string) => void;
  moveModule: (fromIndex: number, toIndex: number) => void;
  setExpandedModule: (id: string | null) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  activeModules: [],
  availableModules: [
    'system-status', 'ai-chat', 'focus', 'vulnerability',
    'knowledge-graph', 'compute', 'quick-test', 'settings'
  ],
  expandedModule: null,
  addModule: (id) => set((state) => ({
    activeModules: [...state.activeModules, id],
    availableModules: state.availableModules.filter(m => m !== id)
  })),
  removeModule: (id) => set((state) => ({
    activeModules: state.activeModules.filter(m => m !== id),
    availableModules: [...state.availableModules, id],
    expandedModule: state.expandedModule === id ? null : state.expandedModule
  })),
  moveModule: (fromIndex, toIndex) => set((state) => {
    const newActive = [...state.activeModules];
    const [moved] = newActive.splice(fromIndex, 1);
    newActive.splice(toIndex, 0, moved);
    return { activeModules: newActive };
  }),
  setExpandedModule: (id) => set({ expandedModule: id })
}));
