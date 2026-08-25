import React, { useEffect, useState } from 'react';

interface SteamLocomotiveProps {
  onComplete: () => void;
}

const TRAIN_ART = `
      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ _____ |   (|) |         |
   /     |  |   H  |  |     )|   |    |   |         |
  |      |  |   H  |__--------------------|_________|
  | ________|___H__/__|_____/[][]~\\_______|
  |/ |   |_____ _____ _____|___/   \\__|_____|_____
(==/     |=======================================|
   \\__/__/   \\_/__/   \\_/__/   \\_/__/   \\_/__/
`;

export const SteamLocomotive: React.FC<SteamLocomotiveProps> = ({ onComplete }) => {
  const [offset, setOffset] = useState<number>(window.innerWidth + 100);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => {
        if (prev < -600) {
          clearInterval(interval);
          onComplete();
          return -600;
        }
        return prev - 18;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-x-0 bottom-1/3 z-50 pointer-events-none overflow-hidden select-none">
      <pre 
        className="font-mono text-xs md:text-sm font-bold text-amber-400 leading-none whitespace-pre drop-shadow-md"
        style={{ transform: `translateX(${offset}px)` }}
      >
        {TRAIN_ART}
      </pre>
    </div>
  );
};
