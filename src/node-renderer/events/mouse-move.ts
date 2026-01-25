import { useControls } from "~/states/controls";

function mouseMove(): (e: MouseEvent) => void {
  const isPanning = useControls(s => s.panning);
  const panningStart = useControls(s => s.panningStart);
  const setPanningOffset = useControls(s => s.setPanningOffset);
  const panningStartOffset = useControls(s => s.panningStartOffset);

  return e => {
    if (isPanning && panningStart !== null) {
      let dx = e.clientX - panningStart.x;
      let dy = e.clientY - panningStart.y;

      let ox = panningStartOffset.x + dx;
      let oy = panningStartOffset.y + dy;

      setPanningOffset({ x: ox, y: oy });
      return;
    }
  };
}

export { mouseMove };
