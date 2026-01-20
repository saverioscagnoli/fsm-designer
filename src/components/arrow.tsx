import type React from "react";

type ArrowProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  radius: number;
};

const Arrow: React.FC<ArrowProps> = ({ x1, y1, x2, y2, radius }) => {
  // Calculate center points of circles
  const centerX1 = x1 + radius;
  const centerY1 = y1 + radius;
  const centerX2 = x2 + radius;
  const centerY2 = y2 + radius;

  // Calculate direction vector
  const dx = centerX2 - centerX1;
  const dy = centerY2 - centerY1;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) return null;

  // Normalize direction
  const ux = dx / length;
  const uy = dy / length;

  // Adjust start and end points to account for circle radius
  const startX = centerX1 + ux * radius;
  const startY = centerY1 + uy * radius;
  const endX = centerX2 - ux * radius;
  const endY = centerY2 - uy * radius;

  // Calculate arrowhead points
  const arrowSize = 15;
  const angle = Math.atan2(dy, dx);

  const arrowPoint1X = endX - arrowSize * Math.cos(angle - Math.PI / 6);
  const arrowPoint1Y = endY - arrowSize * Math.sin(angle - Math.PI / 6);
  const arrowPoint2X = endX - arrowSize * Math.cos(angle + Math.PI / 6);
  const arrowPoint2Y = endY - arrowSize * Math.sin(angle + Math.PI / 6);

  // Calculate bounding box for SVG
  const minX = Math.min(startX, endX, arrowPoint1X, arrowPoint2X) - 10;
  const minY = Math.min(startY, endY, arrowPoint1Y, arrowPoint2Y) - 10;
  const maxX = Math.max(startX, endX, arrowPoint1X, arrowPoint2X) + 10;
  const maxY = Math.max(startY, endY, arrowPoint1Y, arrowPoint2Y) + 10;

  return (
    <svg
      style={{
        position: "absolute",
        left: minX,
        top: minY,
        width: maxX - minX,
        height: maxY - minY,
        pointerEvents: "none",
        overflow: "visible"
      }}
    >
      {/* Arrow line */}
      <line
        x1={startX - minX}
        y1={startY - minY}
        x2={endX - minX}
        y2={endY - minY}
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Arrowhead */}
      <polygon
        points={`${endX - minX},${endY - minY} ${arrowPoint1X - minX},${arrowPoint1Y - minY} ${arrowPoint2X - minX},${arrowPoint2Y - minY}`}
        fill="currentColor"
      />
    </svg>
  );
};

export { Arrow };
