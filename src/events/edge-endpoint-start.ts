import type { MachineState } from "~/zustand/machine";

function edgeEndpointStart(
  machine: MachineState
): (edgeId: string, type: "start" | "end", e: React.MouseEvent) => void {
  return (
    edgeId: string,
    type: "start" | "end",
    startEvent: React.MouseEvent
  ) => {
    startEvent.stopPropagation();

    let edge = machine.edges[edgeId];
    if (!edge) return;

    let node =
      type === "start" ? machine.nodes[edge.from] : machine.nodes[edge.to];

    if (!node) return;

    machine.startDraggingEndpoint(edgeId, type);
  };
}

export { edgeEndpointStart };
