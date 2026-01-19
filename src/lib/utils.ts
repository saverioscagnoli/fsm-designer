import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TOPBAR_HEIGHT } from "~/lib/consts";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getWorldX(mX: number, panOffsetX: number, zoom: number) {
  return (mX - panOffsetX) / zoom;
}

function getWorldY(mY: number, panOffsetY: number, zoom: number) {
  return (mY - panOffsetY) / zoom;
}

function getWorldYTopbar(mY: number, panOffsetY: number, zoom: number) {
  return (mY - TOPBAR_HEIGHT - panOffsetY) / zoom;
}

export { cn, getWorldX, getWorldY, getWorldYTopbar };
