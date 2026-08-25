import { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Terminal ErrorBoundary]', error, errorInfo);
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
      } catch {
        // ignore
      }
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-[#050a05] text-[#22c55e] font-mono flex flex-col items-center justify-center p-4 select-none">
          <div className="max-w-lg w-full p-6 bg-black/80 border border-red-500/50 rounded-xl shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-950/80 border border-red-500/60 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                KERNEL PANIC: TERMINAL CRASH RECOVERY
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                A runtime exception occurred in the terminal stream session.
              </p>
            </div>

            <div className="p-3 bg-red-950/30 border border-red-800/40 rounded text-left text-xs text-red-300 overflow-x-auto no-scrollbar font-mono">
              <code>{this.state.error?.message || 'Unknown runtime exception'}</code>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded text-xs flex items-center justify-center gap-2 transition hover:scale-105 active:scale-95 cursor-pointer shadow"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reboot Terminal (Clear Cache)</span>
              </button>

              <a
                href="/"
                className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded text-xs border border-slate-600 transition"
              >
                Reload Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
