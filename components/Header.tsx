"use client";

import Link from "next/link";
import { AlgorithmType } from "@/types";
import { ALGORITHMS } from "@/lib/algorithms";

interface HeaderProps {
  selectedAlgorithm: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  onVisualize: () => void;
  onClearGrid: () => void;
  onClearWalls: () => void;
  isRunning: boolean;
  hasStartAndEnd: boolean;
}

/**
 * Header component with title on left, controls on right
 */
export function Header({
  selectedAlgorithm,
  onAlgorithmChange,
  onVisualize,
  onClearGrid,
  onClearWalls,
  isRunning,
  hasStartAndEnd,
}: HeaderProps) {
  return (
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
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Visualizer
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Right: Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Algorithm Selector */}
            <select
              value={selectedAlgorithm}
              onChange={(e) =>
                onAlgorithmChange(e.target.value as AlgorithmType)
              }
              disabled={isRunning}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-800 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {ALGORITHMS.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.name}
                </option>
              ))}
            </select>

            {/* Action Buttons */}
            <button
              onClick={onVisualize}
              disabled={isRunning || !hasStartAndEnd}
              className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRunning ? "Running..." : "Visualize"}
            </button>

            <button
              onClick={onClearGrid}
              disabled={isRunning}
              className="px-4 py-2 text-sm bg-slate-600 text-white font-medium rounded-lg
                         hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear Grid
            </button>

            <button
              onClick={onClearWalls}
              disabled={isRunning}
              className="px-4 py-2 text-sm bg-slate-500 text-white font-medium rounded-lg
                         hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear Walls
            </button>

            {/* Mobile Navigation */}
            <Link
              href="/about"
              className="sm:hidden px-4 py-2 text-sm text-slate-600 font-medium rounded-lg border border-slate-300
                         hover:bg-slate-50 transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
