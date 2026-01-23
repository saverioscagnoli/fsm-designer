import type { ViewportState } from "~/zustand/viewport";
import type { MachineState } from "~/zustand/machine";

function mouseUp(
  vp: ViewportState,
  machine: MachineState
): (e: MouseEvent) => void {
  return (e: MouseEvent) => {
    // If we're creating an edge, Shift is still held, and we're hovering over a valid target
    if (
      vp.creatingEdgeFrom !== null &&
      e.shiftKey &&
      vp.hoveredNode !== null &&
      vp.creatingEdgeFrom !== vp.hoveredNode
    ) {
      machine.addEdge(vp.creatingEdgeFrom, vp.hoveredNode);
    }

    vp.stopDragging();
    vp.stopPanning();
    vp.stopCreatingEdge();

    machine.stopDraggingEdge();
    machine.stopDraggingEndpoint();
  };
}

export { mouseUp };
