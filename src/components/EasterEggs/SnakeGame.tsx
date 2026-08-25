import React, { useState, useEffect, useCallback } from 'react';
import { soundFX } from '../../services/soundFX';

interface SnakeGameProps {
  onClose: () => void;
  accentColor?: string;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SPEED = 120;

export const SnakeGame: React.FC<SnakeGameProps> = ({ onClose }) => {
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 }
  ]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [nextDirection, setNextDirection] = useState<Direction>('UP');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('snake_highscore') || '0', 10);
  });
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const spawnFood = useCallback((currentSnake: Position[]): Position => {
    while (true) {
      const newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      const collision = currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
      if (!collision) return newFood;
    }
  }, []);

  const resetGame = () => {
    const initSnake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 }
    ];
    setSnake(initSnake);
    setFood(spawnFood(initSnake));
    setDirection('UP');
    setNextDirection('UP');
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') {
        onClose();
        return;
      }

      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        setIsPaused(prev => !prev);
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        if (gameOver) resetGame();
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver, onClose]);

  // Main game tick
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setDirection(nextDirection);

      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };

        switch (nextDirection) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Wall collision check
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          soundFX.playError();
          return prevSnake;
        }

        // Self collision check
        if (prevSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
          setGameOver(true);
          soundFX.playError();
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Food eaten check
        if (head.x === food.x && head.y === food.y) {
          soundFX.playBeep(880, 0.05);
          setScore(prev => {
            const nextScore = prev + 10;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem('snake_highscore', String(nextScore));
            }
            return nextScore;
          });
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    };

    const speed = Math.max(70, INITIAL_SPEED - Math.floor(score / 30) * 5);
    const interval = window.setInterval(moveSnake, speed);
    return () => window.clearInterval(interval);
  }, [nextDirection, food, gameOver, isPaused, score, highScore, spawnFood]);

  return (
    <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border-2 border-green-500/80 rounded-lg p-4 md:p-6 max-w-md w-full shadow-2xl font-mono text-gray-100 flex flex-col items-center">
        {/* Title & Scoreboard */}
        <div className="w-full flex justify-between items-center mb-4 border-b border-green-500/30 pb-2">
          <div className="flex items-center space-x-2">
            <span className="text-green-400 font-bold tracking-wider">🐍 TERMINAL SNAKE</span>
          </div>
          <div className="flex items-center space-x-4 text-xs md:text-sm">
            <span>SCORE: <strong className="text-green-400">{score}</strong></span>
            <span>HIGH: <strong className="text-yellow-400">{highScore}</strong></span>
          </div>
        </div>

        {/* Board Canvas Grid */}
        <div 
          className="relative bg-black border border-green-500/40 rounded overflow-hidden"
          style={{
            width: '280px',
            height: '280px',
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {/* Render Snake */}
          {snake.map((seg, idx) => (
            <div
              key={`${seg.x}-${seg.y}-${idx}`}
              className={`rounded-sm ${idx === 0 ? 'bg-green-300 shadow-sm' : 'bg-green-500'}`}
              style={{
                gridColumnStart: seg.x + 1,
                gridRowStart: seg.y + 1,
              }}
            />
          ))}

          {/* Render Food */}
          <div
            className="bg-red-500 rounded-full animate-pulse shadow-md shadow-red-500/50"
            style={{
              gridColumnStart: food.x + 1,
              gridRowStart: food.y + 1,
            }}
          />

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-4">
              <span className="text-red-500 font-bold text-lg mb-1 tracking-wider animate-bounce">
                GAME OVER!
              </span>
              <p className="text-xs text-gray-400 mb-3">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="px-3 py-1 bg-green-600 hover:bg-green-500 text-black font-bold text-xs rounded transition cursor-pointer"
              >
                Press R to Restart
              </button>
            </div>
          )}

          {/* Paused Overlay */}
          {isPaused && !gameOver && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-yellow-400 font-bold text-sm tracking-widest animate-pulse">
                [ PAUSED ]
              </span>
            </div>
          )}
        </div>

        {/* Mobile On-Screen D-Pad */}
        <div className="mt-4 flex flex-col items-center gap-1 md:hidden">
          <button
            onClick={() => direction !== 'DOWN' && setNextDirection('UP')}
            className="w-12 h-10 bg-slate-800 border border-green-500/40 rounded flex items-center justify-center active:bg-green-600 cursor-pointer"
          >
            ▲
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => direction !== 'RIGHT' && setNextDirection('LEFT')}
              className="w-12 h-10 bg-slate-800 border border-green-500/40 rounded flex items-center justify-center active:bg-green-600 cursor-pointer"
            >
              ◀
            </button>
            <button
              onClick={() => direction !== 'LEFT' && setNextDirection('RIGHT')}
              className="w-12 h-10 bg-slate-800 border border-green-500/40 rounded flex items-center justify-center active:bg-green-600 cursor-pointer"
            >
              ▶
            </button>
          </div>
          <button
            onClick={() => direction !== 'UP' && setNextDirection('DOWN')}
            className="w-12 h-10 bg-slate-800 border border-green-500/40 rounded flex items-center justify-center active:bg-green-600 cursor-pointer"
          >
            ▼
          </button>
        </div>

        {/* Footer & Controls Info */}
        <div className="w-full mt-4 pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-gray-400">
          <span>Controls: <kbd className="text-green-400">WASD</kbd> or <kbd className="text-green-400">Arrows</kbd></span>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-300 font-bold px-2 py-0.5 rounded border border-red-500/30 hover:border-red-400 transition cursor-pointer"
          >
            Exit (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};
