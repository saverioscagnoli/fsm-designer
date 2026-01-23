import { MAX_ZOOM, MIN_ZOOM, ZOOM_INTENSITY } from "~/lib/consts";
import { Vector2 } from "~/lib/math";
import { getWorldX, getWorldY } from "~/lib/utils";
import type { ViewportState } from "~/zustand/viewport";

function wheel(vp: ViewportState): (e: WheelEvent) => void {
  return e => {
    let delta = -e.deltaY * ZOOM_INTENSITY;
    let newZoom = Math.min(Math.max(MIN_ZOOM, vp.zoom + delta), MAX_ZOOM);

    let [mX, mY] = [e.clientX, e.clientY];

    let x = getWorldX(e.clientX, vp.panOffset.x, vp.zoom);
    let y = getWorldY(e.clientY, vp.panOffset.y, vp.zoom);

    let newPanX = mX - x * newZoom;
    let newPanY = mY - y * newZoom;
    let newPanOffset = new Vector2(newPanX, newPanY);

    vp.setPanOffset(newPanOffset);
    vp.setZoom(newZoom);
  };
}

export { wheel };
