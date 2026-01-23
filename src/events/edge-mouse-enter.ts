import type { MachineState } from "~/zustand/machine";

function edgeMouseEnter(machine: MachineState): (id: string) => void {
  return (id: string) => {
    machine.setHoveredEdge(id);
  };
}

export { edgeMouseEnter };
