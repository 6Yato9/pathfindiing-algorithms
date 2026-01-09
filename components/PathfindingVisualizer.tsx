"use client";

import { Grid, Legend, Header } from "@/components";
import { usePathfinding } from "@/hooks/usePathfinding";
import { ALGORITHMS } from "@/lib/algorithms";

/**
 * Main pathfinding visualizer component
 * Contains all the UI and state management
 */
export function PathfindingVisualizer() {
  const {
    grid,
    selectedAlgorithm,
    isRunning,
    startNode,
    endNode,
    setSelectedAlgorithm,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    visualize,
    clearGrid,
    clearWalls,
  } = usePathfinding();

  const hasStartAndEnd = startNode !== null && endNode !== null;
  const selectedAlgorithmInfo = ALGORITHMS.find(
    (a) => a.id === selectedAlgorithm
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header with controls */}
      <Header
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmChange={setSelectedAlgorithm}
        onVisualize={visualize}
        onClearGrid={clearGrid}
        onClearWalls={clearWalls}
        isRunning={isRunning}
        hasStartAndEnd={hasStartAndEnd}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center gap-6 py-6 px-4">
        {/* Instructions & Algorithm Info */}
        <div className="text-center max-w-2xl">
          <p className="text-slate-600 mb-2">
            Click to place start and end nodes, then drag to draw walls.
          </p>
          {selectedAlgorithmInfo && (
            <p className="text-sm text-slate-500 italic">
              <span className="font-medium">{selectedAlgorithmInfo.name}:</span>{" "}
              {selectedAlgorithmInfo.description}
            </p>
          )}
          {!hasStartAndEnd && (
            <p className="text-sm text-amber-600 font-medium mt-2">
              Click on the grid to place start (green) and end (red) nodes
            </p>
          )}
        </div>

        {/* Legend */}
        <Legend />

        {/* Grid */}
        <div
          className="overflow-x-auto w-full flex justify-center pb-4"
          onMouseLeave={handleMouseUp}
        >
          <Grid
            grid={grid}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseUp={handleMouseUp}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-slate-500 py-4 border-t border-slate-200">
        <p>Built by Abdellah Anca with Next.js, TypeScript, and Tailwind CSS</p>
      </footer>
    </div>
  );
}
