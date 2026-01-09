/**
 * Represents the possible states of a grid node
 */
export type NodeState = "empty" | "start" | "end" | "wall" | "visited" | "path";

/**
 * Represents a single node in the pathfinding grid
 */
export interface GridNode {
  row: number;
  col: number;
  state: NodeState;
  distance: number; // Used for Dijkstra's and A*
  heuristic: number; // Used for A* (f = g + h)
  totalCost: number; // f-score for A*
  previousNode: GridNode | null;
  isVisited: boolean;
}

/**
 * Represents the entire grid
 */
export type Grid = GridNode[][];

/**
 * Result returned by pathfinding algorithms
 */
export interface PathfindingResult {
  visitedNodesInOrder: GridNode[];
  shortestPath: GridNode[];
}

/**
 * Available pathfinding algorithms
 */
export type AlgorithmType = "bfs" | "dfs" | "dijkstra" | "astar";

/**
 * Algorithm metadata for UI display
 */
export interface AlgorithmInfo {
  id: AlgorithmType;
  name: string;
  description: string;
}

/**
 * Grid dimensions configuration
 */
export interface GridConfig {
  rows: number;
  cols: number;
}
