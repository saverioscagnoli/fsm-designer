import type { MachineState } from "~/zustand/machine";

function edgeMouseLeave(machine: MachineState): () => void {
  return () => {
    machine.setHoveredEdge(null);
  };
}

export { edgeMouseLeave };
