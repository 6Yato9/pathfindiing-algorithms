"use client";

import { memo } from "react";
import { NodeState } from "@/types";

interface NodeProps {
  row: number;
  col: number;
  state: NodeState;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

/**
 * Individual grid cell component
 * Memoized to prevent unnecessary re-renders
 */
function NodeComponent({
  row,
  col,
  state,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}: NodeProps) {
  const getStateClasses = (): string => {
    const baseClasses =
      "w-6 h-6 border border-slate-200 transition-colors duration-100";

    switch (state) {
      case "start":
        return `${baseClasses} bg-green-500 border-green-600`;
      case "end":
        return `${baseClasses} bg-red-500 border-red-600`;
      case "wall":
        return `${baseClasses} bg-slate-800 border-slate-900`;
      case "visited":
        return `${baseClasses} bg-cyan-400 border-cyan-500 animate-visited`;
      case "path":
        return `${baseClasses} bg-yellow-400 border-yellow-500 animate-path`;
      default:
        return `${baseClasses} bg-white hover:bg-slate-100`;
    }
  };

  return (
    <div
      className={getStateClasses()}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
      role="gridcell"
      aria-label={`Cell ${row}-${col}: ${state}`}
    />
  );
}

export const Node = memo(NodeComponent);
