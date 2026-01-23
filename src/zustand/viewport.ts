import { Vector2 } from "~/lib/math";
import { createShallow } from "~/zustand/shallow";

type ViewportState = {
  /**
   * Dragging
   */
  startDragging: (id: string) => void;
  stopDragging: () => void;
  isDragging: boolean;
  dragID: string | null;
  dragOffset: Vector2;
  setDragOffset: (v: Vector2) => void;

  /**
   * Panning
   */
  startPanning: (v: Vector2) => void;
  stopPanning: () => void;
  isPanning: boolean;
  panStart: Vector2;
  panOffset: Vector2;
  initialPanOffset: Vector2;
  setPanOffset: (v: Vector2) => void;

  zoom: number;
  setZoom: (v: number) => void;

  mousePosition: Vector2;
  setMousePosition: (v: Vector2) => void;
  startCreatingEdge: (id: string) => void;
  stopCreatingEdge: () => void;
  creatingEdgeFrom: string | null;

  hoveredNode: string | null;
  setHoveredNode: (id: string | null) => void;
};

const useViewport = createShallow<ViewportState>(set => ({
  startDragging: id => set(() => ({ dragID: id, isDragging: true })),
  stopDragging: () => set(() => ({ id: null, isDragging: false })),
  isDragging: false,
  dragID: null,
  dragOffset: Vector2.ZERO,
  setDragOffset: v => set(() => ({ dragOffset: v })),

  startPanning: v =>
    set(s => ({ panStart: v, initialPanOffset: s.panOffset, isPanning: true })),
  stopPanning: () => set(() => ({ isPanning: false })),
  isPanning: false,
  panStart: Vector2.ZERO,
  initialPanOffset: Vector2.ZERO,
  panOffset: Vector2.ZERO,
  setPanOffset: v => set(() => ({ panOffset: v })),
  zoom: 1,
  setZoom: v => set(() => ({ zoom: v })),

  mousePosition: Vector2.ZERO,
  setMousePosition: v => set(() => ({ mousePosition: v })),
  startCreatingEdge: id => set(() => ({ creatingEdgeFrom: id })),
  stopCreatingEdge: () => set(() => ({ creatingEdgeFrom: null })),
  creatingEdgeFrom: null,

  hoveredNode: null,
  setHoveredNode: id => set(() => ({ hoveredNode: id }))
}));

export { useViewport };
export type { ViewportState };
