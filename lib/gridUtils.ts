import { Grid, GridNode } from "@/types";

/**
 * Create a new grid with the specified dimensions
 */
export function createEmptyGrid(rows: number, cols: number): Grid {
  const grid: Grid = [];

  for (let row = 0; row < rows; row++) {
    const currentRow: GridNode[] = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push({
        row,
        col,
        state: "empty",
        distance: Infinity,
        heuristic: 0,
        totalCost: Infinity,
        previousNode: null,
        isVisited: false,
      });
    }
    grid.push(currentRow);
  }

  return grid;
}

/**
 * Generate a random pattern with start, end, and walls
 */
export function generateRandomPattern(
  rows: number,
  cols: number,
  wallDensity: number = 0.25
): {
  grid: Grid;
  startPos: { row: number; col: number };
  endPos: { row: number; col: number };
} {
  const grid = createEmptyGrid(rows, cols);

  // Place start node in the left portion
  const startRow = Math.floor(Math.random() * rows);
  const startCol = Math.floor(Math.random() * Math.floor(cols / 4));
  grid[startRow][startCol].state = "start";

  // Place end node in the right portion
  const endRow = Math.floor(Math.random() * rows);
  const endCol = cols - 1 - Math.floor(Math.random() * Math.floor(cols / 4));
  grid[endRow][endCol].state = "end";

  // Add random walls
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col].state === "empty" && Math.random() < wallDensity) {
        grid[row][col].state = "wall";
      }
    }
  }

  return {
    grid,
    startPos: { row: startRow, col: startCol },
    endPos: { row: endRow, col: endCol },
  };
}

/**
 * Clone a grid pattern (walls, start, end) to a new grid
 */
export function cloneGridPattern(sourceGrid: Grid): Grid {
  return sourceGrid.map((row) =>
    row.map((node) => ({
      row: node.row,
      col: node.col,
      state:
        node.state === "visited" || node.state === "path"
          ? "empty"
          : node.state,
      distance: Infinity,
      heuristic: 0,
      totalCost: Infinity,
      previousNode: null,
      isVisited: false,
    }))
  );
}

/**
 * Reset grid visualization (keep walls, start, end)
 */
export function resetVisualization(grid: Grid): Grid {
  return grid.map((row) =>
    row.map((node) => ({
      ...node,
      state:
        node.state === "visited" || node.state === "path"
          ? "empty"
          : node.state,
      distance: Infinity,
      heuristic: 0,
      totalCost: Infinity,
      previousNode: null,
      isVisited: false,
    }))
  );
}
