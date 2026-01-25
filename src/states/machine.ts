import { create } from "zustand";
import { State, type StateProps } from "~/components/state";
import { BASE_STATE_RADIUS } from "~/lib/consts";
import type { Node } from "~/types/node";
import type { Position } from "~/types/position";

type MachineState = {
  nodes: Node<StateProps, typeof State>[];
  addNode: (pos: Position) => void;
  removeNode: (id: string) => void;
};

const useMachine = create<MachineState>()(set => ({
  nodes: [],
  addNode: pos =>
    set(s => {
      let node: Node<StateProps, typeof State> = {
        id: window.crypto.randomUUID(),
        position: pos,
        component: State,
        props: { label: `q_{${s.nodes.length}}`, radius: BASE_STATE_RADIUS }
      };

      return { nodes: [...s.nodes, node] };
    }),

  removeNode: id =>
    set(state => ({ nodes: state.nodes.filter(node => node.id !== id) }))
}));

export { useMachine };
