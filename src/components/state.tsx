import { cn } from "~/lib/utils";
import { Latex } from "~/components/latex";
import React, { useMemo } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

type StateNode = Node<
  {
    radius: number;
    label: string;
  },
  "state"
>;

const State: React.FC<NodeProps<StateNode>> = ({ data: { label, radius } }) => {
  const diameter = useMemo(() => 2 * radius, [radius]);

  return (
    <div
      style={{
        width: diameter,
        height: diameter
      }}
      className={cn(
        "inline-flex items-center justify-center",
        "bg-(--slate-1) text-(--slate-12)",
        "border-2 border-(--slate-12)",
        "rounded-full",
        "transition-colors",
        "relative"
      )}
    >
      <Latex latex={label} />
      <Handle
        type="source"
        position={Position.Top}
        id="default"
        style={{
          opacity: 0,
          pointerEvents: "none"
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="default"
        style={{
          opacity: 0,
          pointerEvents: "none"
        }}
      />
    </div>
  );
};

export { State };
export type { StateNode };
