import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getWorldX(mX: number, panOffsetX: number, zoom: number) {
  return (mX - panOffsetX) / zoom;
}

function getWorldY(mY: number, panOffsetY: number, zoom: number) {
  return (mY - panOffsetY) / zoom;
}

export { cn, getWorldX, getWorldY };
