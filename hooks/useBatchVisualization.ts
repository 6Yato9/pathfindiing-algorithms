"use client";

import { useState, useCallback, useRef } from "react";
import { Grid, GridNode, AlgorithmType } from "@/types";
import { ALGORITHMS, runAlgorithm } from "@/lib/algorithms";
import {
  generateRandomPattern,
  cloneGridPattern,
  resetVisualization,
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
  generateNewPattern: () => void;
  visualizeAll: () => void;
  reset: () => void;
}

export function useBatchVisualization(): UseBatchVisualizationReturn {
  const [algorithmStates, setAlgorithmStates] = useState<AlgorithmState[]>(() =>
    initializeStates()
  );
  const [isRunning, setIsRunning] = useState(false);

  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const statesRef = useRef<AlgorithmState[]>(algorithmStates);

  // Keep ref in sync
  statesRef.current = algorithmStates;

  function initializeStates(): AlgorithmState[] {
    const { grid } = generateRandomPattern(GRID_ROWS, GRID_COLS, WALL_DENSITY);

    return ALGORITHMS.map((algo) => ({
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
    }));
  }

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
    let allDone = true;
    let anyVisiting = false;

    setAlgorithmStates((prev) => {
      const newStates = prev.map((state) => {
        if (state.phase === "done") return state;

        allDone = false;

        if (state.phase === "visiting") {
          anyVisiting = true;
          if (state.currentVisitedIndex < state.visitedNodes.length) {
            const node = state.visitedNodes[state.currentVisitedIndex];
            const newGrid = [...state.grid];
            newGrid[node.row] = [...newGrid[node.row]];

            if (node.state !== "start" && node.state !== "end") {
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

            if (node.state !== "start" && node.state !== "end") {
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

      return newStates;
    });

    // Schedule next frame
    if (!allDone) {
      const speed = anyVisiting ? ANIMATION_SPEED : PATH_ANIMATION_SPEED;
      animationRef.current = setTimeout(runAnimationStep, speed);
    } else {
      setIsRunning(false);
    }
  }, []);

  const visualizeAll = useCallback(() => {
    if (isRunning) return;

    // Reset and run algorithms
    setAlgorithmStates((prev) => {
      const baseGrid = prev[0].grid;

      // Find start and end positions
      let startPos = { row: 0, col: 0 };
      let endPos = { row: 0, col: 0 };

      for (let row = 0; row < baseGrid.length; row++) {
        for (let col = 0; col < baseGrid[0].length; col++) {
          if (baseGrid[row][col].state === "start") {
            startPos = { row, col };
          } else if (baseGrid[row][col].state === "end") {
            endPos = { row, col };
          }
        }
      }

      return prev.map((state) => {
        // Reset the grid
        const freshGrid = resetVisualization(state.grid);
        const gridClone = cloneGridPattern(freshGrid);

        // Run the algorithm
        const start = gridClone[startPos.row][startPos.col];
        const end = gridClone[endPos.row][endPos.col];
        const result = runAlgorithm(state.id, gridClone, start, end);

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
    generateNewPattern,
    visualizeAll,
    reset,
  };
}
