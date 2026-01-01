interface ProjectCardProps {
  name: string;
  duration?: string;
  updated?: string;
}

export default function ProjectCard({ name, duration, updated }: ProjectCardProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 hover:border-indigo-400/70 transition">
      <div className="text-sm text-slate-400 mb-1">Audio project</div>
      <div className="text-base font-medium mb-2">{name}</div>
      <div className="text-xs text-slate-500 flex gap-4">
        {duration && <span>{duration}</span>}
        {updated && <span>Updated {updated}</span>}
      </div>
    </div>
  );
}
