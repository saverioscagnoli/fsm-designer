import { BACKGROUND_BULLETS_GAP } from "~/lib/consts";
import { useControls } from "~/states/controls";

const BulletBackground = () => {
  const zoom = useControls(s => s.zoom);
  const panningOffset = useControls(s => s.panningOffset);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(circle, var(--slate-12) 1px, transparent 2px)`,
        backgroundSize: `${BACKGROUND_BULLETS_GAP * zoom}px ${BACKGROUND_BULLETS_GAP * zoom}px`,
        backgroundPosition: `${panningOffset.x}px ${panningOffset.y}px`,
        opacity: 0.2
      }}
    />
  );
};

export { BulletBackground };
