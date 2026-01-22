import { BASE_STATE_RADIUS } from "~/lib/consts";
import { Vector2 } from "~/lib/math";
import { getWorldX, getWorldY } from "~/lib/utils";
import type { MachineState } from "~/zustand/machine";
import type { PanState } from "~/zustand/pan";

function mouseDown(
  pan: PanState,
  machine: MachineState,
  zoom: number
): (e: MouseEvent) => void {
  return e => {
    /**
     * Ctrl + click adds a node
     */
    if (e.button == 0 && e.ctrlKey) {
      let x = getWorldX(e.offsetX, pan.offset.x, zoom) - BASE_STATE_RADIUS;
      let y = getWorldY(e.offsetY, pan.offset.y, zoom) - BASE_STATE_RADIUS;
      let pos = new Vector2(x, y);

      machine.addNode(pos);
      return;
    }

    /**
     * Right click to start panning
     */
    if (e.button == 2 && !e.ctrlKey && !e.shiftKey) {
      let x = e.offsetX - pan.offset.x;
      let y = e.offsetY - pan.offset.y;
      let panStart = new Vector2(x, y);

      pan.start(panStart);
    }
  };
}

export { mouseDown };
