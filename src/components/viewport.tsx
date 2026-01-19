import { useEvent } from "@util-hooks/use-event";
import { useMemo, useState, type MouseEvent } from "react";
import {
  BASE_STATE_RADIUS,
  MAX_ZOOM,
  MIN_ZOOM,
  ZOOM_INTENSITY
} from "~/lib/consts";
import type { Position } from "~/types/node";
import { useDragging } from "~/zustand/drag";
import { usePanning } from "~/zustand/pan";
import { State } from "./state";
import { cn, getWorldX, getWorldY, getWorldYTopbar } from "~/lib/utils";

const Viewport = () => {
  const [nodes, setNodes] = useState<Position[]>([{ x: 100, y: 100 }]);

  const drag = useDragging();
  const pan = usePanning();
  const [zoom, setZoom] = useState<number>(1);

  const onGrab = (index: number, e: MouseEvent) => {
    if (drag.isDragging) return;

    drag.start(index);

    let position = nodes[index];

    let worldX = (e.clientX - pan.offset.x) / zoom;
    let worldY = (e.clientY - pan.offset.y) / zoom;

    drag.setOffset(worldX - position.x, worldY - position.y);
  };

  const onViewportMouseDown = (e: MouseEvent) => {
    if (e.button == 0 && e.detail == 2) {
      let x = getWorldX(e.clientX, pan.offset.x, zoom) - BASE_STATE_RADIUS;
      let y =
        getWorldYTopbar(e.clientY, pan.offset.y, zoom) - BASE_STATE_RADIUS;

      setNodes(p => [...p, { x, y }]);

      return;
    }

    if (e.button != 1 || e.currentTarget !== e.target) return;

    pan.start(e.clientX - pan.offset.x, e.clientY - pan.offset.y);
  };

  useEvent(window, "mousemove", e => {
    if (drag.isDragging) {
      let worldX = getWorldX(e.clientX, pan.offset.x, zoom);
      let worldY = getWorldY(e.clientY, pan.offset.y, zoom);

      setNodes(p =>
        p.map((node, i) =>
          i === drag.node
            ? { ...node, x: worldX - drag.offset.x, y: worldY - drag.offset.y }
            : node
        )
      );
    } else if (pan.isPanning) {
      pan.setOffset(e.clientX - pan.startedAt.x, e.clientY - pan.startedAt.y);
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

    setZoom(newZoom);
    pan.setOffset(newPanX, newPanY);
  });

  return (
    <div
      className={cn(
        "w-screen h-[calc(100vh-3rem)] relative overflow-hidden",
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
        {nodes.map((p, i) => (
          <State key={i.toString()} index={i} x={p.x} y={p.y} onGrab={onGrab} />
        ))}
      </div>
    </div>
  );
};

export { Viewport };
