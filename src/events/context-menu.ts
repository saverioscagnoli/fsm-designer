function contextMenu(): (e: MouseEvent) => void {
  return e => e.preventDefault();
}

export { contextMenu };
