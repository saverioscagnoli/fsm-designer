import { create } from "zustand";
import type { Position } from "~/types/node";

type PanningState = {
  start: (x: number, y: number) => void;
  stop: () => void;
  isPanning: boolean;
  startedAt: Position;

  offset: Position;
  setOffset: (x: number, y: number) => void;
};

const usePanning = create<PanningState>(set => ({
  start: (x, y) => set(s => ({ ...s, startedAt: { x, y }, isPanning: true })),
  stop: () => set(s => ({ ...s, isPanning: false })),
  isPanning: false,
  startedAt: { x: 0, y: 0 },

  offset: { x: 0, y: 0 },
  setOffset: (x, y) => set(s => ({ ...s, offset: { x, y } }))
}));

export { usePanning };
