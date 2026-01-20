import { useMemo, useState, type ComponentProps, type MouseEvent } from "react";
import type React from "react";
import { BASE_STATE_RADIUS } from "~/lib/consts";
import { cn } from "~/lib/utils";
import type { NodeLabel } from "~/types/node";
import { LatexRenderer } from "./latex";

type StateProps = {
  index: number;
  x: number;
  y: number;
  onGrab?: (index: number, e: MouseEvent) => void;
} & ComponentProps<"div">;

const State: React.FC<StateProps> = ({
  index,
  x,
  y,
  onGrab,
  className,
  style,
  ...props
}) => {
  const [radius, setRadius] = useState<number>(BASE_STATE_RADIUS);
  const [label, setLabel] = useState<NodeLabel>(index);
  const [accepting, setAccepting] = useState<boolean>(false);
  const diameter = useMemo(() => radius * 2, [radius]);

  const onMousedown = (e: MouseEvent) => {
    if (e.target == e.currentTarget && onGrab) {
      onGrab(index, e);
    }
  };

  return (
    <div
      {...props}
      style={{
        width: diameter,
        height: diameter,
        top: y,
        left: x,
        ...style
      }}
      className={cn(
        "absolute",
        "inline-flex items-center justify-center",
        "rounded-full bg-(--slate-1)",
        "text-xl text-(--slate-12)",
        "outline-3 outline-(--slate-12",
        "active:cursor-grabbing",
        className
      )}
      onMouseDown={onMousedown}
    >
      <div
        className={cn(
          "text-center outline-none",
          "pointer-events-none",
          "select-none"
        )}
      >
        <LatexRenderer latex={`q_{${label}}`} />
      </div>
    </div>
  );
};

export { State };
