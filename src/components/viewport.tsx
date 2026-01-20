import { useEvent } from "@util-hooks/use-event";
import { useState, type MouseEvent } from "react";
import {
  BASE_STATE_RADIUS,
  MAX_ZOOM,
  MIN_ZOOM,
  ZOOM_INTENSITY
} from "~/lib/consts";
import { useDragging } from "~/zustand/drag";
import { usePanning } from "~/zustand/pan";
import { State } from "./state";
import { Arrow } from "./arrow";
import { cn, getWorldX, getWorldY, getWorldYTopbar } from "~/lib/utils";
import { Vector2 } from "~/lib/math";

const Viewport = () => {
  const [nodes, setNodes] = useState<Vector2[]>([
    new Vector2(
      window.innerWidth / 2 - BASE_STATE_RADIUS,
      window.innerHeight / 2 - BASE_STATE_RADIUS
    )
  ]);

  const drag = useDragging();
  const pan = usePanning();
  const [zoom, setZoom] = useState<number>(1);

  const onGrab = (index: number, e: MouseEvent) => {
    if (drag.isDragging) return;

    drag.start(index);

    let position = nodes[index];

    let worldPos = new Vector2(
      getWorldX(e.clientX, pan.offset.x, zoom) - position.x,
      getWorldY(e.clientY, pan.offset.y, zoom) - position.y
    );

    drag.setOffset(worldPos);
  };

  const onViewportMouseDown = (e: MouseEvent) => {
    if (e.button == 0 && e.detail == 2) {
      let x = getWorldX(e.clientX, pan.offset.x, zoom) - BASE_STATE_RADIUS;
      let y =
        getWorldYTopbar(e.clientY, pan.offset.y, zoom) - BASE_STATE_RADIUS;

      setNodes(p => [...p, new Vector2(x, y)]);

      return;
    }

    if (e.currentTarget !== e.target) return;

    let panStartedAt = new Vector2(
      e.clientX - pan.offset.x,
      e.clientY - pan.offset.y
    );

    pan.start(panStartedAt);
  };

  useEvent(window, "mousemove", e => {
    if (drag.isDragging) {
      let worldX = getWorldX(e.clientX, pan.offset.x, zoom);
      let worldY = getWorldY(e.clientY, pan.offset.y, zoom);

      setNodes(p =>
        p.map((node, i) =>
          i === drag.node
            ? new Vector2(worldX - drag.offset.x, worldY - drag.offset.y)
            : node
        )
      );
    } else if (pan.isPanning) {
      let panOffset = new Vector2(
        e.clientX - pan.startedAt.x,
        e.clientY - pan.startedAt.y
      );

      pan.setOffset(panOffset);
    }
  });

  useEvent(window, "mouseup", () => {
    drag.stop();
    pan.stop();
  });

  useEvent(window, "wheel", e => {
    e.preventDefault();

    let delta = -e.deltaY * ZOOM_INTENSITY;
    let newZoom = Math.min(Math.max(MIN_ZOOM, zoom + delta), MAX_ZOOM);

    let [mX, mY] = [e.clientX, e.clientY];

    let worldX = getWorldX(e.clientX, pan.offset.x, zoom);
    let worldY = getWorldY(e.clientY, pan.offset.y, zoom);

    let newPanX = mX - worldX * newZoom;
    let newPanY = mY - worldY * newZoom;
    let newPan = new Vector2(newPanX, newPanY);

    setZoom(newZoom);
    pan.setOffset(newPan);
  });

  return (
    <div
      className={cn(
        "w-screen h-full relative overflow-hidden",
        pan.isPanning && "cursor-grabbing"
      )}
      onMouseDown={onViewportMouseDown}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, var(--slate-12), 2px, transparent 1px)`,
          backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
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
        {/* Render arrows connecting consecutive states */}
        {nodes.map((node, i) => {
          if (i < nodes.length - 1) {
            const nextNode = nodes[i + 1];
            return (
              <Arrow
                key={`arrow-${i}`}
                x1={node.x}
                y1={node.y}
                x2={nextNode.x}
                y2={nextNode.y}
                radius={BASE_STATE_RADIUS}
              />
            );
          }
          return null;
        })}

        {/* Render states */}
        {nodes.map((p, i) => (
          <State key={i.toString()} index={i} x={p.x} y={p.y} onGrab={onGrab} />
        ))}
      </div>
    </div>
  );
};

export { Viewport };
