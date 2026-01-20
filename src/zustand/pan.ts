import { create } from "zustand";
import { Vector2 } from "~/lib/math";
import type { Position } from "~/types/node";

type PanningState = {
  start: (v: Vector2) => void;
  stop: () => void;
  isPanning: boolean;
  startedAt: Vector2;

  offset: Vector2;
  setOffset: (v: Vector2) => void;
};

const usePanning = create<PanningState>(set => ({
  start: v => set(s => ({ ...s, startedAt: v, isPanning: true })),
  stop: () => set(s => ({ ...s, isPanning: false })),
  isPanning: false,
  startedAt: Vector2.ZERO,
  offset: Vector2.ZERO,
  setOffset: v => set(s => ({ ...s, offset: v }))
}));

export { usePanning };
