import { useViewport } from "~/zustand/viewport";
import { cn } from "~/lib/utils";
import { useMachine } from "~/zustand/machine";

const ArrowFeedback = () => {
  const nodes = useMachine(s => s.nodes);
  const [id, mouse] = useViewport(s => [s.creatingEdgeFrom, s.mousePosition]);

  if (id === null || !nodes[id]) return null;

  let node = nodes[id];

  return (
    <>
      <style>
        {`
          @keyframes dash {
            to {
              stroke-dashoffset: -20;
            }
          }
          .animated-dash {
            animation: dash 0.5s linear infinite;
          }
        `}
      </style>
      <svg
        className={cn(
          "w-full h-full",
          "absolute top-0 left-0",
          "overflow-visible",
          "pointer-events-none"
        )}
      >
        <line
          x1={node.position.x + node.radius}
          y1={node.position.y + node.radius}
          x2={mouse.x}
          y2={mouse.y}
          stroke="var(--blue-8)"
          strokeWidth="4"
          strokeDasharray="10,10"
          className="animated-dash"
        />
      </svg>
    </>
  );
};

export { ArrowFeedback };
