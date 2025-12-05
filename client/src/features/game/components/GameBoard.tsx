import { useEffect, useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { getBackgroundStyle } from '../../../utils/gridHelpers';

interface GameBoardProps {
  imageUrl: string;
  gridSize: number;
  onPuzzleSolved?: () => void;
}

const generateParticles = () => {
  return Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    width: Math.random() * 10 + 5 + 'px',
    height: Math.random() * 10 + 5 + 'px',
    backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'][Math.floor(Math.random() * 4)],
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDuration: `${1 + Math.random()}s`,
    animationDelay: `${Math.random() * 0.5}s`
  }));
};

const ConfettiOverlay = () => {
  const [particles] = useState(generateParticles);

  return (
    <>
      <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/20 to-purple-500/20 z-20 animate-pulse" />
      
      <div className="absolute inset-0 z-30 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 bottom-0 left-0 w-1/2 bg-linear-to-r from-transparent via-white/40 to-transparent"
          style={{ animation: 'sheen 1.5s infinite' }}
        />
      </div>

      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute z-40 rounded-full"
          style={{
            width: particle.width,
            height: particle.height,
            backgroundColor: particle.backgroundColor,
            left: particle.left,
            top: particle.top,
            animation: `floatUp ${particle.animationDuration} ease-out forwards`,
            animationDelay: particle.animationDelay
          }}
        />
      ))}

      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-full shadow-2xl border border-white/50 transform animate-[pop_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">🏆</span>
            <div>
              <h3 className="text-lg font-black bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                Excellent!
              </h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const GameBoard = ({ imageUrl, gridSize, onPuzzleSolved }: GameBoardProps) => {
  const size = Number(gridSize);
  const { tiles, handleTileClick, isSolved } = useGameLogic(size);
  const emptyTileId = size * size - 1;
  
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      if (img.naturalHeight) {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    if (isSolved && onPuzzleSolved) onPuzzleSolved();
  }, [isSolved, onPuzzleSolved]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative z-10">
      <style>
        {`
          @keyframes pop {
            0% { transform: scale(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: scale(1.2); opacity: 0; }
          }
          @keyframes sheen {
            0% { transform: translateX(-100%) skewX(-15deg); }
            100% { transform: translateX(200%) skewX(-15deg); }
          }
          @keyframes floatUp {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
          }
        `}
      </style>

      <div 
        className={`relative bg-white p-3 rounded-3xl transition-all duration-700 ${
          isSolved ? 'shadow-[0_0_50px_rgba(99,102,241,0.4)] scale-105' : 'shadow-2xl shadow-indigo-100'
        }`}
        style={{
          width: 'min(90vw, 500px)',
          aspectRatio: aspectRatio, 
          maxHeight: '65vh', 
        }}
      >
        <div className="w-full h-full rounded-2xl overflow-hidden relative bg-slate-100 shadow-inner group">
          
          {tiles.map((tile) => {
            const isEmpty = tile.id === emptyTileId;
            const shouldShowImage = isSolved || !isEmpty;
            const row = Math.floor(tile.currentPos / size);
            const col = tile.currentPos % size;

            return (
              <div
                key={tile.id}
                onClick={() => !isSolved && handleTileClick(tile.id)}
                className={`absolute transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) ${
                  !isEmpty && !isSolved 
                    ? 'cursor-pointer hover:scale-[0.96] hover:brightness-110 z-10' 
                    : 'z-0'
                }`}
                style={{
                  width: `calc(100% / ${size})`,
                  height: `calc(100% / ${size})`,
                  transform: `translate(${col * 100}%, ${row * 100}%)`,
                  ...(shouldShowImage ? getBackgroundStyle(tile.correctPos, size, imageUrl) : {}),
                  backgroundSize: `${size * 100}% ${size * 100}%` 
                }}
              >
                {!isEmpty && !isSolved && (
                  <div className="absolute inset-0 border border-white/20 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)] rounded-sm" />
                )}
              </div>
            );
          })}

          {isSolved && <ConfettiOverlay />}
        </div>
      </div>
      
      {!isSolved && (
        <p className="mt-6 text-slate-400 font-bold text-xs tracking-widest uppercase opacity-60">
          Tap tiles to slide
        </p>
      )}
    </div>
  );
};

export default GameBoard;