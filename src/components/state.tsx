import React, { useMemo } from "react";
import { Latex } from "~/components/latex";
import { cn } from "~/lib/utils";

type StateProps = {
  radius: number;
  label: string;
};

const State: React.FC<StateProps> = ({ label, radius }) => {
  const diameter = useMemo(() => radius * 2, [radius]);

  return (
    <div
      style={{
        width: diameter,
        height: diameter
      }}
      className={cn(
        "inline-flex items-center justify-center",
        "rounded-full",
        "bg-(--slate-1) text-(--slate-12)",
        "border-2 border-(--slate-12)",
        "select-none cursor-default",
        "smooth-colors"
      )}
    >
      <Latex latex={label} />
    </div>
  );
};

export { State };
export type { StateProps };
