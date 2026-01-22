import { Vector2 } from "~/lib/math";
import { createShallow } from "~/zustand/shallow";

type PanState = {
  start: (v: Vector2) => void;
  stop: () => void;
  isPanning: boolean;
  startedAt: Vector2;
  offset: Vector2;
  setOffset: (v: Vector2) => void;
};

const usePanning = createShallow<PanState>(set => ({
  start: v => set(s => ({ startedAt: v, isPanning: true })),
  stop: () => set(s => ({ isPanning: false })),
  isPanning: false,
  startedAt: Vector2.ZERO,
  offset: Vector2.ZERO,
  setOffset: v => set(s => ({ offset: v }))
}));

export { usePanning };
export type { PanState };
