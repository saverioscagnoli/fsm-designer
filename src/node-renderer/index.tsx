import { useEvent } from "@util-hooks/use-event";
import { useRef } from "react";
import React from "react";
import { For } from "~/components/for";
import { cn } from "~/lib/utils";
import type { Node } from "~/types/node";
import { BulletBackground } from "~/node-renderer/background";
import { useControls } from "~/states/controls";
import {
  mouseDown,
  mouseMove,
  mouseUp,
  mouseWheel
} from "~/node-renderer/events";

type NodeRendererProps<T, K extends React.FC<T>> = {
  nodes: Node<T, K>[];
  background?: boolean;

  onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

const NodeRenderer = <T, K extends React.FC<T>>({
  nodes,
  background = true,
  onMouseDown
}: NodeRendererProps<T, K>) => {
  const rendererRef = useRef<HTMLDivElement>(null);
  const isPanning = useControls(s => s.panning);
  const panningOffset = useControls(s => s.panningOffset);
  const zoom = useControls(s => s.zoom);

  useEvent(rendererRef, "mousedown", mouseDown());
  useEvent(rendererRef, "mousemove", mouseMove());
  useEvent(rendererRef, "mouseup", mouseUp());
  useEvent(rendererRef, "wheel", mouseWheel());
  useEvent(rendererRef, "contextmenu", e => e.preventDefault());

  return (
    <div
      className={cn(
        "w-full h-full",
        "relative overflow-hidden",
        "cursor-grab",
        {
          "cursor-grabbing": isPanning
        }
      )}
      ref={rendererRef}
      onMouseDown={onMouseDown}
    >
      {background && <BulletBackground />}
      <div
        style={{
          transform: `translate(${panningOffset.x}px, ${panningOffset.y}px) scale(${zoom})`,
          transformOrigin: "0 0"
        }}
      >
        <For of={nodes}>
          {node => (
            <div
              key={node.id}
              style={{
                position: "absolute",
                top: node.position.y,
                left: node.position.x
              }}
            >
              {/* @ts-ignore */}
              <node.component {...node.props} />
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export { NodeRenderer };
export type { NodeRendererProps };
