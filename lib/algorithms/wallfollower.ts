import { Grid, GridNode, PathfindingResult } from "@/types";
import { reconstructPath } from "./utils";

/**
 * Wall Follower Algorithm (Right-Hand Rule)
 * A maze-solving algorithm that follows walls by keeping one hand (right)
 * on the wall. Works well for simply-connected mazes but may not find
 * the shortest path.
 */
export function wallFollower(
  grid: Grid,
  startNode: GridNode,
  endNode: GridNode
): PathfindingResult {
  const visitedNodesInOrder: GridNode[] = [];
  const visited = new Set<string>();
  const rows = grid.length;
  const cols = grid[0].length;

  // Directions: 0=up, 1=right, 2=down, 3=left
  const directions = [
    { dr: -1, dc: 0 }, // up
    { dr: 0, dc: 1 }, // right
    { dr: 1, dc: 0 }, // down
    { dr: 0, dc: -1 }, // left
  ];

  let current = startNode;
  let facing = 1; // Start facing right

  current.distance = 0;
  current.previousNode = null;

  const maxSteps = rows * cols * 4; // Prevent infinite loops
  let steps = 0;

  while (steps < maxSteps) {
    steps++;
    const currentKey = `${current.row}-${current.col}`;

    if (!visited.has(currentKey)) {
      visited.add(currentKey);
      visitedNodesInOrder.push(current);
    }

    // Found the end
    if (current.row === endNode.row && current.col === endNode.col) {
      return {
        visitedNodesInOrder,
        shortestPath: reconstructPath(current),
      };
    }

    // Try to turn right first (right-hand rule)
    let moved = false;

    for (let turn = 0; turn < 4; turn++) {
      // Try: right, straight, left, back
      const tryDir = (facing + 1 - turn + 4) % 4;
      const dir = directions[tryDir];
      const newRow = current.row + dir.dr;
      const newCol = current.col + dir.dc;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        grid[newRow][newCol].state !== "wall"
      ) {
        const next = grid[newRow][newCol];

        // Only update previousNode if this is a new path or shorter
        if (
          next.previousNode === null ||
          next.distance > current.distance + 1
        ) {
          next.previousNode = current;
          next.distance = current.distance + 1;
        }

        current = next;
        facing = tryDir;
        moved = true;
        break;
      }
    }

    // If we couldn't move anywhere, we're stuck
    if (!moved) {
      break;
    }
  }

  // Try to find path to end even if wall follower didn't reach it
  if (endNode.previousNode !== null) {
    return {
      visitedNodesInOrder,
      shortestPath: reconstructPath(endNode),
    };
  }

  return {
    visitedNodesInOrder,
    shortestPath: [],
  };
}
