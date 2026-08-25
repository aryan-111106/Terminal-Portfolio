import React from 'react';
import { TerminalTheme } from '../../config/themes';
import { Terminal, FolderGit2, Cpu, History, Mail, FileText, HelpCircle, Trash2 } from 'lucide-react';

interface QuickActionsProps {
  onExecute: (cmd: string) => void;
  theme: TerminalTheme;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onExecute, theme }) => {
  const actions = [
    { label: 'about', cmd: 'about', icon: <Terminal className="w-3 h-3" /> },
    { label: 'projects', cmd: 'projects', icon: <FolderGit2 className="w-3 h-3" /> },
    { label: 'skills', cmd: 'skills', icon: <Cpu className="w-3 h-3" /> },
    { label: 'certs', cmd: 'certifications', icon: <FileText className="w-3 h-3" /> },
    { label: 'education', cmd: 'education', icon: <History className="w-3 h-3" /> },
    { label: 'contact', cmd: 'contact', icon: <Mail className="w-3 h-3" /> },
    { label: 'resume', cmd: 'resume', icon: <FileText className="w-3 h-3" /> },
    { label: 'help', cmd: 'help', icon: <HelpCircle className="w-3 h-3" /> },
    { label: 'clear', cmd: 'clear', icon: <Trash2 className="w-3 h-3" /> },
  ];

  return (
    <div 
      className="px-3 py-2 border-b flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none text-xs font-mono"
      style={{
        backgroundColor: theme.colors.bgSecondary,
        borderColor: theme.colors.border,
      }}
    >
      <span className="text-[11px] text-gray-400 font-semibold shrink-0 mr-1 hidden sm:inline">
        Quick:
      </span>
      {actions.map((act) => (
        <button
          key={act.label}
          onClick={() => onExecute(act.cmd)}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-black/40 hover:bg-black/80 border text-[11px] font-mono shrink-0 transition hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            borderColor: theme.colors.border,
            color: theme.colors.text,
          }}
          title={`Run '${act.cmd}'`}
        >
          <span style={{ color: theme.colors.accent }}>{act.icon}</span>
          <span>{act.label}</span>
        </button>
      ))}
    </div>
  );
};
