"use client";

import { memo } from "react";
import { Grid as GridType, NodeState } from "@/types";

interface MiniGridProps {
  grid: GridType;
  algorithmName: string;
  isComplete: boolean;
  pathLength: number | null;
  visitedCount: number;
}

/**
 * Small grid component for batch visualization
 */
function MiniGridComponent({
  grid,
  algorithmName,
  isComplete,
  pathLength,
  visitedCount,
}: MiniGridProps) {
  const getStateColor = (state: NodeState): string => {
    switch (state) {
      case "start":
        return "bg-green-500";
      case "end":
        return "bg-red-500";
      case "wall":
        return "bg-slate-800";
      case "visited":
        return "bg-cyan-400";
      case "path":
        return "bg-yellow-400";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-md">
      <h3 className="text-sm font-semibold text-slate-700 text-center">
        {algorithmName}
      </h3>

      {/* Mini Grid */}
      <div className="border border-slate-300 rounded overflow-hidden">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((node) => (
              <div
                key={`${node.row}-${node.col}`}
                className={`w-3 h-3 border-[0.5px] border-slate-200 ${getStateColor(
                  node.state
                )}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="text-xs text-slate-500 text-center space-y-0.5">
        <p>
          Visited:{" "}
          <span className="font-medium text-cyan-600">{visitedCount}</span>
        </p>
        <p>
          Path:{" "}
          <span
            className={`font-medium ${
              pathLength !== null ? "text-yellow-600" : "text-red-500"
            }`}
          >
            {pathLength !== null ? pathLength : "No path"}
          </span>
        </p>
        {isComplete && <p className="text-green-600 font-medium">Complete</p>}
      </div>
    </div>
  );
}

export const MiniGrid = memo(MiniGridComponent);
