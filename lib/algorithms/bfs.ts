import { Grid, GridNode, PathfindingResult } from "@/types";
import { getNeighbors, reconstructPath } from "./utils";

/**
 * Breadth-First Search Algorithm
 * Explores nodes level by level, guaranteeing the shortest path in unweighted graphs
 */
export function bfs(
  grid: Grid,
  startNode: GridNode,
  endNode: GridNode
): PathfindingResult {
  const visitedNodesInOrder: GridNode[] = [];
  const queue: GridNode[] = [startNode];

  // Create a visited set to track visited nodes
  const visited = new Set<string>();
  visited.add(`${startNode.row}-${startNode.col}`);

  startNode.isVisited = true;
  startNode.previousNode = null;

  while (queue.length > 0) {
    const currentNode = queue.shift()!;

    // Skip walls
    if (currentNode.state === "wall") continue;

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
      const key = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(key) && neighbor.state !== "wall") {
        visited.add(key);
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode;
        queue.push(neighbor);
      }
    }
  }

  // No path found
  return {
    visitedNodesInOrder,
    shortestPath: [],
  };
}
