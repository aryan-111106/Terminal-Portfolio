import React from 'react';

export const WhoamiOutput: React.FC = () => {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36';
  const platform = typeof navigator !== 'undefined' ? (navigator as unknown as { platform?: string }).platform || 'Win32' : 'Win32';

  return (
    <div className="my-2 font-mono text-xs md:text-sm text-gray-100 space-y-1 select-text">
      <div>
        <span className="text-gray-400">Username: </span>
        <span className="text-emerald-300 font-semibold">visitor</span>
      </div>
      <div>
        <span className="text-gray-400">OS: </span>
        <span className="text-white">{platform}</span>
      </div>
      <div className="break-all">
        <span className="text-gray-400">Browser: </span>
        <span className="text-white">{ua}</span>
      </div>
    </div>
  );
};
