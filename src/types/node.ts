import type { Vector2 } from "~/lib/math";

type NodeID = string | number;
type NodeLabel = string | number;
type NodeMap = Record<string | number, Vector2>;

export type { NodeID, NodeLabel, NodeMap };
