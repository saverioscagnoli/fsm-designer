import { create } from "zustand";
import { Vector2 } from "~/lib/math";

type DragState = {
  start: (index: number) => void;
  stop: () => void;
  isDragging: boolean;
  node: number | null;

  offset: Vector2;
  setOffset: (v: Vector2) => void;
};

const useDragging = create<DragState>()(set => ({
  start: node => set(s => ({ ...s, node, isDragging: true })),

  stop: () => set(s => ({ ...s, node: null, isDragging: false })),

  isDragging: false,
  node: null,
  offset: Vector2.ZERO,
  setOffset: v => set(s => ({ ...s, offset: v }))
}));

export { useDragging };
