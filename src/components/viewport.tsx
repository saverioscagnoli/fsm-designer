import { useEffect, useRef, useState } from "react";
import { BACKGROUND_DOTS_GAP, BASE_STATE_RADIUS } from "~/lib/consts";
import { cn } from "~/lib/utils";
import { useMachine } from "~/zustand/machine";
import { usePanning } from "~/zustand/pan";
import { State } from "./state";
import { Vector2 } from "~/lib/math";
import { useEvent } from "@util-hooks/use-event";
import { mouseMove } from "~/events/mouse-move";
import { useDragging } from "~/zustand/drag";
import { onGrab } from "~/events/on-grab";
import { mouseUp } from "~/events/mouse-up";
import { mouseDown } from "~/events/mouse-down";
import { contextMenu } from "~/events/context-menu";
import { wheel } from "~/events/wheel";

const Viewport = () => {
  const drag = useDragging(s => s);
  const pan = usePanning(s => s);
  const machine = useMachine(s => s);
  const [zoom, setZoom] = useState<number>(1);
  const viewportRef = useRef<HTMLDivElement>(null);

  /* Event setup */
  useEvent(viewportRef, "mousemove", mouseMove(drag, pan, machine, zoom));
  useEvent(viewportRef, "mousedown", mouseDown(pan, machine, zoom));
  useEvent(viewportRef, "mouseup", mouseUp(drag, pan));
  useEvent(viewportRef, "contextmenu", contextMenu());
  useEvent(viewportRef, "wheel", wheel(pan, zoom, setZoom));

  useEffect(() => {
    let x = window.innerWidth / 2 - BASE_STATE_RADIUS;
    let y = window.innerHeight / 2 - BASE_STATE_RADIUS;

    machine.addNode(new Vector2(x, y));
  }, []);

  return (
    <div
      className={cn("w-screen h-full relative", {
        "cursor-grabbing": pan.isPanning
      })}
      ref={viewportRef}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, var(--slate-12), 2px, transparent 1px)`,
          backgroundSize: `${BACKGROUND_DOTS_GAP * zoom}px ${BACKGROUND_DOTS_GAP * zoom}px`,
          backgroundPosition: `${pan.offset.x}px ${pan.offset.y}px`,
          opacity: 0.2
        }}
      />
      <div
        style={{
          transform: `translate(${pan.offset.x}px, ${pan.offset.y}px) scale(${zoom})`,
          transformOrigin: "0 0"
        }}
      >
        {Object.entries(machine.nodes).map(([id, state]) => (
          <State
            key={id}
            id={id}
            onGrab={onGrab(drag, pan, machine, zoom)}
            {...state}
          />
        ))}
      </div>
    </div>
  );
};

export { Viewport };
