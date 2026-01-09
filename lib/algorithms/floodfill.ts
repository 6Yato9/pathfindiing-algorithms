import { Grid, GridNode, PathfindingResult } from "@/types";
import { getNeighbors, reconstructPath } from "./utils";

/**
 * Flood Fill Pathfinding
 * A wavefront expansion algorithm that floods outward from the start node
 * in all directions simultaneously. Similar to BFS but with a different
 * visual pattern - expands in waves like water filling a container.
 */
export function floodFill(
  grid: Grid,
  startNode: GridNode,
  endNode: GridNode
): PathfindingResult {
  const visitedNodesInOrder: GridNode[] = [];
  const rows = grid.length;
  const cols = grid[0].length;

  // Initialize distances
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      grid[row][col].distance = Infinity;
      grid[row][col].previousNode = null;
    }
  }

  startNode.distance = 0;

  // Use a queue for wavefront expansion
  let currentWave: GridNode[] = [startNode];
  let nextWave: GridNode[] = [];
  const visited = new Set<string>();
  visited.add(`${startNode.row}-${startNode.col}`);

  while (currentWave.length > 0) {
    // Process all nodes in current wave
    for (const current of currentWave) {
      if (current.state === "wall") continue;

      visitedNodesInOrder.push(current);

      // Found the end
      if (current.row === endNode.row && current.col === endNode.col) {
        return {
          visitedNodesInOrder,
          shortestPath: reconstructPath(current),
        };
      }

      // Add neighbors to next wave
      const neighbors = getNeighbors(grid, current);

      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row}-${neighbor.col}`;

        if (visited.has(neighborKey) || neighbor.state === "wall") {
          continue;
        }

        visited.add(neighborKey);
        neighbor.distance = current.distance + 1;
        neighbor.previousNode = current;
        nextWave.push(neighbor);
      }
    }

    // Move to next wave
    currentWave = nextWave;
    nextWave = [];
  }

  return {
    visitedNodesInOrder,
    shortestPath: [],
  };
}
