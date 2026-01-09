import {
  AlgorithmInfo,
  AlgorithmType,
  Grid,
  GridNode,
  PathfindingResult,
} from "@/types";
import { bfs } from "./bfs";
import { dfs } from "./dfs";
import { dijkstra } from "./dijkstra";
import { astar } from "./astar";
import { wallFollower } from "./wallfollower";
import { bidirectional } from "./bidirectional";
import { swarm } from "./swarm";
import { thetaStar } from "./thetastar";
import { bellmanFord } from "./bellmanford";
import { idaStar } from "./idastar";
import { bestFirst } from "./bestfirst";
import { floodFill } from "./floodfill";

/**
 * Algorithm metadata for UI display
 */
export const ALGORITHMS: AlgorithmInfo[] = [
  {
    id: "bfs",
    name: "Breadth-First Search",
    description:
      "Explores level by level. Guarantees shortest path in unweighted graphs.",
  },
  {
    id: "dfs",
    name: "Depth-First Search",
    description:
      "Explores as deep as possible first. Does NOT guarantee shortest path.",
  },
  {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    description: "Classic shortest path algorithm. Guarantees shortest path.",
  },
  {
    id: "astar",
    name: "A* Search",
    description: "Uses Manhattan heuristic. Fastest for finding shortest path.",
  },
  {
    id: "wallfollower",
    name: "Wall Follower",
    description: "Right-hand rule maze solver. Follows walls to find a path.",
  },
  {
    id: "bidirectional",
    name: "Bidirectional BFS",
    description:
      "Searches from both ends simultaneously. Faster for long paths.",
  },
  {
    id: "swarm",
    name: "Swarm Algorithm",
    description:
      "Weighted A*/Greedy hybrid. Creates interesting swarm-like patterns.",
  },
  {
    id: "thetastar",
    name: "Theta*",
    description:
      "Any-angle pathfinding. Produces shorter, more realistic paths.",
  },
  {
    id: "bellmanford",
    name: "Bellman-Ford",
    description:
      "Handles negative weights. Slower but more versatile than Dijkstra.",
  },
  {
    id: "idastar",
    name: "IDA* (Iterative Deepening)",
    description: "Combines depth-first space efficiency with A* optimality.",
  },
  {
    id: "bestfirst",
    name: "Best-First Search",
    description: "Pure heuristic search. Expands most promising nodes first.",
  },
  {
    id: "floodfill",
    name: "Flood Fill",
    description:
      "Wavefront expansion. Floods outward like water filling a container.",
  },
];

/**
 * Run the selected pathfinding algorithm
 */
export function runAlgorithm(
  algorithm: AlgorithmType,
  grid: Grid,
  startNode: GridNode,
  endNode: GridNode
): PathfindingResult {
  switch (algorithm) {
    case "bfs":
      return bfs(grid, startNode, endNode);
    case "dfs":
      return dfs(grid, startNode, endNode);
    case "dijkstra":
      return dijkstra(grid, startNode, endNode);
    case "astar":
      return astar(grid, startNode, endNode);
    case "wallfollower":
      return wallFollower(grid, startNode, endNode);
    case "bidirectional":
      return bidirectional(grid, startNode, endNode);
    case "swarm":
      return swarm(grid, startNode, endNode);
    case "thetastar":
      return thetaStar(grid, startNode, endNode);
    case "bellmanford":
      return bellmanFord(grid, startNode, endNode);
    case "idastar":
      return idaStar(grid, startNode, endNode);
    case "bestfirst":
      return bestFirst(grid, startNode, endNode);
    case "floodfill":
      return floodFill(grid, startNode, endNode);
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
}

export {
  bfs,
  dfs,
  dijkstra,
  astar,
  wallFollower,
  bidirectional,
  swarm,
  thetaStar,
  bellmanFord,
  idaStar,
  bestFirst,
  floodFill,
};
