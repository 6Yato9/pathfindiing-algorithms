import { Grid, GridNode, PathfindingResult } from "@/types";
import { getNeighbors, reconstructPath } from "./utils";

/**
 * Greedy Best-First Search Algorithm
 * Uses only the heuristic (distance to goal) to guide the search
 * Fast but does NOT guarantee the shortest path
 */
export function greedy(
  grid: Grid,
  startNode: GridNode,
  endNode: GridNode
): PathfindingResult {
  const visitedNodesInOrder: GridNode[] = [];

  // Initialize all nodes
  for (const row of grid) {
    for (const node of row) {
      node.heuristic = Infinity;
      node.previousNode = null;
      node.isVisited = false;
    }
  }

  // Initialize start node with heuristic
  startNode.heuristic = manhattanDistance(startNode, endNode);

  const openSet: GridNode[] = [startNode];
  const closedSet = new Set<string>();

  while (openSet.length > 0) {
    // Sort by heuristic only (greedy approach)
    openSet.sort((a, b) => a.heuristic - b.heuristic);
    const currentNode = openSet.shift()!;

    const key = `${currentNode.row}-${currentNode.col}`;

    if (closedSet.has(key)) continue;
    if (currentNode.state === "wall") continue;

    closedSet.add(key);
    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    // Found the end node
    if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
      return {
        visitedNodesInOrder,
        shortestPath: reconstructPath(currentNode),
      };
    }

    // Explore neighbors
    const neighbors = getNeighbors(grid, currentNode);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row}-${neighbor.col}`;

      if (closedSet.has(neighborKey) || neighbor.state === "wall") continue;

      if (
        !openSet.some((n) => n.row === neighbor.row && n.col === neighbor.col)
      ) {
        neighbor.heuristic = manhattanDistance(neighbor, endNode);
        neighbor.previousNode = currentNode;
        openSet.push(neighbor);
      }
    }
  }

  return {
    visitedNodesInOrder,
    shortestPath: [],
  };
}

/**
 * Manhattan distance heuristic
 */
function manhattanDistance(nodeA: GridNode, nodeB: GridNode): number {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}
