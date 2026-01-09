"use client";

import { useState, useCallback, useRef } from "react";
import { Grid, GridNode, AlgorithmType, NodeState } from "@/types";
import {
  createGrid,
  cloneGrid,
  resetGridVisualization,
  clearWalls as clearWallsUtil,
} from "@/lib/grid";
import { runAlgorithm } from "@/lib/algorithms";

// Grid dimensions - larger grid for better visualization
const GRID_ROWS = 25;
const GRID_COLS = 50;

// Animation speeds (in milliseconds)
const VISITED_ANIMATION_SPEED = 15;
const PATH_ANIMATION_SPEED = 40;

interface UsePathfindingReturn {
  grid: Grid;
  selectedAlgorithm: AlgorithmType;
  isRunning: boolean;
  isPaused: boolean;
  startNode: { row: number; col: number } | null;
  endNode: { row: number; col: number } | null;
  setSelectedAlgorithm: (algorithm: AlgorithmType) => void;
  handleMouseDown: (row: number, col: number) => void;
  handleMouseEnter: (row: number, col: number) => void;
  handleMouseUp: () => void;
  visualize: () => void;
  togglePause: () => void;
  clearGrid: () => void;
  clearWalls: () => void;
}

// Animation state stored in ref to persist across renders
interface AnimationState {
  visitedNodes: GridNode[];
  shortestPath: GridNode[];
  currentVisitedIndex: number;
  currentPathIndex: number;
  phase: "idle" | "visiting" | "path" | "done";
}

/**
 * Custom hook that manages all pathfinding state and logic
 */
export function usePathfinding(): UsePathfindingReturn {
  const [grid, setGrid] = useState<Grid>(() =>
    createGrid(GRID_ROWS, GRID_COLS)
  );
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmType>("astar");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startNode, setStartNode] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [endNode, setEndNode] = useState<{ row: number; col: number } | null>(
    null
  );
  const [isMousePressed, setIsMousePressed] = useState(false);

  // Track what action we're doing when dragging
  const currentAction = useRef<"wall" | "erase" | null>(null);

  // Animation state ref
  const animationState = useRef<AnimationState>({
    visitedNodes: [],
    shortestPath: [],
    currentVisitedIndex: 0,
    currentPathIndex: 0,
    phase: "idle",
  });

  // Animation timeout ref for cleanup
  const animationTimeout = useRef<NodeJS.Timeout | null>(null);

  // Pause state ref (for use in animation loop)
  const isPausedRef = useRef(false);

  /**
   * Clear all pending animations
   */
  const clearAnimations = useCallback(() => {
    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current);
      animationTimeout.current = null;
    }
    animationState.current = {
      visitedNodes: [],
      shortestPath: [],
      currentVisitedIndex: 0,
      currentPathIndex: 0,
      phase: "idle",
    };
  }, []);

  /**
   * Handle mouse down on a cell
   */
  const handleMouseDown = useCallback(
    (row: number, col: number) => {
      if (isRunning) return;

      setIsMousePressed(true);

      const node = grid[row][col];

      // First click places start, second places end
      if (!startNode) {
        setStartNode({ row, col });
        setGrid((prev) => {
          const newGrid = [...prev];
          newGrid[row] = [...newGrid[row]];
          newGrid[row][col] = { ...newGrid[row][col], state: "start" };
          return newGrid;
        });
        return;
      }

      if (!endNode && node.state !== "start") {
        setEndNode({ row, col });
        setGrid((prev) => {
          const newGrid = [...prev];
          newGrid[row] = [...newGrid[row]];
          newGrid[row][col] = { ...newGrid[row][col], state: "end" };
          return newGrid;
        });
        return;
      }

      // Don't allow modifying start/end nodes
      if (node.state === "start" || node.state === "end") return;

      // Toggle wall or erase
      if (node.state === "wall") {
        currentAction.current = "erase";
        updateNodeState(row, col, "empty");
      } else {
        currentAction.current = "wall";
        updateNodeState(row, col, "wall");
      }
    },
    [grid, startNode, endNode, isRunning]
  );

  /**
   * Handle mouse enter on a cell (for dragging walls)
   */
  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      if (!isMousePressed || isRunning) return;

      const node = grid[row][col];

      // Don't modify start/end nodes
      if (node.state === "start" || node.state === "end") return;

      if (currentAction.current === "wall" && node.state !== "wall") {
        updateNodeState(row, col, "wall");
      } else if (currentAction.current === "erase" && node.state === "wall") {
        updateNodeState(row, col, "empty");
      }
    },
    [grid, isMousePressed, isRunning]
  );

  /**
   * Handle mouse up
   */
  const handleMouseUp = useCallback(() => {
    setIsMousePressed(false);
    currentAction.current = null;
  }, []);

  /**
   * Update a single node's state
   */
  const updateNodeState = (row: number, col: number, state: NodeState) => {
    setGrid((prev) => {
      const newGrid = [...prev];
      newGrid[row] = [...newGrid[row]];
      newGrid[row][col] = { ...newGrid[row][col], state };
      return newGrid;
    });
  };

  /**
   * Run one step of the animation
   */
  const runAnimationStep = useCallback(() => {
    const state = animationState.current;

    // Check if paused
    if (isPausedRef.current) {
      return;
    }

    if (state.phase === "visiting") {
      if (state.currentVisitedIndex < state.visitedNodes.length) {
        const node = state.visitedNodes[state.currentVisitedIndex];

        // Don't overwrite start/end nodes
        if (node.state !== "start" && node.state !== "end") {
          setGrid((prev) => {
            const newGrid = [...prev];
            newGrid[node.row] = [...newGrid[node.row]];
            newGrid[node.row][node.col] = {
              ...newGrid[node.row][node.col],
              state: "visited",
            };
            return newGrid;
          });
        }

        state.currentVisitedIndex++;
        animationTimeout.current = setTimeout(
          runAnimationStep,
          VISITED_ANIMATION_SPEED
        );
      } else {
        // Move to path phase
        state.phase = "path";
        animationTimeout.current = setTimeout(
          runAnimationStep,
          VISITED_ANIMATION_SPEED
        );
      }
    } else if (state.phase === "path") {
      if (state.currentPathIndex < state.shortestPath.length) {
        const node = state.shortestPath[state.currentPathIndex];

        // Don't overwrite start/end nodes
        if (node.state !== "start" && node.state !== "end") {
          setGrid((prev) => {
            const newGrid = [...prev];
            newGrid[node.row] = [...newGrid[node.row]];
            newGrid[node.row][node.col] = {
              ...newGrid[node.row][node.col],
              state: "path",
            };
            return newGrid;
          });
        }

        state.currentPathIndex++;
        animationTimeout.current = setTimeout(
          runAnimationStep,
          PATH_ANIMATION_SPEED
        );
      } else {
        // Animation complete
        state.phase = "done";
        setIsRunning(false);
        setIsPaused(false);
        isPausedRef.current = false;
      }
    }
  }, []);

  /**
   * Toggle pause/resume
   */
  const togglePause = useCallback(() => {
    if (!isRunning) return;

    if (isPaused) {
      // Resume
      setIsPaused(false);
      isPausedRef.current = false;
      runAnimationStep();
    } else {
      // Pause
      setIsPaused(true);
      isPausedRef.current = true;
      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
        animationTimeout.current = null;
      }
    }
  }, [isRunning, isPaused, runAnimationStep]);

  /**
   * Run the visualization
   */
  const visualize = useCallback(() => {
    if (!startNode || !endNode || isRunning) return;

    setIsRunning(true);
    setIsPaused(false);
    isPausedRef.current = false;
    clearAnimations();

    // Reset visualization but keep walls
    setGrid((prev) => resetGridVisualization(prev));

    // Small delay to ensure grid is reset before running algorithm
    setTimeout(() => {
      // Clone the grid for algorithm execution
      const gridClone = cloneGrid(grid);

      // Preserve wall states in clone
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
          gridClone[row][col].state =
            grid[row][col].state === "visited" ||
            grid[row][col].state === "path"
              ? "empty"
              : grid[row][col].state;
        }
      }

      const start = gridClone[startNode.row][startNode.col];
      const end = gridClone[endNode.row][endNode.col];

      const result = runAlgorithm(selectedAlgorithm, gridClone, start, end);

      // Set up animation state
      animationState.current = {
        visitedNodes: result.visitedNodesInOrder,
        shortestPath: result.shortestPath,
        currentVisitedIndex: 0,
        currentPathIndex: 0,
        phase: "visiting",
      };

      // Start animation
      runAnimationStep();
    }, 50);
  }, [
    startNode,
    endNode,
    isRunning,
    grid,
    selectedAlgorithm,
    clearAnimations,
    runAnimationStep,
  ]);

  /**
   * Clear the entire grid
   */
  const clearGrid = useCallback(() => {
    if (isRunning) return;

    clearAnimations();
    setGrid(createGrid(GRID_ROWS, GRID_COLS));
    setStartNode(null);
    setEndNode(null);
  }, [isRunning, clearAnimations]);

  /**
   * Clear only walls (keep start/end)
   */
  const clearWalls = useCallback(() => {
    if (isRunning) return;

    clearAnimations();
    setGrid((prev) => {
      const newGrid = clearWallsUtil(resetGridVisualization(prev));
      return newGrid;
    });
  }, [isRunning, clearAnimations]);

  return {
    grid,
    selectedAlgorithm,
    isRunning,
    isPaused,
    startNode,
    endNode,
    setSelectedAlgorithm,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    visualize,
    togglePause,
    clearGrid,
    clearWalls,
  };
}
