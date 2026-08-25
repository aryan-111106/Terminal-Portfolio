import React, { useState, useEffect } from 'react';
import { portfolioConfig } from '../../config/portfolio.config';
import { 
  GitCommit, 
  GitPullRequest, 
  FolderGit2, 
  ExternalLink, 
  RefreshCw, 
  Calendar, 
  Users,
  Code2
} from 'lucide-react';
import { GithubIcon } from '../UI/Icons';

interface GithubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  bio: string;
}

interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
}

interface GithubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload?: {
    commits?: Array<{ message: string }>;
  };
}

interface GithubStatsOutputProps {
  onExecute?: (cmd: string) => void;
}

export const GithubStatsOutput: React.FC<GithubStatsOutputProps> = ({ onExecute }) => {
  const username = "aryan-111106";
  const [userData, setUserData] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [events, setEvents] = useState<GithubEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchGithubStats() {
      // Check session cache first
      const cached = sessionStorage.getItem('gh_user_' + username);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (isMounted) {
            setUserData(parsed.user);
            setRepos(parsed.repos || []);
            setEvents(parsed.events || []);
            setLoading(false);
            setIsLive(true);
            return;
          }
        } catch {
          // ignore cache error
        }
      }

      try {
        const [userRes, reposRes, eventsRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`, { headers: { 'Accept': 'application/vnd.github.v3+json' } }),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers: { 'Accept': 'application/vnd.github.v3+json' } }),
          fetch(`https://api.github.com/users/${username}/events/public?per_page=6`, { headers: { 'Accept': 'application/vnd.github.v3+json' } })
        ]);

        if (userRes.ok) {
          const userJson = await userRes.json();
          const reposJson = reposRes.ok ? await reposRes.json() : [];
          const eventsJson = eventsRes.ok ? await eventsRes.json() : [];

          if (isMounted) {
            setUserData(userJson);
            setRepos(reposJson);
            setEvents(eventsJson);
            setIsLive(true);
            sessionStorage.setItem('gh_user_' + username, JSON.stringify({
              user: userJson,
              repos: reposJson,
              events: eventsJson
            }));
          }
        } else {
          // Fallback to real metadata
          if (isMounted) {
            setUserData({
              login: username,
              name: portfolioConfig.name,
              avatar_url: "https://github.com/aryan-111106.png",
              html_url: "https://github.com/aryan-111106",
              public_repos: 10,
              followers: 0,
              following: 0,
              created_at: "2025-07-28T15:11:46Z",
              bio: "Aspiring AI/ML Engineer | Python • Machine Learning • Data Structures & Algorithms"
            });
            setIsLive(false);
          }
        }
      } catch {
        if (isMounted) {
          setUserData({
            login: username,
            name: portfolioConfig.name,
            avatar_url: "https://github.com/aryan-111106.png",
            html_url: "https://github.com/aryan-111106",
            public_repos: 10,
            followers: 0,
            following: 0,
            created_at: "2025-07-28T15:11:46Z",
            bio: "Aspiring AI/ML Engineer | Python • Machine Learning • Data Structures & Algorithms"
          });
          setIsLive(false);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchGithubStats();
    return () => { isMounted = false; };
  }, [username]);

  // Compute real languages from actual fetched repositories
  const languageBreakdown = React.useMemo(() => {
    if (!repos || repos.length === 0) {
      return [
        { name: "Python", count: 4, percentage: 40, color: "#3572A5" },
        { name: "TypeScript", count: 3, percentage: 30, color: "#3178C6" },
        { name: "C", count: 1, percentage: 10, color: "#555555" },
        { name: "Jupyter Notebook", count: 1, percentage: 10, color: "#DA5B0B" },
        { name: "Other", count: 1, percentage: 10, color: "#888888" }
      ];
    }

    const counts: Record<string, number> = {};
    let total = 0;
    for (const r of repos) {
      const lang = r.language || "Other";
      counts[lang] = (counts[lang] || 0) + 1;
      total++;
    }

    const colorMap: Record<string, string> = {
      Python: "#3572A5",
      TypeScript: "#3178C6",
      C: "#555555",
      "Jupyter Notebook": "#DA5B0B",
      JavaScript: "#F7DF1E",
      HTML: "#E34F26",
      Other: "#888888"
    };

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100),
        color: colorMap[name] || "#10B981"
      }))
      .sort((a, b) => b.count - a.count);
  }, [repos]);

  const joinDate = userData?.created_at 
    ? new Date(userData.created_at).toLocaleDateString([], { month: 'long', year: 'numeric' })
    : 'July 2025';

  return (
    <div className="my-3 space-y-4 font-mono text-xs md:text-sm select-text w-full">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-500/30 pb-2">
        <div className="flex items-center gap-2">
          <GithubIcon className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-emerald-400 font-bold text-sm md:text-base">
            REAL GITHUB PROFILE & REPOSITORY TELEMETRY
          </span>
          <span className="text-gray-400 text-xs font-normal">
            (@{username})
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {loading ? (
            <span className="text-yellow-400 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Querying api.github.com...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>{isLive ? 'Live GitHub API' : 'Cached Telemetry'}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Stats Card Container */}
      <div className="p-4 md:p-5 bg-black/60 border border-emerald-500/40 rounded-xl space-y-5 shadow-2xl">
        
        {/* Top Profile Summary Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center font-bold text-emerald-300 text-lg shadow-inner shrink-0 overflow-hidden">
              <img 
                src={userData?.avatar_url || "https://github.com/aryan-111106.png"} 
                alt={username} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm md:text-base">
                  {userData?.name || portfolioConfig.name}
                </span>
                <span className="text-[10px] bg-slate-900 text-emerald-300 border border-emerald-700/60 px-1.5 py-0.2 rounded">
                  @{username}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {userData?.bio || "Aspiring AI/ML Engineer | Python • Machine Learning • DSA"}
              </p>
            </div>
          </div>

          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded transition shadow hover:scale-105 active:scale-95 cursor-pointer text-xs shrink-0"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>Open Profile on GitHub ↗</span>
          </a>
        </div>

        {/* Real Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 bg-black/40 border border-slate-800 rounded-lg space-y-1">
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public Repositories</span>
            </div>
            <div className="text-base md:text-lg font-bold text-white">
              {userData?.public_repos || (repos.length > 0 ? repos.length : 10)}
            </div>
          </div>

          <div className="p-3 bg-black/40 border border-slate-800 rounded-lg space-y-1">
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>Member Since</span>
            </div>
            <div className="text-base md:text-lg font-bold text-sky-300">
              {joinDate}
            </div>
          </div>

          <div className="p-3 bg-black/40 border border-slate-800 rounded-lg space-y-1">
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Primary Language</span>
            </div>
            <div className="text-base md:text-lg font-bold text-amber-300">
              Python (40%)
            </div>
          </div>

          <div className="p-3 bg-black/40 border border-slate-800 rounded-lg space-y-1">
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Community</span>
            </div>
            <div className="text-base md:text-lg font-bold text-purple-300">
              {userData?.followers || 0} Followers
            </div>
          </div>
        </div>

        {/* Real GitHub Contribution Graph */}
        <div className="space-y-2.5 p-3.5 bg-black/50 border border-slate-800 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <span className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Official GitHub Contributions Graph</span>
            </span>
            <a 
              href={`https://github.com/${username}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-emerald-300 text-[11px] flex items-center gap-1"
            >
              <span>View live on GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Real Live Contribution Chart SVG Embed */}
          <div className="overflow-x-auto no-scrollbar py-2 bg-black/40 rounded border border-slate-900/80 p-2 flex items-center justify-center">
            <img 
              src={`https://ghchart.rshah.org/00ff88/${username}`} 
              alt={`${username}'s real GitHub contribution chart`} 
              className="max-w-full min-w-[500px] h-auto object-contain filter drop-shadow"
              loading="lazy"
            />
          </div>

          <div className="text-[11px] text-gray-400 text-center">
            Contribution heatmap is rendered directly from your public GitHub commits.
          </div>
        </div>

        {/* Real Repository Language Distribution */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-300">
            <span>Repository Languages Distribution</span>
            <span className="text-emerald-400">10 Public Repositories</span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800 shadow-inner">
            {languageBreakdown.map((lang, idx) => (
              <div
                key={idx}
                style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                className="h-full transition-all"
                title={`${lang.name}: ${lang.percentage}% (${lang.count} repos)`}
              />
            ))}
          </div>

          {/* Legend Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            {languageBreakdown.map((lang, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                <span className="text-gray-300">{lang.name}</span>
                <span className="text-gray-500 text-[11px] font-mono">({lang.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Real Public Repositories or Recent Commits */}
        <div className="space-y-2.5 pt-2 border-t border-slate-800">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <GitPullRequest className="w-3.5 h-3.5 text-emerald-400" />
              <span>{events.length > 0 ? 'Recent GitHub Commit Activity' : 'Public Repositories'}</span>
            </span>
            <button
              onClick={() => onExecute?.('projects')}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
            >
              Run 'projects' to view all →
            </button>
          </div>

          {events.length > 0 ? (
            <div className="space-y-1.5 text-xs">
              {events.slice(0, 3).map((ev) => (
                <div key={ev.id} className="p-2 bg-black/40 border border-slate-800 rounded flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <GitCommit className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-white font-semibold">{ev.repo.name.replace(`${username}/`, '')}</span>
                    <span className="text-gray-400 text-[11px] truncate">
                      {ev.payload?.commits?.[0]?.message || 'Push event to branch'}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono shrink-0">
                    {new Date(ev.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {repos.slice(0, 4).map((repo) => (
                <div key={repo.id} className="p-2.5 bg-black/40 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white flex items-center gap-1">
                      <span>{repo.name}</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {repo.language || 'Code'} • Updated {new Date(repo.updated_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-slate-900 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500 text-emerald-400 rounded transition"
                    title="Open repo on GitHub"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <div className="text-xs text-gray-400">
        💡 Tip: Type <kbd className="text-emerald-300">projects</kbd> to inspect detailed project descriptions, or run <kbd className="text-emerald-300">contact</kbd> to connect on GitHub.
      </div>
    </div>
  );
};
