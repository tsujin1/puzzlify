import { useEffect } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { getBackgroundStyle } from '../../../utils/gridHelpers';

interface GameBoardProps {
  imageUrl: string;
  gridSize: number;
  onPuzzleSolved?: () => void;
}

const GameBoard = ({ imageUrl, gridSize, onPuzzleSolved }: GameBoardProps) => {
  const size = Number(gridSize);
  const { tiles, handleTileClick, isSolved } = useGameLogic(size);
  const emptyTileId = size * size - 1;

  useEffect(() => {
    if (isSolved && onPuzzleSolved) onPuzzleSolved();
  }, [isSolved, onPuzzleSolved]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative z-10">
      <div 
        className="relative bg-white p-3 rounded-3xl shadow-2xl shadow-indigo-100 border border-white"
        style={{
          width: 'min(90vw, 500px)',
          maxWidth: '60vh',
          aspectRatio: '1/1',
        }}
      >
        <div className="w-full h-full rounded-2xl overflow-hidden relative bg-slate-100 shadow-inner">
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
                  <div className="absolute inset-0 border border-white/20 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)] rounded-sm"></div>
                )}
              </div>
            );
          })}
        </div>

        {isSolved && (
          <div className="absolute -top-3 -right-3 bg-green-500 text-white font-black text-xs px-3 py-1.5 rounded-full shadow-lg animate-bounce z-20">
            SOLVED!
          </div>
        )}
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