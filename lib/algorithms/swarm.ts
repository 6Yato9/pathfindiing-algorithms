import { Grid, GridNode, PathfindingResult } from "@/types";
import { getNeighbors, reconstructPath } from "./utils";

/**
 * Swarm Algorithm
 * A weighted combination of A* and Greedy Best-First
 * Balances between exploration and exploitation
 * Creates a "swarm-like" expansion pattern
 */
export function swarm(
  grid: Grid,
  startNode: GridNode,
  endNode: GridNode
): PathfindingResult {
  const visitedNodesInOrder: GridNode[] = [];

  // Initialize all nodes
  for (const row of grid) {
    for (const node of row) {
      node.distance = Infinity;
      node.heuristic = Infinity;
      node.totalCost = Infinity;
      node.previousNode = null;
      node.isVisited = false;
    }
  }

  // Initialize start node
  startNode.distance = 0;
  startNode.heuristic = manhattanDistance(startNode, endNode);
  // Swarm uses a weighted combination: more weight on heuristic for "swarming" effect
  startNode.totalCost = calculateSwarmCost(startNode, endNode);

  const openSet: GridNode[] = [startNode];
  const closedSet = new Set<string>();

  while (openSet.length > 0) {
    // Sort by swarm cost
    openSet.sort((a, b) => a.totalCost - b.totalCost);
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

    // Explore neighbors with swarm behavior
    const neighbors = getNeighbors(grid, currentNode);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row}-${neighbor.col}`;

      if (closedSet.has(neighborKey) || neighbor.state === "wall") continue;

      const tentativeDistance = currentNode.distance + 1;

      if (tentativeDistance < neighbor.distance) {
        neighbor.previousNode = currentNode;
        neighbor.distance = tentativeDistance;
        neighbor.heuristic = manhattanDistance(neighbor, endNode);
        neighbor.totalCost = calculateSwarmCost(neighbor, endNode);

        if (
          !openSet.some((n) => n.row === neighbor.row && n.col === neighbor.col)
        ) {
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

/**
 * Calculate swarm cost - weighted combination that creates interesting patterns
 * Uses distance^1.5 + heuristic^2 for a more exploratory behavior
 */
function calculateSwarmCost(node: GridNode, endNode: GridNode): number {
  const distance = node.distance;
  const heuristic = manhattanDistance(node, endNode);

  // Weighted formula that balances exploration and goal-seeking
  // Higher heuristic weight creates more "swarming" toward the goal
  return Math.pow(distance, 1.3) + Math.pow(heuristic, 1.8);
}

/**
 * Manhattan distance heuristic
 */
function manhattanDistance(nodeA: GridNode, nodeB: GridNode): number {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}
