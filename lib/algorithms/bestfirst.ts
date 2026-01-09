import { Grid, GridNode, PathfindingResult } from "@/types";
import { getNeighbors, reconstructPath } from "./utils";

/**
 * Best-First Search (Pure Heuristic)
 * A search algorithm that expands the most promising node based purely on
 * heuristic evaluation. Unlike Greedy Best-First, this uses a different
 * tie-breaking strategy and explores more systematically.
 */
export function bestFirst(
  grid: Grid,
  startNode: GridNode,
  endNode: GridNode
): PathfindingResult {
  const visitedNodesInOrder: GridNode[] = [];
  const openSet: GridNode[] = [startNode];
  const closedSet = new Set<string>();

  startNode.distance = 0;
  startNode.heuristic = heuristic(startNode, endNode);
  startNode.totalCost = startNode.heuristic;
  startNode.previousNode = null;

  while (openSet.length > 0) {
    // Sort by heuristic only (pure best-first)
    openSet.sort((a, b) => {
      // Primary: heuristic (distance to goal)
      if (a.heuristic !== b.heuristic) {
        return a.heuristic - b.heuristic;
      }
      // Secondary: distance from start (prefer shorter paths)
      return a.distance - b.distance;
    });

    const current = openSet.shift()!;
    const currentKey = `${current.row}-${current.col}`;

    if (closedSet.has(currentKey)) continue;
    closedSet.add(currentKey);

    if (current.state === "wall") continue;

    visitedNodesInOrder.push(current);

    // Found the end
    if (current.row === endNode.row && current.col === endNode.col) {
      return {
        visitedNodesInOrder,
        shortestPath: reconstructPath(current),
      };
    }

    const neighbors = getNeighbors(grid, current);

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row}-${neighbor.col}`;
      if (closedSet.has(neighborKey) || neighbor.state === "wall") {
        continue;
      }

      const tentativeG = current.distance + 1;

      if (tentativeG < neighbor.distance) {
        neighbor.previousNode = current;
        neighbor.distance = tentativeG;
        neighbor.heuristic = heuristic(neighbor, endNode);
        neighbor.totalCost = neighbor.heuristic; // Pure heuristic for sorting

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return {
    visitedNodesInOrder,
    shortestPath: [],
  };
}

function heuristic(a: GridNode, b: GridNode): number {
  // Euclidean distance for smoother expansion
  return Math.sqrt(Math.pow(a.row - b.row, 2) + Math.pow(a.col - b.col, 2));
}
