import { create } from "zustand";
import type { Position } from "~/types/position";

type ControlState = {
  /* Dragging */
  /* The id of the node that is being dragged, if any. */
  dragID: string | null;
  startDragging: (id: string) => void;
  stopDragging: () => void;

  /* Panning */
  panning: boolean;
  panningStart: Position | null;
  panningOffset: Position;
  setPanningOffset: (v: Position) => void;
  panningStartOffset: Position;
  setPanningStartOffset: (v: Position) => void;
  startPanning: (where: Position) => void;
  stopPanning: () => void;

  /* Zoom */
  zoom: number;
  setZoom: (v: number) => void;

  worldToScreen: (pos: Position) => Position;
};

const useControls = create<ControlState>()((set, get) => ({
  dragID: null,
  startDragging: id => set(() => ({ dragID: id })),
  stopDragging: () => set(() => ({ dragID: null })),

  panning: false,
  panningStart: null,
  panningOffset: { x: 0, y: 0 },
  setPanningOffset: v => set(() => ({ panningOffset: v })),
  panningStartOffset: { x: 0, y: 0 },
  setPanningStartOffset: v => set(() => ({ panningStartOffset: v })),
  startPanning: where =>
    set(s => ({
      panning: true,
      panningStart: where,
      panningStartOffset: s.panningOffset
    })),
  stopPanning: () => set(() => ({ panning: false, panningStart: null })),
  zoom: 1,
  setZoom: v => set(() => ({ zoom: v })),
  worldToScreen: pos => {
    let { panningOffset, zoom } = get();

    return {
      x: (pos.x - panningOffset.x) / zoom,
      y: (pos.y - panningOffset.y) / zoom
    };
  }
}));

export { useControls };
export type { ControlState };
