import React, { useState } from 'react';
import { portfolioConfig } from '../../config/portfolio.config';
import { Mail, MessageSquare, Copy, Check } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../UI/Icons';

export const ContactOutput: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github': return <GithubIcon className="w-4 h-4" />;
      case 'linkedin': return <LinkedinIcon className="w-4 h-4" />;
      case 'x / twitter':
      case 'twitter': return <TwitterIcon className="w-4 h-4" />;
      case 'discord': return <MessageSquare className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioConfig.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="my-3 space-y-4 font-mono text-sm max-w-2xl">
      <div className="text-emerald-400 font-bold border-b border-emerald-500/30 pb-1 flex items-center gap-2">
        <Mail className="w-4 h-4 text-emerald-400" />
        <span>CONTACT & SOCIAL NETWORKS</span>
      </div>

      <div className="p-3 bg-black/40 border border-emerald-500/20 rounded-md space-y-3">
        <p className="text-xs text-gray-300">
          Interested in collaborating on a project, hiring, or just want to chat about systems & tech? Feel free to reach out via any channel below.
        </p>

        {/* Primary Email Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300">Direct Email:</span>
            <a 
              href={`mailto:${portfolioConfig.email}`} 
              className="text-xs text-white hover:underline hover:text-emerald-300 font-bold"
            >
              {portfolioConfig.email}
            </a>
          </div>

          <button
            onClick={handleCopyEmail}
            className="flex items-center justify-center gap-1 text-xs bg-slate-900 hover:bg-slate-800 text-gray-200 px-2.5 py-1 rounded border border-slate-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Social Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          {portfolioConfig.socials.map((soc, idx) => (
            <a
              key={idx}
              href={soc.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded transition group"
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-400 group-hover:text-emerald-300">
                  {getIcon(soc.platform)}
                </span>
                <span className="text-gray-200 font-semibold">{soc.platform}</span>
              </div>
              <span className="text-[11px] text-gray-400 group-hover:text-emerald-300">
                {soc.username} ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
