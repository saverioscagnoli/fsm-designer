import type { MouseEvent } from "react";
import { Vector2 } from "~/lib/math";
import { getWorldX, getWorldY } from "~/lib/utils";
import type { DragState } from "~/zustand/drag";
import type { MachineState } from "~/zustand/machine";
import type { PanState } from "~/zustand/pan";

function onGrab(
  drag: DragState,
  pan: PanState,
  machine: MachineState,
  zoom: number
): (id: string, e: MouseEvent) => void {
  return (id, e) => {
    if (drag.isDragging) return;

    let node = machine.nodes[id];
    if (!node) return;

    drag.start(id);

    let x = getWorldX(e.clientX, pan.offset.x, zoom) - node.position.x;
    let y = getWorldY(e.clientY, pan.offset.y, zoom) - node.position.y;
    let pos = new Vector2(x, y);

    drag.setOffset(pos);
  };
}

export { onGrab };
