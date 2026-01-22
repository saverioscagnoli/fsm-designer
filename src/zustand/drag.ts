import { Vector2 } from "~/lib/math";
import { createShallow } from "~/zustand/shallow";

type DragState = {
  start: (id: string) => void;
  stop: () => void;
  isDragging: boolean;
  id: string | null;
  offset: Vector2;
  setOffset: (v: Vector2) => void;
};

const useDragging = createShallow<DragState>(set => ({
  start: id => set(s => ({ id, isDragging: true })),
  stop: () => set(s => ({ id: null, isDragging: false })),
  isDragging: false,
  id: null,
  offset: Vector2.ZERO,
  setOffset: v => set(s => ({ offset: v }))
}));

export { useDragging };
export type { DragState };
