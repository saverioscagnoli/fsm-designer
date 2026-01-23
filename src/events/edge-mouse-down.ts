import { Vector2 } from "~/lib/math";
import { getWorldX, getWorldY } from "~/lib/utils";
import type { MachineState } from "~/zustand/machine";
import type { ViewportState } from "~/zustand/viewport";

function edgeMouseDown(
  vp: ViewportState,
  machine: MachineState
): (edgeId: string, e: React.MouseEvent) => void {
  return (edgeId: string, startEvent: React.MouseEvent) => {
    startEvent.stopPropagation();

    let data = machine.getEdgePoints(edgeId);
    if (!data) return;

    let startPos = new Vector2(
      getWorldX(startEvent.clientX, vp.panOffset.x, vp.zoom),
      getWorldY(startEvent.clientY, vp.panOffset.y, vp.zoom)
    );

    machine.startDraggingEdge(edgeId, startPos, data.controlPoints);
  };
}

export { edgeMouseDown };
