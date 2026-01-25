import type React from "react";
import { BASE_STATE_RADIUS } from "~/lib/consts";
import { useControls } from "~/states/controls";
import { useMachine } from "~/states/machine";

function mouseDown(): (e: React.MouseEvent<HTMLDivElement>) => void {
  const addNode = useMachine(s => s.addNode);
  const worldToScreen = useControls(s => s.worldToScreen);

  return e => {
    /**
     * Adds a new state on Ctrl + left click
     */
    if (e.target === e.currentTarget && e.button === 0 && e.ctrlKey) {
      let worldPos = worldToScreen({
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      });

      worldPos.x -= BASE_STATE_RADIUS;
      worldPos.y -= BASE_STATE_RADIUS;

      addNode(worldPos);
    }
  };
}

export { mouseDown };
