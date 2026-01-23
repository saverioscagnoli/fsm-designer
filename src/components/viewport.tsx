import { useEffect, useRef } from "react";
import { BACKGROUND_DOTS_GAP, BASE_STATE_RADIUS } from "~/lib/consts";
import { cn } from "~/lib/utils";
import { useMachine } from "~/zustand/machine";
import { State } from "./state";
import { Edge } from "./edge";
import { Vector2 } from "~/lib/math";
import { useEvent } from "@util-hooks/use-event";
import { mouseMove } from "~/events/mouse-move";
import { onGrab } from "~/events/on-grab";
import { mouseUp } from "~/events/mouse-up";
import { mouseDown } from "~/events/mouse-down";
import { contextMenu } from "~/events/context-menu";
import { wheel } from "~/events/wheel";
import { useViewport } from "~/zustand/viewport";
import { For } from "~/components/for";
import { ArrowFeedback } from "~/components/arrow-feedback";
import { KeyUp } from "~/events/key-up";
import { edgeMouseEnter } from "~/events/edge-mouse-enter";
import { edgeMouseLeave } from "~/events/edge-mouse-leave";
import { edgeMouseDown } from "~/events/edge-mouse-down";
import { edgeEndpointStart } from "~/events/edge-endpoint-start";

const Viewport = () => {
  const vp = useViewport(s => s);
  const machine = useMachine(s => s);
  const viewportRef = useRef<HTMLDivElement>(null);

  /* Event setup */
  useEvent(viewportRef, "mousemove", mouseMove(vp, machine));
  useEvent(viewportRef, "mousedown", mouseDown(vp, machine));
  useEvent(viewportRef, "mouseup", mouseUp(vp, machine));
  useEvent(viewportRef, "contextmenu", contextMenu());
  useEvent(viewportRef, "wheel", wheel(vp));
  useEvent(window, "keyup", KeyUp(vp));

  useEffect(() => {
    let x = window.innerWidth / 2 - BASE_STATE_RADIUS;
    let y = window.innerHeight / 2 - BASE_STATE_RADIUS;

    machine.addNode(new Vector2(x, y));
  }, []);

  return (
    <div
      className={cn("w-screen h-[calc(100vh-3rem)] relative overflow-hidden", {
        "cursor-grabbing": vp.isPanning,
        "cursor-crosshair": vp.creatingEdgeFrom !== null
      })}
      ref={viewportRef}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, var(--slate-12), 2px, transparent 1px)`,
          backgroundSize: `${BACKGROUND_DOTS_GAP * vp.zoom}px ${BACKGROUND_DOTS_GAP * vp.zoom}px`,
          backgroundPosition: `${vp.panOffset.x}px ${vp.panOffset.y}px`,
          opacity: 0.2
        }}
      />
      <div
        style={{
          transform: `translate(${vp.panOffset.x}px, ${vp.panOffset.y}px) scale(${vp.zoom})`,
          transformOrigin: "0 0"
        }}
      >
        <svg style={{ overflow: "visible" }}>
          <For of={Object.entries(machine.edges)}>
            {([id, edge]) => {
              let fromNode = machine.nodes[edge.from];
              let toNode = machine.nodes[edge.to];

              if (!fromNode || !toNode) return null;

              let from = new Vector2(
                fromNode.position.x + fromNode.radius,
                fromNode.position.y + fromNode.radius
              );
              let to = new Vector2(
                toNode.position.x + toNode.radius,
                toNode.position.y + toNode.radius
              );

              return (
                <Edge
                  key={id}
                  id={id}
                  from={from}
                  to={to}
                  fromRadius={fromNode.radius}
                  toRadius={toNode.radius}
                  label={edge.label}
                  onMouseEnter={edgeMouseEnter(machine)}
                  onMouseLeave={edgeMouseLeave(machine)}
                  showControlPoints={
                    machine.hoveredEdge === id ||
                    machine.draggingEdgeId === id ||
                    machine.draggingEndpointEdgeId === id
                  }
                  controlPoints={edge.controlPoints}
                  onMouseDown={edgeMouseDown(vp, machine)}
                  fromAnchor={
                    edge.fromAnchor
                      ? machine.calculateAnchorPoint(
                          from,
                          fromNode.radius,
                          edge.fromAnchor
                        )
                      : undefined
                  }
                  toAnchor={
                    edge.toAnchor
                      ? machine.calculateAnchorPoint(
                          to,
                          toNode.radius,
                          edge.toAnchor
                        )
                      : undefined
                  }
                  onEndpointStart={edgeEndpointStart(machine)}
                />
              );
            }}
          </For>
        </svg>
        <ArrowFeedback />
        <For of={Object.entries(machine.nodes)}>
          {([id, state]) => (
            <State
              key={id}
              id={id}
              vp={vp}
              machine={machine}
              onGrab={onGrab(vp, machine)}
              {...state}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export { Viewport };
