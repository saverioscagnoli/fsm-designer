import { useControls } from "~/states/controls";

function mouseDown(): (e: MouseEvent) => void {
  const startPanning = useControls(s => s.startPanning);

  return e => {
    /**
     * Right click to start panning
     */
    if (e.button === 2 && !e.ctrlKey && !e.shiftKey) {
      startPanning({ x: e.clientX, y: e.clientY });
    }
  };
}

export { mouseDown };
