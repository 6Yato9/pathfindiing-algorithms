import { Grid, GridNode, PathfindingResult } from "@/types";
import { getNeighbors, reconstructPath } from "./utils";

/**
 * Depth-First Search Algorithm
 * Explores as far as possible along each branch before backtracking
 * Note: DFS does NOT guarantee the shortest path
 */
export function dfs(
  grid: Grid,
  startNode: GridNode,
  endNode: GridNode
): PathfindingResult {
  const visitedNodesInOrder: GridNode[] = [];
  const visited = new Set<string>();

  startNode.previousNode = null;

  const found = dfsRecursive(
    grid,
    startNode,
    endNode,
    visited,
    visitedNodesInOrder
  );

  return {
    visitedNodesInOrder,
    shortestPath: found ? reconstructPath(endNode) : [],
  };
}

/**
 * Recursive helper for DFS
 */
function dfsRecursive(
  grid: Grid,
  currentNode: GridNode,
  endNode: GridNode,
  visited: Set<string>,
  visitedNodesInOrder: GridNode[]
): boolean {
  const key = `${currentNode.row}-${currentNode.col}`;

  // Skip if already visited or is a wall
  if (visited.has(key) || currentNode.state === "wall") {
    return false;
  }

  // Mark as visited
  visited.add(key);
  currentNode.isVisited = true;
  visitedNodesInOrder.push(currentNode);

  // Found the end node
  if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
    return true;
  }

  // Explore neighbors
  const neighbors = getNeighbors(grid, currentNode);
  for (const neighbor of neighbors) {
    if (
      !visited.has(`${neighbor.row}-${neighbor.col}`) &&
      neighbor.state !== "wall"
    ) {
      neighbor.previousNode = currentNode;
      if (dfsRecursive(grid, neighbor, endNode, visited, visitedNodesInOrder)) {
        return true;
      }
    }
  }

  return false;
}
