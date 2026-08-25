import React from 'react';
import { portfolioConfig } from '../../config/portfolio.config';
import { ExternalLink, Star } from 'lucide-react';
import { GithubIcon } from '../UI/Icons';

interface ProjectsOutputProps {
  filter?: string;
}

export const ProjectsOutput: React.FC<ProjectsOutputProps> = ({ filter }) => {
  let projects = portfolioConfig.projects;

  if (filter) {
    const q = filter.toLowerCase();
    projects = projects.filter(p => 
      p.category.toLowerCase().includes(q) || 
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.name.toLowerCase().includes(q)
    );
  }

  if (projects.length === 0) {
    return (
      <div className="my-2 text-yellow-400 font-mono text-sm">
        No projects found matching filter: "{filter}". Run <span className="underline">projects</span> to view all.
      </div>
    );
  }

  return (
    <div className="my-3 space-y-4 font-mono text-sm">
      <div className="flex items-center justify-between border-b border-emerald-500/30 pb-1">
        <span className="text-emerald-400 font-bold">
          📁 FEATURED PROJECTS ({projects.length})
        </span>
        {filter && (
          <span className="text-xs text-gray-400">
            Filtered by: <span className="text-emerald-300">"{filter}"</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {projects.map((proj) => (
          <div 
            key={proj.id}
            className="p-3 bg-black/40 border border-emerald-500/30 hover:border-emerald-500/70 rounded-md flex flex-col justify-between transition group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-emerald-300 group-hover:text-emerald-200 flex items-center gap-1.5 text-base">
                  <span>{proj.name}</span>
                  {proj.featured && (
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700/60 px-1.5 py-0.2 rounded font-normal">
                      FEATURED
                    </span>
                  )}
                </h3>
                {proj.stars && (
                  <span className="flex items-center gap-1 text-xs text-yellow-400/90 shrink-0">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {proj.stars}
                  </span>
                )}
              </div>

              <span className="text-xs text-emerald-500/80 font-medium block mb-2">
                [{proj.category}]
              </span>

              <p className="text-xs text-gray-300 leading-relaxed mb-3">
                {proj.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {proj.tags.map((tag, i) => (
                  <span 
                    key={i}
                    className="text-[10px] bg-slate-900 border border-slate-700 text-slate-300 px-1.5 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="pt-2 border-t border-slate-800 flex items-center gap-3 text-xs">
              {proj.githubUrl && (
                <a 
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 hover:underline"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {proj.liveUrl && (
                <a 
                  href={proj.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-sky-400 hover:text-sky-300 hover:underline ml-auto"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-400">
        💡 Tip: You can view details in virtual filesystem with <kbd className="text-emerald-300">cat projects/{projects[0]?.id || 'project'}.md</kbd>
      </div>
    </div>
  );
};
