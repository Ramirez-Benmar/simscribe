import { useState, useMemo } from "react";
import ProjectCard from "../components/ProjectCard";

const MOCK_PROJECTS = [
  { name: "Bloomberg 20250618 0930", duration: "05:09", updated: "today" },
  { name: "Earnings Call – Q1", duration: "42:17", updated: "2 days ago" },
  { name: "Legal Hearing 001", duration: "27:03", updated: "1 week ago" },
];

export default function LandingPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return MOCK_PROJECTS.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Your audio projects</h1>
      <p className="text-sm text-slate-400 mb-6">
        Search and open recordings you want to transcribe or edit.
      </p>

      <div className="mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search audio files…"
          className="w-full max-w-md rounded-full bg-slate-900 border border-slate-700 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProjectCard key={p.name} {...p} />
        ))}
        {filtered.length === 0 && (
          <div className="text-slate-500 text-sm col-span-full">
            No projects match <span className="font-mono">{query}</span>.
          </div>
        )}
      </div>
    </div>
  );
}
