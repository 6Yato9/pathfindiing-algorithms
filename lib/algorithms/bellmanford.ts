import { Grid, GridNode, PathfindingResult } from "@/types";
import { getNeighbors, reconstructPath } from "./utils";

/**
 * Bellman-Ford Algorithm
 * A single-source shortest path algorithm that can handle negative edge weights.
 * It relaxes all edges V-1 times where V is the number of vertices.
 * Slower than Dijkstra but more versatile.
 */
export function bellmanFord(
  grid: Grid,
  startNode: GridNode,
  endNode: GridNode
): PathfindingResult {
  const visitedNodesInOrder: GridNode[] = [];
  const rows = grid.length;
  const cols = grid[0].length;

  // Initialize all distances to infinity
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      grid[row][col].distance = Infinity;
      grid[row][col].previousNode = null;
    }
  }

  startNode.distance = 0;
  visitedNodesInOrder.push(startNode);

  // Get all non-wall nodes
  const nodes: GridNode[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col].state !== "wall") {
        nodes.push(grid[row][col]);
      }
    }
  }

  // Relax all edges V-1 times (or until no changes)
  const maxIterations = Math.min(nodes.length - 1, 500); // Cap iterations for performance

  for (let i = 0; i < maxIterations; i++) {
    let anyRelaxed = false;

    for (const node of nodes) {
      if (node.distance === Infinity) continue;

      const neighbors = getNeighbors(grid, node);

      for (const neighbor of neighbors) {
        if (neighbor.state === "wall") continue;

        const newDistance = node.distance + 1;

        if (newDistance < neighbor.distance) {
          neighbor.distance = newDistance;
          neighbor.previousNode = node;
          anyRelaxed = true;

          // Track visited nodes for visualization
          if (!visitedNodesInOrder.includes(neighbor)) {
            visitedNodesInOrder.push(neighbor);
          }
        }
      }
    }

    // Early termination if no relaxation occurred
    if (!anyRelaxed) {
      break;
    }
  }

  // Check if end node is reachable
  if (endNode.distance === Infinity) {
    return {
      visitedNodesInOrder,
      shortestPath: [],
    };
  }

  return {
    visitedNodesInOrder,
    shortestPath: reconstructPath(endNode),
  };
}
