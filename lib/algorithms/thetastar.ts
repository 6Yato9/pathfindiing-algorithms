import { Grid, GridNode, PathfindingResult } from "@/types";
import { getNeighbors, reconstructPath } from "./utils";

/**
 * Theta* Algorithm
 * An any-angle pathfinding algorithm that allows paths to go in any direction,
 * not just along grid edges. It's an extension of A* that produces shorter,
 * more realistic paths by checking line-of-sight between nodes.
 */
export function thetaStar(
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
    // Sort by totalCost (f = g + h)
    openSet.sort((a, b) => a.totalCost - b.totalCost);
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

    // Get neighbors
    const neighbors = getNeighbors(grid, current);

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row}-${neighbor.col}`;
      if (closedSet.has(neighborKey) || neighbor.state === "wall") {
        continue;
      }

      // Theta* key insight: check if we can go directly from parent to neighbor
      const parent = current.previousNode;

      if (parent && lineOfSight(grid, parent, neighbor)) {
        // Path 2: go directly from parent to neighbor
        const newG = parent.distance + euclideanDistance(parent, neighbor);

        if (newG < neighbor.distance) {
          neighbor.previousNode = parent;
          neighbor.distance = newG;
          neighbor.heuristic = heuristic(neighbor, endNode);
          neighbor.totalCost = neighbor.distance + neighbor.heuristic;

          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      } else {
        // Path 1: standard A* update
        const newG = current.distance + 1; // Use 1 for grid distance

        if (newG < neighbor.distance) {
          neighbor.previousNode = current;
          neighbor.distance = newG;
          neighbor.heuristic = heuristic(neighbor, endNode);
          neighbor.totalCost = neighbor.distance + neighbor.heuristic;

          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
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
  // Manhattan distance works well for grid-based movement
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function euclideanDistance(a: GridNode, b: GridNode): number {
  return Math.sqrt(Math.pow(a.row - b.row, 2) + Math.pow(a.col - b.col, 2));
}

/**
 * Check if there's a clear line of sight between two nodes using Bresenham's line algorithm
 */
function lineOfSight(grid: Grid, nodeA: GridNode, nodeB: GridNode): boolean {
  const rows = grid.length;
  const cols = grid[0].length;

  let x0 = nodeA.col;
  let y0 = nodeA.row;
  const x1 = nodeB.col;
  const y1 = nodeB.row;

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    // Check if current cell is walkable
    if (y0 < 0 || y0 >= rows || x0 < 0 || x0 >= cols) {
      return false;
    }
    if (grid[y0][x0].state === "wall") {
      return false;
    }

    if (x0 === x1 && y0 === y1) {
      break;
    }

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }

  return true;
}
