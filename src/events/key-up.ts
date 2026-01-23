import type { ViewportState } from "~/zustand/viewport";

function KeyUp(vp: ViewportState): (e: KeyboardEvent) => void {
  return e => {
    if (e.key === "Shift") {
      // Cancel edge creation when Shift is released
      vp.stopCreatingEdge();
      return;
    }
  };
}

export { KeyUp };
