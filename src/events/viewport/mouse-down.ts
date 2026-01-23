import { type ReactFlowInstance } from "@xyflow/react";
import { BASE_STATE_RADIUS } from "~/lib/consts";
import type { MachineState } from "~/zustand/machine";

function viewportMouseDown(
  m: MachineState,
  flow: ReactFlowInstance
): (e: MouseEvent) => void {
  return e => {
    if (e.ctrlKey && e.button == 0) {
      let pos = flow.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY
      });

      pos.x -= BASE_STATE_RADIUS;
      pos.y -= BASE_STATE_RADIUS;

      m.addNode(pos);
    }
  };
}

export { viewportMouseDown };
