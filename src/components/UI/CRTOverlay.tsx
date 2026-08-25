import React from 'react';

interface CRTOverlayProps {
  enabled: boolean;
}

export const CRTOverlay: React.FC<CRTOverlayProps> = ({ enabled }) => {
  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* Scanline lines */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%)',
          backgroundSize: '100% 4px',
          zIndex: 51,
        }}
      />

      {/* Subtle CRT Flicker & vignette */}
      <div 
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.8), inset 0 0 40px rgba(0, 0, 0, 0.95)',
          zIndex: 52,
        }}
      />

      {/* Screen curvature glow border */}
      <div 
        className="absolute inset-0 border border-white/5 rounded-lg pointer-events-none"
        style={{ zIndex: 53 }}
      />
    </div>
  );
};
