import type React from "react";
import { useMemo, useState, type MouseEvent } from "react";
import { cn } from "~/lib/utils";
import type { State as StateT } from "~/zustand/machine";
import { LatexRenderer } from "~/components/latex-renderer";
import type { ViewportState } from "~/zustand/viewport";
import type { MachineState } from "~/zustand/machine";
import { stateMouseLeave } from "~/events/state-mouse-leave";

type StateProps = StateT & {
  id: string;
  onGrab: (id: string, e: MouseEvent) => void;
  vp: ViewportState;
  machine: MachineState;
};

const State: React.FC<StateProps> = ({
  id,
  label,
  latex,
  radius,
  position,
  onGrab,
  vp,
  machine: _machine
}) => {
  const [hover, setHover] = useState(false);
  const diameter = useMemo(() => radius * 2, [radius]);

  let onMouseDown = (e: MouseEvent) => {
    // If shift is held, start creating an edge from this node
    if (e.shiftKey && vp.creatingEdgeFrom === null) {
      vp.startCreatingEdge(id);
      return;
    }

    if (e.target == e.currentTarget && onGrab) {
      onGrab(id, e);
    }
  };

  // ( ͡° ͜ʖ ͡°)
  const isSelectedForEdging = useMemo(
    () => hover && vp.creatingEdgeFrom !== null && vp.creatingEdgeFrom !== id,
    [hover, vp.creatingEdgeFrom, id]
  );

  return (
    <div
      style={{
        width: diameter,
        height: diameter,
        top: position.y,
        left: position.x
      }}
      className={cn(
        "absolute",
        "inline-flex items-center justify-center",
        "rounded-full",
        "text-xl text-(--slate-12)",
        "bg-(--slate-1)",
        "border-3 border-(--slate-12)",
        "active:cursor-grabbing",
        "transition-colors",
        {
          "bg-green-500 border-green-700": isSelectedForEdging
        }
      )}
      onMouseDown={onMouseDown}
      onMouseEnter={() => {
        setHover(true);
        vp.setHoveredNode(id);
      }}
      onMouseLeave={e => {
        setHover(false);
        vp.setHoveredNode(null);
        stateMouseLeave(vp, id)(e);
      }}
    >
      <span className={cn("text-center select-none pointer-events-none")}>
        {latex ? <LatexRenderer latex={label} /> : label}
      </span>
    </div>
  );
};

export { State };
