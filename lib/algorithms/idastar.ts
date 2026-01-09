import { Grid, GridNode, PathfindingResult } from "@/types";
import { getNeighbors, reconstructPath } from "./utils";

/**
 * IDA* (Iterative Deepening A*) Algorithm
 * Combines the space efficiency of depth-first search with the optimality of A*.
 * Uses iterative deepening with a heuristic-based threshold.
 */
export function idaStar(
  grid: Grid,
  startNode: GridNode,
  endNode: GridNode
): PathfindingResult {
  const visitedNodesInOrder: GridNode[] = [];

  startNode.distance = 0;
  startNode.heuristic = heuristic(startNode, endNode);
  startNode.totalCost = startNode.heuristic;
  startNode.previousNode = null;

  let threshold = startNode.heuristic;
  const maxIterations = 1000;
  let iterations = 0;

  while (iterations < maxIterations) {
    iterations++;
    const visited = new Set<string>();
    const result = search(
      grid,
      startNode,
      endNode,
      0,
      threshold,
      visited,
      visitedNodesInOrder
    );

    if (result.found) {
      return {
        visitedNodesInOrder,
        shortestPath: reconstructPath(result.node!),
      };
    }

    if (result.minThreshold === Infinity) {
      // No path exists
      return {
        visitedNodesInOrder,
        shortestPath: [],
      };
    }

    threshold = result.minThreshold;
  }

  return {
    visitedNodesInOrder,
    shortestPath: [],
  };
}

interface SearchResult {
  found: boolean;
  node: GridNode | null;
  minThreshold: number;
}

function search(
  grid: Grid,
  node: GridNode,
  endNode: GridNode,
  g: number,
  threshold: number,
  visited: Set<string>,
  visitedNodesInOrder: GridNode[]
): SearchResult {
  const f = g + heuristic(node, endNode);

  if (f > threshold) {
    return { found: false, node: null, minThreshold: f };
  }

  const nodeKey = `${node.row}-${node.col}`;
  if (visited.has(nodeKey)) {
    return { found: false, node: null, minThreshold: Infinity };
  }

  visited.add(nodeKey);

  if (node.state !== "wall" && !visitedNodesInOrder.includes(node)) {
    visitedNodesInOrder.push(node);
  }

  if (node.row === endNode.row && node.col === endNode.col) {
    return { found: true, node, minThreshold: f };
  }

  if (node.state === "wall") {
    return { found: false, node: null, minThreshold: Infinity };
  }

  let minThreshold = Infinity;
  const neighbors = getNeighbors(grid, node);

  for (const neighbor of neighbors) {
    if (neighbor.state === "wall") continue;

    const neighborKey = `${neighbor.row}-${neighbor.col}`;
    if (visited.has(neighborKey)) continue;

    neighbor.previousNode = node;
    neighbor.distance = g + 1;

    const result = search(
      grid,
      neighbor,
      endNode,
      g + 1,
      threshold,
      visited,
      visitedNodesInOrder
    );

    if (result.found) {
      return result;
    }

    if (result.minThreshold < minThreshold) {
      minThreshold = result.minThreshold;
    }
  }

  return { found: false, node: null, minThreshold };
}

function heuristic(a: GridNode, b: GridNode): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}
