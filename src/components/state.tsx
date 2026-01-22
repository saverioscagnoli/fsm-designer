import type React from "react";
import { useMemo, type MouseEvent } from "react";
import { cn } from "~/lib/utils";
import type { State as StateT } from "~/zustand/machine";
import { LatexRenderer } from "~/components/latex-renderer";

type StateProps = StateT & {
  id: string;
  onGrab: (id: string, e: MouseEvent) => void;
};

const State: React.FC<StateProps> = ({
  id,
  label,
  latex,
  radius,
  position,
  onGrab
}) => {
  const diameter = useMemo(() => radius * 2, [radius]);

  const onMouseDown = (e: MouseEvent) => {
    if (e.target == e.currentTarget && onGrab) {
      onGrab(id, e);
    }
  };

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
        "active:cursor-grabbing"
      )}
      onMouseDown={onMouseDown}
    >
      <span className={cn("text-center select-none pointer-events-none")}>
        {latex ? <LatexRenderer latex={label} /> : label}
      </span>
    </div>
  );
};

export { State };
