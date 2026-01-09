"use client";

import { Grid, Controls, Legend } from "@/components";
import { usePathfinding } from "@/hooks/usePathfinding";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Pathfinding Visualizer
          </h1>
          <p className="text-slate-600 max-w-xl">
            Explore how different pathfinding algorithms find the shortest path.
            Click to place start and end nodes, then drag to draw walls.
          </p>
        </header>

        {/* Controls */}
        <Controls
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmChange={setSelectedAlgorithm}
          onVisualize={visualize}
          onClearGrid={clearGrid}
          onClearWalls={clearWalls}
          isRunning={isRunning}
          hasStartAndEnd={hasStartAndEnd}
        />

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

        {/* Footer */}
        <footer className="text-center text-sm text-slate-500">
          <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}
