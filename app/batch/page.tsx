"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MiniGrid } from "@/components/MiniGrid";
import { useBatchVisualization } from "@/hooks/useBatchVisualization";

export default function BatchVisualizerPage() {
  const pathname = usePathname();
  const {
    algorithmStates,
    isRunning,
    isInitialized,
    generateNewPattern,
    visualizeAll,
    reset,
  } = useBatchVisualization();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left: Title and Navigation */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  Pathfinding Visualizer
                </h1>
              </Link>
              <nav className="hidden sm:flex items-center gap-4">
                <Link
                  href="/"
                  className={`text-sm font-medium transition-colors ${
                    pathname === "/"
                      ? "text-blue-600 font-bold underline underline-offset-4"
                      : "text-slate-600 hover:text-blue-600"
                  }`}
                >
                  Visualizer
                </Link>
                <Link
                  href="/batch"
                  className={`text-sm font-medium transition-colors ${
                    pathname === "/batch"
                      ? "text-blue-600 font-bold underline underline-offset-4"
                      : "text-slate-600 hover:text-blue-600"
                  }`}
                >
                  Batch Compare
                </Link>
                <Link
                  href="/about"
                  className={`text-sm font-medium transition-colors ${
                    pathname === "/about"
                      ? "text-blue-600 font-bold underline underline-offset-4"
                      : "text-slate-600 hover:text-blue-600"
                  }`}
                >
                  About
                </Link>
              </nav>
            </div>

            {/* Right: Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={generateNewPattern}
                disabled={isRunning}
                className="px-4 py-2 text-sm bg-purple-600 text-white font-medium rounded-lg
                           hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                New Pattern
              </button>

              <button
                onClick={visualizeAll}
                disabled={isRunning}
                className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg
                           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isRunning ? "Running..." : "Visualize All"}
              </button>

              <button
                onClick={reset}
                disabled={isRunning}
                className="px-4 py-2 text-sm bg-slate-600 text-white font-medium rounded-lg
                           hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Description */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Algorithm Comparison
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Compare all pathfinding algorithms side by side with the same maze
              pattern. Click &quot;New Pattern&quot; to generate a random maze,
              then &quot;Visualize All&quot; to see how each algorithm performs.
            </p>
          </div>

          {/* Grid of Mini Visualizers */}
          {!isInitialized ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">Loading grids...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {algorithmStates.map((state) => (
                <MiniGrid
                  key={state.id}
                  grid={state.grid}
                  algorithmName={state.name}
                  isComplete={state.phase === "done"}
                  pathLength={state.pathLength}
                  visitedCount={state.visitedCount}
                />
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span className="text-sm text-slate-600">Start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span className="text-sm text-slate-600">End</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-800" />
              <span className="text-sm text-slate-600">Wall</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-cyan-400" />
              <span className="text-sm text-slate-600">Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-400" />
              <span className="text-sm text-slate-600">Path</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-slate-500 py-4 border-t border-slate-200">
        <p>Built by Abdellah Anca with Next.js, TypeScript, and Tailwind CSS</p>
      </footer>
    </div>
  );
}
