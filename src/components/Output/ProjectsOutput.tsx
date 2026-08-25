import React from 'react';
import { portfolioConfig } from '../../config/portfolio.config';
import { 
  ExternalLink, 
  Star, 
  Code2, 
  Sparkles, 
  Eye, 
  Cpu, 
  Bot, 
  Wallet, 
  FileCode, 
  BookOpen, 
  Layers, 
  FolderGit2,
  Database,
  Cloud,
  Terminal,
  Globe,
  Server,
  Shield,
  Smartphone,
  Gamepad2,
  Brain,
  BarChart,
  Zap,
  Binary,
  GitBranch
} from 'lucide-react';
import { GithubIcon } from '../UI/Icons';

interface ProjectsOutputProps {
  filter?: string;
  onExecute?: (cmd: string) => void;
}

// Dynamic smart resolver for any tech stack tag
export function getTagIcon(tag: string) {
  const t = tag.toLowerCase().trim();
  
  // AI / ML / LLMs / Agents
  if (t.includes('gemini') || t.includes('gpt') || t.includes('openai') || t.includes('llm') || t.includes('generative') || t.includes('agent') || t.includes('rag') || t.includes('langchain')) {
    return <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />;
  }
  if (t.includes('ai') || t.includes('machine learning') || t.includes('ml') || t.includes('deep learning') || t.includes('neural') || t.includes('pytorch') || t.includes('tensorflow') || t.includes('keras') || t.includes('scikit') || t.includes('model')) {
    return <Brain className="w-3 h-3 text-pink-400 shrink-0" />;
  }
  if (t.includes('vision') || t.includes('opencv') || t.includes('plate') || t.includes('image') || t.includes('ocr') || t.includes('camera') || t.includes('anpr')) {
    return <Eye className="w-3 h-3 text-emerald-400 shrink-0" />;
  }
  if (t.includes('voice') || t.includes('speech') || t.includes('audio') || t.includes('sound') || t.includes('tts') || t.includes('jarvis')) {
    return <Bot className="w-3 h-3 text-cyan-400 shrink-0" />;
  }
  if (t.includes('data') || t.includes('analytics') || t.includes('pandas') || t.includes('numpy') || t.includes('scipy') || t.includes('tableau') || t.includes('chart') || t.includes('stats')) {
    return <BarChart className="w-3 h-3 text-teal-400 shrink-0" />;
  }
  if (t.includes('jupyter') || t.includes('notebook') || t.includes('dsa') || t.includes('algorithm') || t.includes('problem solving') || t.includes('structures') || t.includes('math') || t.includes('college')) {
    return <BookOpen className="w-3 h-3 text-orange-400 shrink-0" />;
  }

  // Programming Languages
  if (t.includes('python') || t.includes('py')) return <Code2 className="w-3 h-3 text-yellow-400 shrink-0" />;
  if (t.includes('typescript') || t.includes('ts')) return <FileCode className="w-3 h-3 text-sky-400 shrink-0" />;
  if (t.includes('javascript') || t.includes('js')) return <FileCode className="w-3 h-3 text-amber-300 shrink-0" />;
  if (t === 'c' || t.includes('c++') || t.includes('cpp') || t.includes('c#') || t.includes('rust') || t.includes('go') || t.includes('golang') || t.includes('systems')) return <Cpu className="w-3 h-3 text-blue-400 shrink-0" />;
  if (t.includes('java') || t.includes('kotlin') || t.includes('scala') || t.includes('swift') || t.includes('dart') || t.includes('flutter')) return <Binary className="w-3 h-3 text-red-400 shrink-0" />;
  if (t.includes('bash') || t.includes('shell') || t.includes('cli') || t.includes('terminal') || t.includes('linux') || t.includes('unix')) return <Terminal className="w-3 h-3 text-emerald-400 shrink-0" />;
  if (t.includes('sql') || t.includes('postgres') || t.includes('mongo') || t.includes('redis') || t.includes('db') || t.includes('database') || t.includes('prisma') || t.includes('sqlite')) return <Database className="w-3 h-3 text-yellow-500 shrink-0" />;

  // Web & Frameworks
  if (t.includes('react') || t.includes('next') || t.includes('vue') || t.includes('svelte') || t.includes('angular') || t.includes('frontend') || t.includes('web') || t.includes('ui') || t.includes('html') || t.includes('css') || t.includes('tailwind')) return <Globe className="w-3 h-3 text-sky-400 shrink-0" />;
  if (t.includes('node') || t.includes('express') || t.includes('fastapi') || t.includes('flask') || t.includes('django') || t.includes('backend') || t.includes('api') || t.includes('server') || t.includes('graphql') || t.includes('rest')) return <Server className="w-3 h-3 text-green-400 shrink-0" />;

  // Cloud & DevOps
  if (t.includes('cloud') || t.includes('aws') || t.includes('gcp') || t.includes('google cloud') || t.includes('oracle') || t.includes('oci') || t.includes('azure') || t.includes('docker') || t.includes('kubernetes') || t.includes('k8s')) return <Cloud className="w-3 h-3 text-indigo-400 shrink-0" />;
  if (t.includes('git') || t.includes('github') || t.includes('devops') || t.includes('ci/cd')) return <GitBranch className="w-3 h-3 text-orange-500 shrink-0" />;
  if (t.includes('security') || t.includes('auth') || t.includes('crypto') || t.includes('blockchain')) return <Shield className="w-3 h-3 text-rose-400 shrink-0" />;
  if (t.includes('mobile') || t.includes('android') || t.includes('ios')) return <Smartphone className="w-3 h-3 text-purple-300 shrink-0" />;
  if (t.includes('finance') || t.includes('budget') || t.includes('money') || t.includes('deloitte')) return <Wallet className="w-3 h-3 text-amber-400 shrink-0" />;
  if (t.includes('game') || t.includes('gaming') || t.includes('color') || t.includes('arcade')) return <Gamepad2 className="w-3 h-3 text-violet-400 shrink-0" />;
  if (t.includes('fast') || t.includes('perf') || t.includes('speed') || t.includes('async')) return <Zap className="w-3 h-3 text-yellow-300 shrink-0" />;

  // Fallback for custom tech
  return <Layers className="w-3 h-3 text-emerald-400/80 shrink-0" />;
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
        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
          <FolderGit2 className="w-4 h-4 text-emerald-400" />
          <span>FEATURED GITHUB REPOSITORIES ({projects.length})</span>
        </span>
        {filter && (
          <span className="text-xs text-gray-400">
            Filtered by: <span className="text-emerald-300">"{filter}"</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {projects.map((proj) => (
          <div 
            key={proj.id}
            className="p-3.5 bg-black/50 border border-emerald-500/30 hover:border-emerald-400/80 rounded-lg flex flex-col justify-between transition-all duration-200 shadow-md group"
          >
            <div>
              {/* Header: Title + Featured Badge + Stars */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <a 
                  href={proj.githubUrl || `https://github.com/aryan-111106/${proj.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-300 group-hover:text-emerald-200 hover:underline flex items-center gap-1.5 text-base cursor-pointer"
                  title="Click to view repository on GitHub"
                >
                  <span>{proj.name}</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-emerald-300 transition shrink-0" />
                </a>

                <div className="flex items-center gap-1.5 shrink-0">
                  {proj.featured && (
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-600/70 px-1.5 py-0.5 rounded font-semibold">
                      FEATURED
                    </span>
                  )}
                  {proj.stars !== undefined && proj.stars > 0 && (
                    <span className="flex items-center gap-1 text-xs text-yellow-400 font-medium">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {proj.stars}
                    </span>
                  )}
                </div>
              </div>

              {/* Category & Status */}
              <div className="flex items-center gap-2 mb-2 text-xs">
                <span className="text-emerald-500/90 font-medium">
                  [{proj.category}]
                </span>
                {proj.stats && (
                  <span className="text-gray-400 text-[11px]">
                    • {proj.stats}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-gray-300 leading-relaxed mb-3">
                {proj.description}
              </p>

              {/* Dynamic Tech Stack Badges with Icons */}
              <div className="mb-3.5">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 font-semibold">
                  Tech Stack:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map((tag, i) => (
                    <span 
                      key={i}
                      className="flex items-center gap-1 text-[11px] bg-slate-900/90 border border-slate-700/80 hover:border-emerald-500/50 text-gray-200 px-2 py-0.5 rounded transition shadow-sm"
                    >
                      {getTagIcon(tag)}
                      <span className="font-mono">{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Clickable Action Links */}
            <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
              {proj.githubUrl && (
                <a 
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/80 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500 text-emerald-400 hover:text-emerald-300 rounded transition font-semibold cursor-pointer"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>View Repository</span>
                </a>
              )}
              {proj.liveUrl && (
                <a 
                  href={proj.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-950/80 hover:bg-sky-900 border border-sky-700 hover:border-sky-400 text-sky-300 rounded transition font-semibold ml-auto cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-400 pt-1">
        💡 Tip: You can inspect documentation in virtual filesystem with <kbd className="text-emerald-300">cat projects/{projects[0]?.id || 'agrisathi'}.md</kbd>
      </div>
    </div>
  );
};
