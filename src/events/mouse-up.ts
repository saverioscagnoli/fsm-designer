import type { DragState } from "~/zustand/drag";
import type { PanState } from "~/zustand/pan";

function mouseUp(drag: DragState, pan: PanState): () => void {
  return () => {
    drag.stop();
    pan.stop();
  };
}

export { mouseUp };
