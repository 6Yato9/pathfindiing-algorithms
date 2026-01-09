import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  Pathfinding Visualizer
                </h1>
              </Link>
              <nav className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Visualizer
                </Link>
                <Link
                  href="/batch"
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Batch Compare
                </Link>
                <Link
                  href="/about"
                  className="text-sm font-medium text-blue-600 font-bold underline underline-offset-4"
                >
                  About
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              About This Project
            </h1>
            <p className="text-lg text-slate-600">
              An interactive visualization tool for understanding pathfinding
              algorithms
            </p>
          </div>

          {/* Project Description */}
          <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              What is Pathfinding Visualizer?
            </h2>
            <p className="text-slate-600 mb-4">
              Pathfinding Visualizer is an interactive web application that
              helps you understand how different pathfinding algorithms work. By
              visualizing the step-by-step process of finding the shortest path
              between two points, you can gain a deeper understanding of these
              fundamental computer science algorithms.
            </p>
            <p className="text-slate-600">
              Whether you&apos;re a student learning about graph algorithms, a
              developer brushing up on your fundamentals, or simply curious
              about how GPS navigation and game AI work under the hood, this
              tool provides an intuitive way to explore these concepts.
            </p>
          </section>

          {/* Algorithms Section */}
          <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Implemented Algorithms
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  Breadth-First Search (BFS)
                </h3>
                <p className="text-slate-600 mt-1">
                  Explores all neighbors at the current depth before moving to
                  nodes at the next depth level. Guarantees the shortest path in
                  unweighted graphs.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  Depth-First Search (DFS)
                </h3>
                <p className="text-slate-600 mt-1">
                  Explores as far as possible along each branch before
                  backtracking. Does not guarantee the shortest path but uses
                  less memory than BFS.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  Dijkstra&apos;s Algorithm
                </h3>
                <p className="text-slate-600 mt-1">
                  The classic shortest path algorithm that works with weighted
                  graphs. Always finds the optimal path by exploring nodes in
                  order of their distance from the start.
                </p>
              </div>

              <div className="border-l-4 border-cyan-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  A* Search
                </h3>
                <p className="text-slate-600 mt-1">
                  An informed search algorithm that uses heuristics (Manhattan
                  distance) to guide the search toward the goal. Often faster
                  than Dijkstra&apos;s while still guaranteeing the shortest
                  path.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  Greedy Best-First Search
                </h3>
                <p className="text-slate-600 mt-1">
                  Uses only the heuristic (estimated distance to goal) to make
                  decisions. Very fast but does NOT guarantee the shortest path.
                  Great for seeing how heuristics alone can guide search.
                </p>
              </div>

              <div className="border-l-4 border-pink-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  Bidirectional BFS
                </h3>
                <p className="text-slate-600 mt-1">
                  Searches from both the start and end nodes simultaneously,
                  meeting in the middle. Can be significantly faster for long
                  paths as it reduces the search space exponentially.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  Swarm Algorithm
                </h3>
                <p className="text-slate-600 mt-1">
                  A weighted hybrid of A* and Greedy Best-First that creates
                  interesting swarm-like expansion patterns. Balances between
                  exploration and exploitation for visually appealing results.
                </p>
              </div>
            </div>
          </section>

          {/* How to Use Section */}
          <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              How to Use
            </h2>

            <ol className="space-y-4 text-slate-600">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                  1
                </span>
                <span className="pt-1">
                  <strong>Place the Start Node:</strong> Click on any cell to
                  place the green start node.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                  2
                </span>
                <span className="pt-1">
                  <strong>Place the End Node:</strong> Click on another cell to
                  place the red end node.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                  3
                </span>
                <span className="pt-1">
                  <strong>Draw Walls:</strong> Click and drag to create walls
                  that the algorithm must navigate around.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                  4
                </span>
                <span className="pt-1">
                  <strong>Select an Algorithm:</strong> Choose from BFS, DFS,
                  Dijkstra&apos;s, or A* from the dropdown.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                  5
                </span>
                <span className="pt-1">
                  <strong>Visualize:</strong> Click the Visualize button to
                  watch the algorithm find the path!
                </span>
              </li>
            </ol>
          </section>

          {/* Tech Stack Section */}
          <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Tech Stack
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl mb-2">⚛️</div>
                <div className="font-medium text-slate-800">React</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl mb-2">▲</div>
                <div className="font-medium text-slate-800">Next.js</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl mb-2">📘</div>
                <div className="font-medium text-slate-800">TypeScript</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl mb-2">🎨</div>
                <div className="font-medium text-slate-800">Tailwind CSS</div>
              </div>
            </div>
          </section>

          {/* Author Section */}
          <section className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">About the Author</h2>
            <p className="text-blue-100 mb-4">
              Hi! I&apos;m <strong className="text-white">Abdellah Anca</strong>
              , the creator of this project. I built this pathfinding visualizer
              to help others understand these fascinating algorithms in an
              interactive and visual way.
            </p>
            <p className="text-blue-100">
              This project demonstrates my passion for algorithms, data
              structures, and creating educational tools that make complex
              concepts accessible to everyone.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-slate-500 py-4 border-t border-slate-200">
        <p>Built by Abdellah Anca with Next.js, TypeScript, and Tailwind CSS</p>
      </footer>
    </div>
  );
}
