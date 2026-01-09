# Pathfinding Visualizer

An interactive web application for visualizing pathfinding algorithms. Watch how different algorithms explore a grid to find the shortest path between two points.

## Features

- **12 Pathfinding Algorithms**

  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
  - Dijkstra's Algorithm
  - A\* Search
  - Greedy Best-First Search
  - Bidirectional BFS
  - Swarm Algorithm
  - Theta\*
  - Bellman-Ford
  - IDA* (Iterative Deepening A*)
  - Best-First Search
  - Flood Fill

- **Interactive Grid**

  - Click to place start and end nodes
  - Drag to draw walls
  - Clear grid or walls independently

- **Visualization Controls**

  - Play/Pause animation
  - Watch algorithms explore in real-time
  - See the shortest path highlighted

- **Batch Compare Mode**
  - Compare all algorithms side-by-side
  - Same maze pattern across all grids
  - Generate random patterns
  - See visited nodes count and path length for each algorithm

## Pages

| Page     | Description                                              |
| -------- | -------------------------------------------------------- |
| `/`      | Main visualizer - interactive grid with single algorithm |
| `/batch` | Batch compare - all algorithms running simultaneously    |
| `/about` | Project information and algorithm descriptions           |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

### Main Visualizer

1. Click on the grid to place the **start node** (green)
2. Click again to place the **end node** (red)
3. Drag on empty cells to draw **walls** (dark)
4. Select an algorithm from the dropdown
5. Click **Visualize** to start
6. Use **Pause/Resume** to control the animation
7. Click **Clear Grid** to reset everything

### Batch Compare

1. A random maze is generated automatically
2. Click **New Pattern** to generate a different maze
3. Click **Visualize All** to run all algorithms at once
4. Compare visited nodes and path lengths

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Algorithms**: Implemented from scratch

## Project Structure

```
├── app/
│   ├── page.tsx          # Main visualizer
│   ├── batch/page.tsx    # Batch compare
│   └── about/page.tsx    # About page
├── components/
│   ├── Grid.tsx          # Grid component
│   ├── Node.tsx          # Individual cell
│   ├── Header.tsx        # Navigation & controls
│   ├── MiniGrid.tsx      # Small grid for batch mode
│   └── Legend.tsx        # Color legend
├── hooks/
│   ├── usePathfinding.ts       # Main visualizer state
│   └── useBatchVisualization.ts # Batch mode state
├── lib/
│   ├── algorithms/       # All pathfinding algorithms
│   ├── grid.ts           # Grid utilities
│   └── gridUtils.ts      # Additional grid helpers
└── types/
    └── index.ts          # TypeScript types
```

## Author

**Abdellah Anca**

## License

MIT
