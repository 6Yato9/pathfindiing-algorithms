"use client";

import { AlgorithmType } from "@/types";
import { ALGORITHMS } from "@/lib/algorithms";

interface ControlsProps {
  selectedAlgorithm: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  onVisualize: () => void;
  onClearGrid: () => void;
  onClearWalls: () => void;
  isRunning: boolean;
  hasStartAndEnd: boolean;
}

/**
 * Control panel with algorithm selection and action buttons
 */
export function Controls({
  selectedAlgorithm,
  onAlgorithmChange,
  onVisualize,
  onClearGrid,
  onClearWalls,
  isRunning,
  hasStartAndEnd,
}: ControlsProps) {
  const selectedAlgorithmInfo = ALGORITHMS.find(
    (a) => a.id === selectedAlgorithm
  );

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      {/* Algorithm Selection */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <label
          htmlFor="algorithm-select"
          className="text-sm font-medium text-slate-700"
        >
          Algorithm:
        </label>
        <select
          id="algorithm-select"
          value={selectedAlgorithm}
          onChange={(e) => onAlgorithmChange(e.target.value as AlgorithmType)}
          disabled={isRunning}
          className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
        >
          {ALGORITHMS.map((algo) => (
            <option key={algo.id} value={algo.id}>
              {algo.name}
            </option>
          ))}
        </select>
      </div>

      {/* Algorithm Description */}
      {selectedAlgorithmInfo && (
        <p className="text-sm text-slate-600 italic">
          {selectedAlgorithmInfo.description}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onVisualize}
          disabled={isRunning || !hasStartAndEnd}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? "Visualizing..." : "Visualize"}
        </button>

        <button
          onClick={onClearGrid}
          disabled={isRunning}
          className="px-6 py-2.5 bg-slate-600 text-white font-medium rounded-lg
                     hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Clear Grid
        </button>

        <button
          onClick={onClearWalls}
          disabled={isRunning}
          className="px-6 py-2.5 bg-slate-500 text-white font-medium rounded-lg
                     hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Clear Walls
        </button>
      </div>

      {/* Instructions */}
      {!hasStartAndEnd && (
        <p className="text-sm text-amber-600 font-medium">
          Click on the grid to place start (green) and end (red) nodes
        </p>
      )}
    </div>
  );
}
