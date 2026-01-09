import { Grid, GridNode, PathfindingResult } from "@/types";
import { getNeighbors } from "./utils";

/**
 * Bidirectional BFS Algorithm
 * Searches from both start and end simultaneously
 * Meets in the middle for faster pathfinding
 */
export function bidirectional(
  grid: Grid,
  startNode: GridNode,
  endNode: GridNode
): PathfindingResult {
  const visitedNodesInOrder: GridNode[] = [];

  // Two queues for bidirectional search
  const startQueue: GridNode[] = [startNode];
  const endQueue: GridNode[] = [endNode];

  // Track visited from each direction
  const visitedFromStart = new Map<string, GridNode>();
  const visitedFromEnd = new Map<string, GridNode>();

  // Track parent nodes for path reconstruction
  const parentFromStart = new Map<string, GridNode | null>();
  const parentFromEnd = new Map<string, GridNode | null>();

  const startKey = `${startNode.row}-${startNode.col}`;
  const endKey = `${endNode.row}-${endNode.col}`;

  visitedFromStart.set(startKey, startNode);
  visitedFromEnd.set(endKey, endNode);
  parentFromStart.set(startKey, null);
  parentFromEnd.set(endKey, null);

  startNode.isVisited = true;
  endNode.isVisited = true;

  while (startQueue.length > 0 && endQueue.length > 0) {
    // Expand from start
    const meetingNode = expandLevel(
      grid,
      startQueue,
      visitedFromStart,
      visitedFromEnd,
      parentFromStart,
      visitedNodesInOrder
    );

    if (meetingNode) {
      return {
        visitedNodesInOrder,
        shortestPath: reconstructBidirectionalPath(
          meetingNode,
          parentFromStart,
          parentFromEnd
        ),
      };
    }

    // Expand from end
    const meetingNode2 = expandLevel(
      grid,
      endQueue,
      visitedFromEnd,
      visitedFromStart,
      parentFromEnd,
      visitedNodesInOrder
    );

    if (meetingNode2) {
      return {
        visitedNodesInOrder,
        shortestPath: reconstructBidirectionalPath(
          meetingNode2,
          parentFromStart,
          parentFromEnd
        ),
      };
    }
  }

  return {
    visitedNodesInOrder,
    shortestPath: [],
  };
}

/**
 * Expand one level of BFS from one direction
 */
function expandLevel(
  grid: Grid,
  queue: GridNode[],
  visitedThis: Map<string, GridNode>,
  visitedOther: Map<string, GridNode>,
  parentMap: Map<string, GridNode | null>,
  visitedNodesInOrder: GridNode[]
): GridNode | null {
  const levelSize = queue.length;

  for (let i = 0; i < levelSize; i++) {
    const currentNode = queue.shift()!;

    if (currentNode.state === "wall") continue;

    visitedNodesInOrder.push(currentNode);

    const neighbors = getNeighbors(grid, currentNode);
    for (const neighbor of neighbors) {
      const key = `${neighbor.row}-${neighbor.col}`;

      if (neighbor.state === "wall") continue;

      // Check if we've met the other search
      if (visitedOther.has(key)) {
        parentMap.set(key, currentNode);
        return neighbor;
      }

      if (!visitedThis.has(key)) {
        visitedThis.set(key, neighbor);
        parentMap.set(key, currentNode);
        neighbor.isVisited = true;
        queue.push(neighbor);
      }
    }
  }

  return null;
}

/**
 * Reconstruct path from bidirectional search
 */
function reconstructBidirectionalPath(
  meetingNode: GridNode,
  parentFromStart: Map<string, GridNode | null>,
  parentFromEnd: Map<string, GridNode | null>
): GridNode[] {
  const path: GridNode[] = [];

  // Build path from start to meeting point
  const pathFromStart: GridNode[] = [];
  let current: GridNode | null = meetingNode;
  const meetingKey = `${meetingNode.row}-${meetingNode.col}`;

  // Go back from meeting point to start
  let key = meetingKey;
  while (parentFromStart.has(key) && parentFromStart.get(key) !== null) {
    const parent = parentFromStart.get(key)!;
    pathFromStart.unshift(parent);
    key = `${parent.row}-${parent.col}`;
  }

  // Add path from start
  path.push(...pathFromStart);
  path.push(meetingNode);

  // Build path from meeting point to end
  key = meetingKey;
  while (parentFromEnd.has(key) && parentFromEnd.get(key) !== null) {
    const parent = parentFromEnd.get(key)!;
    path.push(parent);
    key = `${parent.row}-${parent.col}`;
  }

  return path;
}
