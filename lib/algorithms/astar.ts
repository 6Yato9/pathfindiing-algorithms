import { Grid, GridNode, PathfindingResult } from "@/types";
import { getNeighbors, reconstructPath } from "./utils";

/**
 * A* Search Algorithm
 * Uses heuristics to find the shortest path more efficiently than Dijkstra
 * f(n) = g(n) + h(n) where g is distance from start, h is heuristic to end
 */
export function astar(
  grid: Grid,
  startNode: GridNode,
  endNode: GridNode
): PathfindingResult {
  const visitedNodesInOrder: GridNode[] = [];

  // Initialize all nodes
  for (const row of grid) {
    for (const node of row) {
      node.distance = Infinity; // g-score
      node.heuristic = Infinity; // h-score
      node.totalCost = Infinity; // f-score
      node.previousNode = null;
      node.isVisited = false;
    }
  }

  // Initialize start node
  startNode.distance = 0;
  startNode.heuristic = manhattanDistance(startNode, endNode);
  startNode.totalCost = startNode.heuristic;

  const openSet: GridNode[] = [startNode];
  const closedSet = new Set<string>();

  while (openSet.length > 0) {
    // Sort by f-score (totalCost), then by h-score for tie-breaking
    sortNodesByTotalCost(openSet);
    const currentNode = openSet.shift()!;

    const key = `${currentNode.row}-${currentNode.col}`;

    // Skip if already processed
    if (closedSet.has(key)) continue;

    // Skip walls
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

      const tentativeGScore = currentNode.distance + 1;

      if (tentativeGScore < neighbor.distance) {
        // This path is better
        neighbor.previousNode = currentNode;
        neighbor.distance = tentativeGScore;
        neighbor.heuristic = manhattanDistance(neighbor, endNode);
        neighbor.totalCost = neighbor.distance + neighbor.heuristic;

        // Add to open set if not already there
        if (
          !openSet.some((n) => n.row === neighbor.row && n.col === neighbor.col)
        ) {
          openSet.push(neighbor);
        }
      }
    }
  }

  // No path found
  return {
    visitedNodesInOrder,
    shortestPath: [],
  };
}

/**
 * Manhattan distance heuristic
 * Sum of absolute differences in x and y coordinates
 */
function manhattanDistance(nodeA: GridNode, nodeB: GridNode): number {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

/**
 * Sort nodes by total cost (f-score) ascending
 */
function sortNodesByTotalCost(nodes: GridNode[]): void {
  nodes.sort((a, b) => {
    if (a.totalCost === b.totalCost) {
      return a.heuristic - b.heuristic;
    }
    return a.totalCost - b.totalCost;
  });
}
