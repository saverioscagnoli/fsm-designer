import type { MouseEvent } from "react";
import type { ViewportState } from "~/zustand/viewport";

function stateMouseLeave(vp: ViewportState, id: string) {
  return (e: MouseEvent) => {
    // Check if left button is pressed
    let isLeftButtonPressed = (e.buttons & 1) === 1;

    if (e.shiftKey && isLeftButtonPressed) {
      vp.startCreatingEdge(id);
      return;
    }
  };
}

export { stateMouseLeave };
