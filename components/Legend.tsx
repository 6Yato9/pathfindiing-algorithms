"use client";

/**
 * Legend component showing what each cell color means
 */
export function Legend() {
  const items = [
    { color: "bg-green-500", label: "Start Node" },
    { color: "bg-red-500", label: "End Node" },
    { color: "bg-slate-800", label: "Wall" },
    { color: "bg-cyan-400", label: "Visited" },
    { color: "bg-yellow-400", label: "Shortest Path" },
    { color: "bg-white border border-slate-300", label: "Empty" },
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded ${item.color}`} />
          <span className="text-sm text-slate-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
