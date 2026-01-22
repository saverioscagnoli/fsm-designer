import { Vector2 } from "~/lib/math";
import { getWorldX, getWorldY } from "~/lib/utils";
import type { DragState } from "~/zustand/drag";
import type { MachineState } from "~/zustand/machine";
import type { PanState } from "~/zustand/pan";

function mouseMove(
  drag: DragState,
  pan: PanState,
  machine: MachineState,
  zoom: number
): (e: MouseEvent) => void {
  return e => {
    let x = getWorldX(e.clientX, pan.offset.x, zoom);
    let y = getWorldY(e.clientY, pan.offset.y, zoom);

    if (drag.isDragging && drag.id) {
      machine.mutateNode(drag.id, state => {
        state.position.x = x - drag.offset.x;
        state.position.y = y - drag.offset.y;

        return state;
      });
    } else if (pan.isPanning) {
      let panX = e.offsetX - pan.startedAt.x;
      let panY = e.offsetY - pan.startedAt.y;
      let panOffset = new Vector2(panX, panY);

      pan.setOffset(panOffset);
    }
  };
}

export { mouseMove };
