import { useEvent } from "@util-hooks/use-event";
import {
  addEdge,
  applyEdgeChanges,
  Background,
  MarkerType,
  ReactFlow,
  SelectionMode,
  useReactFlow,
  type Connection,
  type Edge,
  type EdgeChange
} from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { State } from "~/components/state";
import { StateEdge } from "~/components/state-edge";
import { useTheme } from "~/context/theme";
import { viewportMouseDown } from "~/events/viewport/mouse-down";
import { BASE_STATE_RADIUS } from "~/lib/consts";
import { cn } from "~/lib/utils";
import { useMachine } from "~/zustand/machine";

const Viewport = () => {
  const { theme } = useTheme();
  const machine = useMachine();
  const flow = useReactFlow();
  const vpRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Connection state
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [connectionPos, setConnectionPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const shiftHeldRef = useRef(false);

  // Edge curving state
  const [isCurvingEdge, setIsCurvingEdge] = useState(false);
  const [curvingEdgeId, setCurvingEdgeId] = useState<string | null>(null);
  const curvingStartPos = useRef<{ x: number; y: number } | null>(null);

  // Edge handle dragging state
  const [isDraggingHandle, setIsDraggingHandle] = useState(false);
  const [draggingEdgeId, setDraggingEdgeId] = useState<string | null>(null);
  const [draggingHandleType, setDraggingHandleType] = useState<
    "source" | "target" | null
  >(null);

  const onEdgesChange = useCallback(
    (c: EdgeChange[]) =>
      setEdges(edgesSnapshot => applyEdgeChanges(c, edgesSnapshot)),
    []
  );

  const onConnect = useCallback(
    (p: Connection) => {
      // Get source and target node radii
      const sourceNode = machine.nodes.find(n => n.id === p.source);
      const targetNode = machine.nodes.find(n => n.id === p.target);

      const newEdge = {
        ...p,
        type: "state",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: "var(--slate-12)"
        },
        data: {
          sourceRadius: sourceNode?.data.radius || BASE_STATE_RADIUS,
          targetRadius: targetNode?.data.radius || BASE_STATE_RADIUS,
          label: ""
        }
      };

      setEdges(edgesSnapshot => addEdge(newEdge, edgesSnapshot));
    },
    [machine.nodes]
  );

  // Handle edge click for curving
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    if (event.shiftKey) {
      event.preventDefault();
      setIsCurvingEdge(true);
      setCurvingEdgeId(edge.id);
      curvingStartPos.current = { x: event.clientX, y: event.clientY };
    }
  }, []);

  // Track Shift key state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey) {
        shiftHeldRef.current = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.shiftKey) {
        shiftHeldRef.current = false;
        // Cancel connection if Shift is released while connecting
        if (isConnecting) {
          setIsConnecting(false);
          setConnectionStart(null);
          setConnectionPos(null);
        }
        // Cancel edge curving if Shift is released
        if (isCurvingEdge) {
          setIsCurvingEdge(false);
          setCurvingEdgeId(null);
          curvingStartPos.current = null;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isConnecting, isCurvingEdge, isDraggingHandle]);

  // Handle mouse move for edge curving
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isCurvingEdge && curvingEdgeId && curvingStartPos.current) {
        const flowPos = flow.screenToFlowPosition({
          x: e.clientX,
          y: e.clientY
        });

        // Update the edge with the new control point
        setEdges(edges =>
          edges.map(edge => {
            if (edge.id === curvingEdgeId) {
              return {
                ...edge,
                data: {
                  ...edge.data,
                  controlPoint: flowPos
                }
              };
            }
            return edge;
          })
        );
      }
    };

    const handleMouseUp = () => {
      if (isCurvingEdge) {
        setIsCurvingEdge(false);
        setCurvingEdgeId(null);
        curvingStartPos.current = null;
      }
    };

    if (isCurvingEdge) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isCurvingEdge, curvingEdgeId, flow]);

  // Handle edge handle dragging
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if clicking on an edge handle
      if (
        target.classList.contains("edge-handle-source") ||
        target.classList.contains("edge-handle-target")
      ) {
        e.preventDefault();
        e.stopPropagation();

        const edgeId = target.getAttribute("data-edge-id");
        const handleType = target.getAttribute("data-handle-type") as
          | "source"
          | "target";

        if (edgeId && handleType) {
          setIsDraggingHandle(true);
          setDraggingEdgeId(edgeId);
          setDraggingHandleType(handleType);
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingHandle && draggingEdgeId && draggingHandleType) {
        const flowPos = flow.screenToFlowPosition({
          x: e.clientX,
          y: e.clientY
        });

        setEdges(edges =>
          edges.map(edge => {
            if (edge.id === draggingEdgeId) {
              // Get the relevant node (source or target)
              const nodeId =
                draggingHandleType === "source" ? edge.source : edge.target;
              const node = machine.nodes.find(n => n.id === nodeId);

              if (node) {
                const radius = node.data.radius;
                const centerX = node.position.x + radius;
                const centerY = node.position.y + radius;

                // Calculate angle from node center to mouse position
                const angle = Math.atan2(
                  flowPos.y - centerY,
                  flowPos.x - centerX
                );

                return {
                  ...edge,
                  data: {
                    ...edge.data,
                    [draggingHandleType === "source"
                      ? "sourceAngle"
                      : "targetAngle"]: angle
                  }
                };
              }
            }
            return edge;
          })
        );
      }
    };

    const handleMouseUp = () => {
      if (isDraggingHandle) {
        setIsDraggingHandle(false);
        setDraggingEdgeId(null);
        setDraggingHandleType(null);
      }
    };

    if (isDraggingHandle) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    const viewport = vpRef.current;
    if (viewport) {
      viewport.addEventListener("mousedown", handleMouseDown, true);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (viewport) {
        viewport.removeEventListener("mousedown", handleMouseDown, true);
      }
    };
  }, [
    isDraggingHandle,
    draggingEdgeId,
    draggingHandleType,
    flow,
    machine.nodes
  ]);

  // Handle mouse events for custom connection
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!e.shiftKey || e.button !== 0) return;

      shiftHeldRef.current = true;

      // Check if clicking on a node
      const target = e.target as HTMLElement;
      const nodeElement = target.closest(".react-flow__node");

      if (nodeElement) {
        const nodeId = nodeElement.getAttribute("data-id");
        if (nodeId) {
          setIsConnecting(true);
          setConnectionStart(nodeId);
          setConnectionPos({ x: e.clientX, y: e.clientY });
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isConnecting && connectionStart) {
        setConnectionPos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isConnecting || !connectionStart) return;

      // Only create connection if Shift is still held
      if (shiftHeldRef.current) {
        const target = e.target as HTMLElement;
        const nodeElement = target.closest(".react-flow__node");

        if (nodeElement) {
          const targetNodeId = nodeElement.getAttribute("data-id");
          if (targetNodeId && targetNodeId !== connectionStart) {
            // Create the connection
            onConnect({
              source: connectionStart,
              target: targetNodeId,
              sourceHandle: "default",
              targetHandle: "default"
            });
          }
        }
      }

      // Reset connection state
      setIsConnecting(false);
      setConnectionStart(null);
      setConnectionPos(null);
    };

    const viewport = vpRef.current;
    if (viewport) {
      // Use capture phase to intercept before React Flow's handlers
      viewport.addEventListener("mousedown", handleMouseDown, true);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (viewport) {
        viewport.removeEventListener("mousedown", handleMouseDown, true);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isConnecting, connectionStart, onConnect]);

  useEvent(vpRef, "mousedown", viewportMouseDown(machine, flow));

  useEffect(() => {
    let x = window.innerWidth / 2 - BASE_STATE_RADIUS;
    let y = window.innerHeight / 2 - BASE_STATE_RADIUS;

    machine.addNode({ x, y });
  }, []);

  // Get node positions for connection line
  const getNodeCenter = (nodeId: string): { x: number; y: number } | null => {
    const node = machine.nodes.find(n => n.id === nodeId);
    if (!node) return null;

    const radius = node.data.radius;
    return {
      x: node.position.x + radius,
      y: node.position.y + radius
    };
  };

  const renderConnectionLine = () => {
    if (!isConnecting || !connectionStart || !connectionPos) return null;

    const startPos = getNodeCenter(connectionStart);
    if (!startPos) return null;

    const startScreen = flow.flowToScreenPosition(startPos);

    return (
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1000
        }}
      >
        <line
          x1={startScreen.x}
          y1={startScreen.y}
          x2={connectionPos.x}
          y2={connectionPos.y}
          stroke="var(--slate-12)"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>
    );
  };

  return (
    <div className={cn("w-full h-full", "relative")}>
      <ReactFlow
        className={cn("transition-colors")}
        colorMode={theme}
        nodes={machine.nodes}
        edges={edges}
        onNodesChange={machine.onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        nodeTypes={{ state: State }}
        edgeTypes={{ state: StateEdge }}
        defaultEdgeOptions={{
          type: "state",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 16,
            height: 16,
            color: "var(--slate-12)"
          }
        }}
        connectOnClick={false}
        fitView
        panOnDrag={[2]}
        selectionOnDrag={false}
        selectionMode={SelectionMode.Partial}
        multiSelectionKeyCode={null}
        selectionKeyCode={null}
        proOptions={{ hideAttribution: true }}
        ref={vpRef}
      >
        <Background color="var(--gray-9)" />
      </ReactFlow>
      {renderConnectionLine()}
    </div>
  );
};

export { Viewport };
