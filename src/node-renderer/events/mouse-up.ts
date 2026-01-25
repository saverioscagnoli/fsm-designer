import { useControls } from "~/states/controls";

function mouseUp(): (e: MouseEvent) => void {
  const stopPanning = useControls(s => s.stopPanning);

  return _e => {
    stopPanning();
  };
}

export { mouseUp };
