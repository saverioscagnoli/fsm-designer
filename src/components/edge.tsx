import type React from "react";
import { Vector2 } from "~/lib/math";

type EdgeProps = {
  id: string;
  from: Vector2;
  to: Vector2;
  fromRadius?: number;
  toRadius?: number;
  label?: string;
  onMouseEnter?: (id: string) => void;
  onMouseLeave?: (id: string) => void;
  showControlPoints?: boolean;
  controlPoints?: Vector2[];
  onMouseDown?: (id: string, e: React.MouseEvent) => void;
  fromAnchor?: Vector2;
  toAnchor?: Vector2;
  onEndpointStart?: (
    id: string,
    type: "start" | "end",
    e: React.MouseEvent
  ) => void;
};

const Edge: React.FC<EdgeProps> = ({
  id,
  from,
  to,
  fromRadius = 0,
  toRadius = 0,
  label,
  onMouseEnter,
  onMouseLeave,
  showControlPoints = false,
  controlPoints,
  onMouseDown,
  fromAnchor,
  toAnchor,
  onEndpointStart
}) => {
  let dirX = to.x - from.x;
  let dirY = to.y - from.y;
  let length = Math.sqrt(dirX * dirX + dirY * dirY);

  let normX = length > 0 ? dirX / length : 0;
  let normY = length > 0 ? dirY / length : 0;

  let startX: number, startY: number;
  if (fromAnchor) {
    startX = fromAnchor.x;
    startY = fromAnchor.y;
  } else {
    startX = from.x + normX * fromRadius;
    startY = from.y + normY * fromRadius;
  }

  let endX: number, endY: number;
  if (toAnchor) {
    endX = toAnchor.x;
    endY = toAnchor.y;
  } else {
    endX = to.x - normX * toRadius;
    endY = to.y - normY * toRadius;
  }

  let arrowSize = 10;

  let handleMouseEnter = () => {
    if (onMouseEnter) {
      onMouseEnter(id);
    }
  };

  let handleMouseLeave = () => {
    if (onMouseLeave) {
      onMouseLeave(id);
    }
  };

  let handleMouseDown = (e: React.MouseEvent) => {
    if (onMouseDown) {
      e.preventDefault();
      onMouseDown(id, e);
    }
  };

  let handleEndpointMouseDown =
    (type: "start" | "end") => (e: React.MouseEvent) => {
      if (onEndpointStart) {
        e.preventDefault();
        e.stopPropagation();
        onEndpointStart(id, type, e);
      }
    };

  let defaultControlPoints = [
    new Vector2(
      startX + (endX - startX) * 0.33,
      startY + (endY - startY) * 0.33
    ),
    new Vector2(
      startX + (endX - startX) * 0.67,
      startY + (endY - startY) * 0.67
    )
  ];

  let activeControlPoints = controlPoints || defaultControlPoints;

  let pathD: string;
  if (activeControlPoints.length >= 2) {
    pathD = `M ${startX} ${startY} C ${activeControlPoints[0].x} ${activeControlPoints[0].y}, ${activeControlPoints[1].x} ${activeControlPoints[1].y}, ${endX} ${endY}`;
  } else {
    pathD = `M ${startX} ${startY} L ${endX} ${endY}`;
  }

  let labelX =
    activeControlPoints.length >= 2
      ? 0.125 * startX +
        0.375 * activeControlPoints[0].x +
        0.375 * activeControlPoints[1].x +
        0.125 * endX
      : (startX + endX) / 2;

  let labelY =
    activeControlPoints.length >= 2
      ? 0.125 * startY +
        0.375 * activeControlPoints[0].y +
        0.375 * activeControlPoints[1].y +
        0.125 * endY
      : (startY + endY) / 2;

  let lastCP =
    activeControlPoints.length > 0
      ? activeControlPoints[activeControlPoints.length - 1]
      : new Vector2(startX, startY);

  let arrowDirX = endX - lastCP.x;
  let arrowDirY = endY - lastCP.y;
  let arrowDirLength = Math.sqrt(arrowDirX * arrowDirX + arrowDirY * arrowDirY);

  let arrowNormX = arrowDirLength > 0 ? arrowDirX / arrowDirLength : normX;
  let arrowNormY = arrowDirLength > 0 ? arrowDirY / arrowDirLength : normY;

  let arrowBaseX = endX - arrowNormX * arrowSize;
  let arrowBaseY = endY - arrowNormY * arrowSize;

  let perpX = -arrowNormY;
  let perpY = arrowNormX;

  let arrow1X = arrowBaseX + perpX * (arrowSize / 2);
  let arrow1Y = arrowBaseY + perpY * (arrowSize / 2);
  let arrow2X = arrowBaseX - perpX * (arrowSize / 2);
  let arrow2Y = arrowBaseY - perpY * (arrowSize / 2);

  return (
    <g className="edge">
      <path
        d={pathD}
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="text-(--slate-12)"
        style={{ pointerEvents: "stroke", userSelect: "none" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
      />

      <path
        d={pathD}
        stroke="transparent"
        strokeWidth="20"
        fill="none"
        style={{ pointerEvents: "stroke", userSelect: "none" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
      />

      <polygon
        points={`${endX},${endY} ${arrow1X},${arrow1Y} ${arrow2X},${arrow2Y}`}
        fill="currentColor"
        className="text-(--slate-12)"
        style={{ pointerEvents: "none" }}
      />

      {showControlPoints && (
        <g
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ zIndex: 1000 }}
        >
          <circle
            cx={startX}
            cy={startY}
            r={12}
            fill="green"
            stroke="white"
            strokeWidth={3}
            style={{
              pointerEvents: "all",
              cursor: "pointer",
              userSelect: "none"
            }}
            onMouseDown={handleEndpointMouseDown("start")}
          />

          <circle
            cx={endX}
            cy={endY}
            r={12}
            fill="green"
            stroke="white"
            strokeWidth={3}
            style={{
              pointerEvents: "all",
              cursor: "pointer",
              userSelect: "none"
            }}
            onMouseDown={handleEndpointMouseDown("end")}
          />
        </g>
      )}

      {label && (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm fill-(--slate-12) select-none pointer-events-none"
          style={{
            backgroundColor: "white",
            padding: "2px 4px"
          }}
        >
          {label}
        </text>
      )}
    </g>
  );
};

export { Edge };
