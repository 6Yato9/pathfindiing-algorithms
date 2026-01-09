import { Grid, GridNode, NodeState } from "@/types";

/**
 * Create a new grid with the specified dimensions
 */
export function createGrid(rows: number, cols: number): Grid {
  const grid: Grid = [];

  for (let row = 0; row < rows; row++) {
    const currentRow: GridNode[] = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }

  return grid;
}

/**
 * Create a single node with default values
 */
export function createNode(
  row: number,
  col: number,
  state: NodeState = "empty"
): GridNode {
  return {
    row,
    col,
    state,
    distance: Infinity,
    heuristic: 0,
    totalCost: Infinity,
    previousNode: null,
    isVisited: false,
  };
}

/**
 * Deep clone the grid to avoid mutation during algorithm execution
 */
export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) =>
    row.map((node) => ({
      ...node,
      previousNode: null,
      isVisited: false,
      distance: Infinity,
      heuristic: 0,
      totalCost: Infinity,
    }))
  );
}

/**
 * Reset the grid visualization (visited and path states) while keeping walls
 */
export function resetGridVisualization(grid: Grid): Grid {
  return grid.map((row) =>
    row.map((node) => ({
      ...node,
      state:
        node.state === "visited" || node.state === "path"
          ? "empty"
          : node.state,
      previousNode: null,
      isVisited: false,
      distance: Infinity,
      heuristic: 0,
      totalCost: Infinity,
    }))
  );
}

/**
 * Clear all walls from the grid
 */
export function clearWalls(grid: Grid): Grid {
  return grid.map((row) =>
    row.map((node) => ({
      ...node,
      state: node.state === "wall" ? "empty" : node.state,
    }))
  );
}

/**
 * Get the node at a specific position
 */
export function getNode(grid: Grid, row: number, col: number): GridNode | null {
  if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
    return grid[row][col];
  }
  return null;
}

/**
 * Update a node's state in the grid (immutably)
 */
export function updateNodeState(
  grid: Grid,
  row: number,
  col: number,
  state: NodeState
): Grid {
  return grid.map((gridRow, rowIndex) =>
    gridRow.map((node, colIndex) => {
      if (rowIndex === row && colIndex === col) {
        return { ...node, state };
      }
      return node;
    })
  );
}
