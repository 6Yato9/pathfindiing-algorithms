import { Grid, GridNode } from "@/types";

/**
 * Get valid neighboring nodes (up, down, left, right)
 */
export function getNeighbors(grid: Grid, node: GridNode): GridNode[] {
  const neighbors: GridNode[] = [];
  const { row, col } = node;
  const rows = grid.length;
  const cols = grid[0].length;

  // Up
  if (row > 0) {
    neighbors.push(grid[row - 1][col]);
  }
  // Right
  if (col < cols - 1) {
    neighbors.push(grid[row][col + 1]);
  }
  // Down
  if (row < rows - 1) {
    neighbors.push(grid[row + 1][col]);
  }
  // Left
  if (col > 0) {
    neighbors.push(grid[row][col - 1]);
  }

  return neighbors;
}

/**
 * Reconstruct the path from end node to start by following previousNode pointers
 */
export function reconstructPath(endNode: GridNode): GridNode[] {
  const path: GridNode[] = [];
  let currentNode: GridNode | null = endNode;

  while (currentNode !== null) {
    path.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return path;
}
