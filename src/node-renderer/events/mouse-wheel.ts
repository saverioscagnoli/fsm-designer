import { MAX_ZOOM, MIN_ZOOM, ZOOM_INTENSITY } from "~/lib/consts";
import { useControls } from "~/states/controls";

function mouseWheel(): (e: WheelEvent) => void {
  const zoom = useControls(s => s.zoom);
  const setZoom = useControls(s => s.setZoom);
  const panningOffset = useControls(s => s.panningOffset);
  const setPanningOffset = useControls(s => s.setPanningOffset);

  return e => {
    let delta = -e.deltaY * ZOOM_INTENSITY;
    let newZoom = Math.min(Math.max(MIN_ZOOM, zoom + delta), MAX_ZOOM);

    let worldX = (e.clientX - panningOffset.x) / zoom;
    let worldY = (e.clientY - panningOffset.y) / zoom;

    let panX = e.clientX - worldX * newZoom;
    let panY = e.clientY - worldY * newZoom;

    setZoom(newZoom);
    setPanningOffset({ x: panX, y: panY });
  };
}

export { mouseWheel };
