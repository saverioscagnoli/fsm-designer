import { create } from "zustand";
import type { Position } from "~/types/node";

type DragState = {
  start: (index: number) => void;
  stop: () => void;
  isDragging: boolean;
  node: number | null;

  offset: Position;
  setOffset: (x: number, y: number) => void;
};

const useDragging = create<DragState>()(set => ({
  start: node => set(s => ({ ...s, node, isDragging: true })),

  stop: () => set(s => ({ ...s, node: null, isDragging: false })),

  isDragging: false,
  node: null,
  offset: { x: 0, y: 0 },
  setOffset: (x, y) => set(s => ({ ...s, offset: { x, y } }))
}));

export { useDragging };
