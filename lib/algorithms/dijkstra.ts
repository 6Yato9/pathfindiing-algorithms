import { Grid, GridNode, PathfindingResult } from "@/types";
import { getNeighbors, reconstructPath } from "./utils";

/**
 * Dijkstra's Algorithm
 * Finds the shortest path in weighted graphs (all edges have weight 1 in our grid)
 * Uses a priority queue approach (simplified with array sorting)
 */
export function dijkstra(
  grid: Grid,
  startNode: GridNode,
  endNode: GridNode
): PathfindingResult {
  const visitedNodesInOrder: GridNode[] = [];

  // Initialize all distances to infinity
  for (const row of grid) {
    for (const node of row) {
      node.distance = Infinity;
      node.previousNode = null;
      node.isVisited = false;
    }
  }

  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length > 0) {
    // Sort by distance to get the node with smallest distance
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift()!;

    // Skip walls
    if (closestNode.state === "wall") continue;

    // If the closest node has infinite distance, we're trapped
    if (closestNode.distance === Infinity) {
      return {
        visitedNodesInOrder,
        shortestPath: [],
      };
    }

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // Found the end node
    if (closestNode.row === endNode.row && closestNode.col === endNode.col) {
      return {
        visitedNodesInOrder,
        shortestPath: reconstructPath(closestNode),
      };
    }

    // Update distances of neighbors
    const neighbors = getNeighbors(grid, closestNode);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && neighbor.state !== "wall") {
        const newDistance = closestNode.distance + 1;
        if (newDistance < neighbor.distance) {
          neighbor.distance = newDistance;
          neighbor.previousNode = closestNode;
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
 * Get all nodes from the grid as a flat array
 */
function getAllNodes(grid: Grid): GridNode[] {
  const nodes: GridNode[] = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

/**
 * Sort nodes by distance (ascending)
 */
function sortNodesByDistance(nodes: GridNode[]): void {
  nodes.sort((a, b) => a.distance - b.distance);
}
