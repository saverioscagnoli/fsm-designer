import type React from "react";

type Position = { x: number; y: number };

type Node<T, K extends React.FC<T>> = {
  id: string;
  position: Position;
  props: T;
  component: K;
};

export type { Node };
