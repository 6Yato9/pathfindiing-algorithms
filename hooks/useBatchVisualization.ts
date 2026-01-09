"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Grid, GridNode, AlgorithmType } from "@/types";
import { ALGORITHMS, runAlgorithm } from "@/lib/algorithms";
import {
  generateRandomPattern,
  cloneGridPattern,
  resetVisualization,
  createEmptyGrid,
} from "@/lib/gridUtils";

// Smaller grid for batch visualization
const GRID_ROWS = 15;
const GRID_COLS = 25;
const WALL_DENSITY = 0.25;

// Animation speed
const ANIMATION_SPEED = 10;
const PATH_ANIMATION_SPEED = 25;

interface AlgorithmState {
  id: AlgorithmType;
  name: string;
  grid: Grid;
  visitedNodes: GridNode[];
  shortestPath: GridNode[];
  currentVisitedIndex: number;
  currentPathIndex: number;
  phase: "idle" | "visiting" | "path" | "done";
  visitedCount: number;
  pathLength: number | null;
}

interface UseBatchVisualizationReturn {
  algorithmStates: AlgorithmState[];
  isRunning: boolean;
  isInitialized: boolean;
  generateNewPattern: () => void;
  visualizeAll: () => void;
  reset: () => void;
}

// Create empty initial states (no randomness - safe for SSR)
function createEmptyStates(): AlgorithmState[] {
  const emptyGrid = createEmptyGrid(GRID_ROWS, GRID_COLS);

  return ALGORITHMS.map((algo) => ({
    id: algo.id,
    name: algo.name,
    grid: cloneGridPattern(emptyGrid),
    visitedNodes: [],
    shortestPath: [],
    currentVisitedIndex: 0,
    currentPathIndex: 0,
    phase: "idle" as const,
    visitedCount: 0,
    pathLength: null,
  }));
}

export function useBatchVisualization(): UseBatchVisualizationReturn {
  // Start with empty grids (SSR-safe)
  const [algorithmStates, setAlgorithmStates] =
    useState<AlgorithmState[]>(createEmptyStates);
  const [isRunning, setIsRunning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random pattern only on client-side after mount
  useEffect(() => {
    const { grid, startPos, endPos } = generateRandomPattern(
      GRID_ROWS,
      GRID_COLS,
      WALL_DENSITY
    );

    console.log("Generated pattern - Start:", startPos, "End:", endPos);
    console.log("Start node state:", grid[startPos.row][startPos.col].state);
    console.log("End node state:", grid[endPos.row][endPos.col].state);

    setAlgorithmStates(
      ALGORITHMS.map((algo) => ({
        id: algo.id,
        name: algo.name,
        grid: cloneGridPattern(grid),
        visitedNodes: [],
        shortestPath: [],
        currentVisitedIndex: 0,
        currentPathIndex: 0,
        phase: "idle" as const,
        visitedCount: 0,
        pathLength: null,
      }))
    );
    setIsInitialized(true);
  }, []);

  const generateNewPattern = useCallback(() => {
    if (isRunning) return;

    const { grid } = generateRandomPattern(GRID_ROWS, GRID_COLS, WALL_DENSITY);

    setAlgorithmStates(
      ALGORITHMS.map((algo) => ({
        id: algo.id,
        name: algo.name,
        grid: cloneGridPattern(grid),
        visitedNodes: [],
        shortestPath: [],
        currentVisitedIndex: 0,
        currentPathIndex: 0,
        phase: "idle" as const,
        visitedCount: 0,
        pathLength: null,
      }))
    );
  }, [isRunning]);

  const reset = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    setIsRunning(false);

    setAlgorithmStates((prev) =>
      prev.map((state) => ({
        ...state,
        grid: resetVisualization(state.grid),
        visitedNodes: [],
        shortestPath: [],
        currentVisitedIndex: 0,
        currentPathIndex: 0,
        phase: "idle" as const,
        visitedCount: 0,
        pathLength: null,
      }))
    );
  }, []);

  const runAnimationStep = useCallback(() => {
    setAlgorithmStates((prev) => {
      let allDone = true;
      let anyVisiting = false;

      const newStates = prev.map((state) => {
        if (state.phase === "done") return state;

        allDone = false;

        if (state.phase === "visiting") {
          anyVisiting = true;
          if (state.currentVisitedIndex < state.visitedNodes.length) {
            const node = state.visitedNodes[state.currentVisitedIndex];
            const newGrid = [...state.grid];
            newGrid[node.row] = [...newGrid[node.row]];

            // Check the display grid's state, not the algorithm node's state
            const displayNodeState = state.grid[node.row][node.col].state;
            if (displayNodeState !== "start" && displayNodeState !== "end") {
              newGrid[node.row][node.col] = {
                ...newGrid[node.row][node.col],
                state: "visited",
              };
            }

            return {
              ...state,
              grid: newGrid,
              currentVisitedIndex: state.currentVisitedIndex + 1,
              visitedCount: state.currentVisitedIndex + 1,
            };
          } else {
            // Move to path phase
            return { ...state, phase: "path" as const };
          }
        } else if (state.phase === "path") {
          if (state.currentPathIndex < state.shortestPath.length) {
            const node = state.shortestPath[state.currentPathIndex];
            const newGrid = [...state.grid];
            newGrid[node.row] = [...newGrid[node.row]];

            // Check the display grid's state, not the algorithm node's state
            const displayNodeState = state.grid[node.row][node.col].state;
            if (displayNodeState !== "start" && displayNodeState !== "end") {
              newGrid[node.row][node.col] = {
                ...newGrid[node.row][node.col],
                state: "path",
              };
            }

            return {
              ...state,
              grid: newGrid,
              currentPathIndex: state.currentPathIndex + 1,
            };
          } else {
            // Done
            return {
              ...state,
              phase: "done" as const,
              pathLength:
                state.shortestPath.length > 0
                  ? state.shortestPath.length
                  : null,
            };
          }
        }

        return state;
      });

      // Schedule next frame (inside the callback so we have correct values)
      if (!allDone) {
        const speed = anyVisiting ? ANIMATION_SPEED : PATH_ANIMATION_SPEED;
        animationRef.current = setTimeout(runAnimationStep, speed);
      } else {
        setIsRunning(false);
      }

      return newStates;
    });
  }, []);

  const visualizeAll = useCallback(() => {
    if (isRunning) return;

    // Reset and run algorithms
    setAlgorithmStates((prev) => {
      const baseGrid = prev[0].grid;

      // Find start and end positions
      let startPos: { row: number; col: number } | null = null;
      let endPos: { row: number; col: number } | null = null;

      // Debug: count all states
      const stateCounts: Record<string, number> = {};
      for (let row = 0; row < baseGrid.length; row++) {
        for (let col = 0; col < baseGrid[0].length; col++) {
          const state = baseGrid[row][col].state;
          stateCounts[state] = (stateCounts[state] || 0) + 1;
          if (state === "start") {
            startPos = { row, col };
          } else if (state === "end") {
            endPos = { row, col };
          }
        }
      }

      console.log("Grid state counts:", stateCounts);
      console.log("Start position:", startPos);
      console.log("End position:", endPos);

      // If no start or end found, return unchanged
      if (!startPos || !endPos) {
        console.error("No start or end position found in grid");
        return prev;
      }

      const finalStartPos = startPos;
      const finalEndPos = endPos;

      return prev.map((state, index) => {
        // Create a fresh clone for algorithm execution
        const gridClone = cloneGridPattern(state.grid);

        // Verify the cloned grid has correct start/end states
        const start = gridClone[finalStartPos.row][finalStartPos.col];
        const end = gridClone[finalEndPos.row][finalEndPos.col];

        // Ensure start and end have correct states (in case they were overwritten by walls)
        start.state = "start";
        end.state = "end";

        console.log(
          `[${state.id}] Running algorithm, start: (${finalStartPos.row},${finalStartPos.col}), end: (${finalEndPos.row},${finalEndPos.col})`
        );

        const result = runAlgorithm(state.id, gridClone, start, end);

        console.log(
          `[${state.id}] Result: ${result.visitedNodesInOrder.length} visited, ${result.shortestPath.length} path`
        );

        // Reset the display grid (keep walls, start, end)
        const freshGrid = resetVisualization(state.grid);

        return {
          ...state,
          grid: freshGrid,
          visitedNodes: result.visitedNodesInOrder,
          shortestPath: result.shortestPath,
          currentVisitedIndex: 0,
          currentPathIndex: 0,
          phase: "visiting" as const,
          visitedCount: 0,
          pathLength: null,
        };
      });
    });

    setIsRunning(true);

    // Start animation after state update
    setTimeout(() => {
      runAnimationStep();
    }, 50);
  }, [isRunning, runAnimationStep]);

  return {
    algorithmStates,
    isRunning,
    isInitialized,
    generateNewPattern,
    visualizeAll,
    reset,
  };
}
