import { BASE_STATE_RADIUS } from "~/lib/consts";
import { Vector2 } from "~/lib/math";
import { createShallow } from "~/zustand/shallow";

type State = {
  label: string;
  latex: boolean;
  radius: number;
  position: Vector2;
};

type Edge = {
  from: string;
  to: string;
  label: string;
  controlPoints?: Vector2[]; // Optional control points for bezier curves
  fromAnchor?: Vector2;
  toAnchor?: Vector2;
};

type EdgePoints = {
  from: Vector2;
  to: Vector2;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  controlPoints: Vector2[];
};

type MachineState = {
  nodes: Record<string, State>;
  edges: Record<string, Edge>;
  addNode: (position: Vector2) => void;
  mutateNode: (id: string, fn: (node: State) => State) => void;
  addEdge: (from: string, to: string) => void;
  mutateEdge: (id: string, fn: (edge: Edge) => Edge) => void;
  selected: State | null;
  getEdgePoints: (edgeId: string) => EdgePoints | null;
  calculateAnchorPoint: (
    nodeCenter: Vector2,
    nodeRadius: number,
    anchor?: Vector2,
    targetCenter?: Vector2
  ) => Vector2;

  // Edge interaction state
  hoveredEdge: string | null;
  setHoveredEdge: (id: string | null) => void;

  // Edge dragging state
  isDraggingEdge: boolean;
  draggingEdgeId: string | null;
  edgeDragStart: Vector2;
  edgeDragControlPoints: Vector2[];
  startDraggingEdge: (
    id: string,
    startPos: Vector2,
    controlPoints: Vector2[]
  ) => void;
  stopDraggingEdge: () => void;

  // Edge endpoint dragging state
  isDraggingEndpoint: boolean;
  draggingEndpointEdgeId: string | null;
  draggingEndpointType: "start" | "end" | null;
  startDraggingEndpoint: (id: string, type: "start" | "end") => void;
  stopDraggingEndpoint: () => void;
};

const useMachine = createShallow<MachineState>((set, get) => ({
  nodes: {},
  edges: {},
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
  addEdge: (from, to) =>
    set(s => {
      let edgeExists = Object.values(s.edges).some(
        edge => edge.from === from && edge.to === to
      );

      if (edgeExists) {
        return s;
      }

      let id = Date.now().toString();
      return {
        edges: {
          ...s.edges,
          [id]: { from, to, label: "" }
        }
      };
    }),
  mutateEdge: (id, fn) =>
    set(s => {
      let edge = s.edges[id];
      if (!edge) return s;

      return {
        edges: {
          ...s.edges,
          [id]: fn(edge)
        }
      };
    }),
  selected: null,

  calculateAnchorPoint: (nodeCenter, nodeRadius, anchor, targetCenter) => {
    if (anchor) {
      return new Vector2(
        nodeCenter.x + anchor.x * nodeRadius,
        nodeCenter.y + anchor.y * nodeRadius
      );
    }

    if (targetCenter) {
      let dirX = targetCenter.x - nodeCenter.x;
      let dirY = targetCenter.y - nodeCenter.y;
      let length = Math.sqrt(dirX * dirX + dirY * dirY);

      let normX = length > 0 ? dirX / length : 0;
      let normY = length > 0 ? dirY / length : 0;

      return new Vector2(
        nodeCenter.x + normX * nodeRadius,
        nodeCenter.y + normY * nodeRadius
      );
    }

    return nodeCenter;
  },

  getEdgePoints: edgeId => {
    let state = get();
    let edge = state.edges[edgeId];
    if (!edge) return null;

    let fromNode = state.nodes[edge.from];
    let toNode = state.nodes[edge.to];
    if (!fromNode || !toNode) return null;

    let from = new Vector2(
      fromNode.position.x + fromNode.radius,
      fromNode.position.y + fromNode.radius
    );

    let to = new Vector2(
      toNode.position.x + toNode.radius,
      toNode.position.y + toNode.radius
    );

    let start = state.calculateAnchorPoint(
      from,
      fromNode.radius,
      edge.fromAnchor,
      to
    );

    let end = state.calculateAnchorPoint(
      to,
      toNode.radius,
      edge.toAnchor,
      from
    );

    let controlPoints = edge.controlPoints || [
      new Vector2(
        start.x + (end.x - start.x) * 0.33,
        start.y + (end.y - start.y) * 0.33
      ),
      new Vector2(
        start.x + (end.x - start.x) * 0.67,
        start.y + (end.y - start.y) * 0.67
      )
    ];

    return {
      from,
      to,
      startX: start.x,
      startY: start.y,
      endX: end.x,
      endY: end.y,
      controlPoints
    };
  },

  // Edge interaction state
  hoveredEdge: null,
  setHoveredEdge: id => set(() => ({ hoveredEdge: id })),

  // Edge dragging state
  isDraggingEdge: false,
  draggingEdgeId: null,
  edgeDragStart: Vector2.ZERO,
  edgeDragControlPoints: [],
  startDraggingEdge: (id, startPos, controlPoints) =>
    set(() => ({
      isDraggingEdge: true,
      draggingEdgeId: id,
      edgeDragStart: startPos,
      edgeDragControlPoints: controlPoints
    })),
  stopDraggingEdge: () =>
    set(() => ({
      isDraggingEdge: false,
      draggingEdgeId: null,
      edgeDragStart: Vector2.ZERO,
      edgeDragControlPoints: []
    })),

  // Edge endpoint dragging state
  isDraggingEndpoint: false,
  draggingEndpointEdgeId: null,
  draggingEndpointType: null,
  startDraggingEndpoint: (id, type) =>
    set(() => ({
      isDraggingEndpoint: true,
      draggingEndpointEdgeId: id,
      draggingEndpointType: type
    })),
  stopDraggingEndpoint: () =>
    set(() => ({
      isDraggingEndpoint: false,
      draggingEndpointEdgeId: null,
      draggingEndpointType: null
    }))
}));

export { useMachine };
export type { State, Edge, MachineState, EdgePoints };
