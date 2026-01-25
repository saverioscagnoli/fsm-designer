import { NodeRenderer } from "~/node-renderer";
import { mouseDown } from "~/components/viewport/events/mouse-down";
import { useMachine } from "~/states/machine";
import { useEffect } from "react";

const Viewport = () => {
  const nodes = useMachine(s => s.nodes);
  const addNode = useMachine(s => s.addNode);

  useEffect(() => {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2 - 250;

    addNode({ x, y });
  }, []);

  return <NodeRenderer nodes={nodes} onMouseDown={mouseDown()} />;
};

export { Viewport };
