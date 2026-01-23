import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  type EdgeProps,
  type Edge,
  useNodes
} from "@xyflow/react";
import { useMemo } from "react";

type StateEdgeData = {
  sourceRadius?: number;
  targetRadius?: number;
  label?: string;
  controlPoint?: { x: number; y: number };
  sourceAngle?: number;
  targetAngle?: number;
};

type StateEdgeProps = EdgeProps<Edge<StateEdgeData>>;

// Calculate intersection point of line with circle
function getCircleIntersection(
  centerX: number,
  centerY: number,
  radius: number,
  targetX: number,
  targetY: number
): { x: number; y: number } {
  const dx = targetX - centerX;
  const dy = targetY - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) {
    return { x: centerX + radius, y: centerY };
  }

  const ratio = radius / distance;
  return {
    x: centerX + dx * ratio,
    y: centerY + dy * ratio
  };
}

export function StateEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
  data
}: StateEdgeProps) {
  const nodes = useNodes();

  // Get node radii from data if available
  const sourceRadius = data?.sourceRadius ?? 30;
  const targetRadius = data?.targetRadius ?? 30;

  // Get actual node positions and calculate centers
  const { sourceCenterX, sourceCenterY, targetCenterX, targetCenterY } =
    useMemo(() => {
      const sourceNode = nodes.find(n => n.id === source);
      const targetNode = nodes.find(n => n.id === target);

      if (!sourceNode || !targetNode) {
        return {
          sourceCenterX: sourceX,
          sourceCenterY: sourceY,
          targetCenterX: targetX,
          targetCenterY: targetY
        };
      }

      return {
        sourceCenterX: sourceNode.position.x + sourceRadius,
        sourceCenterY: sourceNode.position.y + sourceRadius,
        targetCenterX: targetNode.position.x + targetRadius,
        targetCenterY: targetNode.position.y + targetRadius
      };
    }, [
      nodes,
      source,
      target,
      sourceRadius,
      targetRadius,
      sourceX,
      sourceY,
      targetX,
      targetY
    ]);

  // Calculate actual connection points on the circle edges
  const sourcePoint = useMemo(() => {
    // If custom angle is set, use it; otherwise calculate nearest point
    if (data?.sourceAngle !== undefined) {
      return {
        x: sourceCenterX + sourceRadius * Math.cos(data.sourceAngle),
        y: sourceCenterY + sourceRadius * Math.sin(data.sourceAngle)
      };
    }
    return getCircleIntersection(
      sourceCenterX,
      sourceCenterY,
      sourceRadius,
      targetCenterX,
      targetCenterY
    );
  }, [
    sourceCenterX,
    sourceCenterY,
    sourceRadius,
    targetCenterX,
    targetCenterY,
    data?.sourceAngle
  ]);

  const targetPoint = useMemo(() => {
    // If custom angle is set, use it; otherwise calculate nearest point
    if (data?.targetAngle !== undefined) {
      return {
        x: targetCenterX + targetRadius * Math.cos(data.targetAngle),
        y: targetCenterY + targetRadius * Math.sin(data.targetAngle)
      };
    }
    return getCircleIntersection(
      targetCenterX,
      targetCenterY,
      targetRadius,
      sourceCenterX,
      sourceCenterY
    );
  }, [
    targetCenterX,
    targetCenterY,
    targetRadius,
    sourceCenterX,
    sourceCenterY,
    data?.targetAngle
  ]);

  // Calculate edge path (straight or curved)
  const [edgePath, labelX, labelY] = useMemo(() => {
    if (data?.controlPoint) {
      // Use quadratic bezier curve with custom control point
      const { x: cx, y: cy } = data.controlPoint;
      const path = `M ${sourcePoint.x},${sourcePoint.y} Q ${cx},${cy} ${targetPoint.x},${targetPoint.y}`;
      const midX = (sourcePoint.x + 2 * cx + targetPoint.x) / 4;
      const midY = (sourcePoint.y + 2 * cy + targetPoint.y) / 4;
      return [path, midX, midY] as [string, number, number];
    } else {
      // Use straight line
      return getStraightPath({
        sourceX: sourcePoint.x,
        sourceY: sourcePoint.y,
        targetX: targetPoint.x,
        targetY: targetPoint.y
      });
    }
  }, [sourcePoint, targetPoint, data?.controlPoint]);

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {/* Draggable handle at source point */}
      <circle
        cx={sourcePoint.x}
        cy={sourcePoint.y}
        r={6}
        fill="var(--slate-12)"
        stroke="var(--slate-1)"
        strokeWidth={2}
        style={{
          cursor: "grab",
          opacity: 0,
          transition: "opacity 0.2s"
        }}
        className="nodrag nopan edge-handle-source edge-handle"
        data-edge-id={id}
        data-handle-type="source"
      />
      {/* Draggable handle at target point */}
      <circle
        cx={targetPoint.x}
        cy={targetPoint.y}
        r={6}
        fill="var(--slate-12)"
        stroke="var(--slate-1)"
        strokeWidth="3"
        style={{
          cursor: "grab",
          opacity: 0,
          transition: "opacity 0.2s"
        }}
        className="nodrag nopan edge-handle-target edge-handle"
        data-edge-id={id}
        data-handle-type="target"
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all"
          }}
          className="nodrag nopan"
        >
          {data?.label || ""}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
