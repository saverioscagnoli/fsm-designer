import { applyNodeChanges, type NodeChange } from "@xyflow/react";
import { create } from "zustand";
import type { StateNode } from "~/components/state";
import { BASE_STATE_RADIUS } from "~/lib/consts";
import type { Position } from "~/types/position";

type MachineState = {
  nodes: Array<StateNode>;
  addNode: (p: Position) => void;

  onNodesChange: (c: NodeChange<StateNode>[]) => void;
};

const useMachine = create<MachineState>()(set => ({
  nodes: [],
  addNode: p =>
    set(s => ({
      nodes: [
        ...s.nodes,
        {
          id: s.nodes.length.toString(),
          position: p,
          type: "state",
          data: { label: `q_{${s.nodes.length}}`, radius: BASE_STATE_RADIUS }
        }
      ]
    })),
  onNodesChange: c => set(s => ({ nodes: applyNodeChanges(c, s.nodes) }))
}));

export { useMachine };
export type { MachineState };
