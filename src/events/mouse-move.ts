import { TOPBAR_HEIGHT } from "~/lib/consts";
import { Vector2 } from "~/lib/math";
import { getWorldX, getWorldY } from "~/lib/utils";
import type { MachineState } from "~/zustand/machine";
import type { ViewportState } from "~/zustand/viewport";

function mouseMove(
  vp: ViewportState,
  machine: MachineState
): (e: MouseEvent) => void {
  return e => {
    let x = getWorldX(e.clientX, vp.panOffset.x, vp.zoom);
    let y = getWorldY(e.clientY, vp.panOffset.y, vp.zoom);

    vp.setMousePosition(new Vector2(x, y - TOPBAR_HEIGHT));

    if (vp.isDragging && vp.dragID) {
      machine.mutateNode(vp.dragID, state => {
        state.position.x = x - vp.dragOffset.x;
        state.position.y = y - vp.dragOffset.y;

        return state;
      });
    } else if (machine.isDraggingEdge && machine.draggingEdgeId) {
      let currentX = getWorldX(e.clientX, vp.panOffset.x, vp.zoom);
      let currentY = getWorldY(e.clientY, vp.panOffset.y, vp.zoom);

      let deltaX = currentX - machine.edgeDragStart.x;
      let deltaY = currentY - machine.edgeDragStart.y;

      machine.mutateEdge(machine.draggingEdgeId, edge => {
        let newControlPoints = machine.edgeDragControlPoints.map(
          p => new Vector2(p.x + deltaX, p.y + deltaY)
        );

        return {
          ...edge,
          controlPoints: newControlPoints
        };
      });
    } else if (machine.isDraggingEndpoint && machine.draggingEndpointEdgeId) {
      let edge = machine.edges[machine.draggingEndpointEdgeId];
      if (!edge) return;

      let node =
        machine.draggingEndpointType === "start"
          ? machine.nodes[edge.from]
          : machine.nodes[edge.to];

      if (!node) return;

      let nodeCenter = new Vector2(
        node.position.x + node.radius,
        node.position.y + node.radius
      );

      let dx = x - nodeCenter.x;
      let dy = y - TOPBAR_HEIGHT - nodeCenter.y;
      let length = Math.sqrt(dx * dx + dy * dy);

      if (length === 0) return;

      let anchorX = dx / length;
      let anchorY = dy / length;

      machine.mutateEdge(machine.draggingEndpointEdgeId, e => {
        if (machine.draggingEndpointType === "start") {
          return { ...e, fromAnchor: new Vector2(anchorX, anchorY) };
        } else {
          return { ...e, toAnchor: new Vector2(anchorX, anchorY) };
        }
      });
    } else if (vp.isPanning) {
      let deltaX = e.clientX - vp.panStart.x;
      let deltaY = e.clientY - vp.panStart.y;
      let panOffset = new Vector2(
        vp.initialPanOffset.x + deltaX,
        vp.initialPanOffset.y + deltaY
      );

      vp.setPanOffset(panOffset);
    }
  };
}

export { mouseMove };
