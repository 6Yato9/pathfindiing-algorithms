"use client";

import { Grid as GridType } from "@/types";
import { Node } from "./Node";

interface GridProps {
  grid: GridType;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

/**
 * Grid component that renders all nodes
 */
export function Grid({
  grid,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}: GridProps) {
  return (
    <div
      className="inline-block border-2 border-slate-300 rounded-lg overflow-hidden shadow-lg"
      role="grid"
      aria-label="Pathfinding grid"
    >
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex" role="row">
          {row.map((node) => (
            <Node
              key={`${node.row}-${node.col}`}
              row={node.row}
              col={node.col}
              state={node.state}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
              onMouseUp={onMouseUp}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
