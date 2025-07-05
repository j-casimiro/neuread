import { create } from 'zustand';
// Uncomment the next line if you want to enable devtools
// import { devtools } from 'zustand/middleware';

export type ViewMode = 'network' | 'stack';

export interface Node {
  id: string;
  title: string;
  content: string;
  x: number;
  y: number;
  parentId?: string | null;
}

interface AppState {
  view: ViewMode;
  setView: (view: ViewMode) => void;

  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;

  isDarkMode: boolean;
  toggleDarkMode: () => void;

  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  moveNode: (id: string, x: number, y: number) => void;
}

const enableDevtools = false; // Set to true to enable Zustand devtools

const baseStore = (set: any): AppState => ({
  view: 'network',
  setView: (view) => set({ view }),

  selectedNoteId: null,
  setSelectedNoteId: (id) => set({ selectedNoteId: id }),

  isDarkMode: false,
  toggleDarkMode: () =>
    set((state: AppState) => ({ isDarkMode: !state.isDarkMode })),

  nodes: [],
  setNodes: (nodes) => set({ nodes }),
  addNode: (node) =>
    set((state: AppState) => ({ nodes: [...state.nodes, node] })),
  updateNode: (id, updates) =>
    set((state: AppState) => ({
      nodes: state.nodes.map((n: Node) =>
        n.id === id ? { ...n, ...updates } : n
      ),
    })),
  moveNode: (id, x, y) =>
    set((state: AppState) => ({
      nodes: state.nodes.map((n: Node) => (n.id === id ? { ...n, x, y } : n)),
    })),
});

export const useAppStore = enableDevtools
  ? create(/*devtools(*/ baseStore /*)*/)
  : create(baseStore);
