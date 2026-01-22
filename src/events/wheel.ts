import type { Dispatch, SetStateAction } from "react";
import { MAX_ZOOM, MIN_ZOOM, ZOOM_INTENSITY } from "~/lib/consts";
import { Vector2 } from "~/lib/math";
import { getWorldX, getWorldY } from "~/lib/utils";
import type { PanState } from "~/zustand/pan";

function wheel(
  pan: PanState,
  zoom: number,
  setZoom: Dispatch<SetStateAction<number>>
): (e: WheelEvent) => void {
  return e => {
    let delta = -e.deltaY * ZOOM_INTENSITY;
    let newZoom = Math.min(Math.max(MIN_ZOOM, zoom + delta), MAX_ZOOM);

    let [mX, mY] = [e.clientX, e.clientY];

    let x = getWorldX(e.clientX, pan.offset.x, zoom);
    let y = getWorldY(e.clientY, pan.offset.y, zoom);

    let newPanX = mX - x * newZoom;
    let newPanY = mY - y * newZoom;
    let newPanOffset = new Vector2(newPanX, newPanY);

    pan.setOffset(newPanOffset);
    setZoom(newZoom);
  };
}

export { wheel };
