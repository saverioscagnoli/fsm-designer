import { BASE_STATE_RADIUS } from "~/lib/consts";
import type { Vector2 } from "~/lib/math";
import { createShallow } from "~/zustand/shallow";

type State = {
  label: string;
  latex: boolean;
  radius: number;
  position: Vector2;
};

type MachineState = {
  nodes: Record<string, State>;
  addNode: (position: Vector2) => void;
  mutateNode: (id: string, fn: (node: State) => State) => void;
  selected: State | null;
};

const useMachine = createShallow<MachineState>(set => ({
  nodes: {},
  addNode: v =>
    set(s => {
      let id = Date.now().toString();
      let label = `q_{${Object.keys(s.nodes).length}}`;

      return {
        nodes: {
          ...s.nodes,
          [id]: { label, latex: true, radius: BASE_STATE_RADIUS, position: v }
        }
      };
    }),
  mutateNode: (id, fn) =>
    set(s => {
      let node = s.nodes[id];
      if (!node) return s;

      return {
        nodes: {
          ...s.nodes,
          [id]: fn(node)
        }
      };
    }),
  selected: null
}));

export { useMachine };
export type { State, MachineState };
