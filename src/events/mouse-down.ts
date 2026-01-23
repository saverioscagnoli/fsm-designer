import { BASE_STATE_RADIUS } from "~/lib/consts";
import { Vector2 } from "~/lib/math";
import { getWorldX, getWorldY } from "~/lib/utils";
import type { MachineState } from "~/zustand/machine";
import type { ViewportState } from "~/zustand/viewport";

function mouseDown(
  vp: ViewportState,
  machine: MachineState
): (e: MouseEvent) => void {
  return e => {
    /**
     * Ctrl + click adds a node
     */
    if (e.button == 0 && e.ctrlKey && e.target === e.currentTarget) {
      let x = getWorldX(e.offsetX, vp.panOffset.x, vp.zoom) - BASE_STATE_RADIUS;
      let y = getWorldY(e.offsetY, vp.panOffset.y, vp.zoom) - BASE_STATE_RADIUS;
      let pos = new Vector2(x, y);

      machine.addNode(pos);
      return;
    }

    /**
     * Right click to start panning
     */
    if (e.button == 2 && !e.ctrlKey && !e.shiftKey) {
      let panStart = new Vector2(e.clientX, e.clientY);

      vp.startPanning(panStart);
    }
  };
}

export { mouseDown };
