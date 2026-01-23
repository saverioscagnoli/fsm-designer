import type { MouseEvent } from "react";
import { Vector2 } from "~/lib/math";
import { getWorldX, getWorldY } from "~/lib/utils";
import type { MachineState } from "~/zustand/machine";
import type { ViewportState } from "~/zustand/viewport";

function onGrab(
  vp: ViewportState,
  machine: MachineState
): (id: string, e: MouseEvent) => void {
  return (id, e) => {
    if (vp.isDragging || vp.creatingEdgeFrom || e.ctrlKey || e.shiftKey) return;

    let node = machine.nodes[id];
    if (!node) return;

    vp.startDragging(id);

    let x = getWorldX(e.clientX, vp.panOffset.x, vp.zoom) - node.position.x;
    let y = getWorldY(e.clientY, vp.panOffset.y, vp.zoom) - node.position.y;
    let pos = new Vector2(x, y);

    vp.setDragOffset(pos);
  };
}

export { onGrab };
