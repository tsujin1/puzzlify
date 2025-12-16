import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Clock, Download, RefreshCw, ChevronLeft, Trophy, X, Eye } from 'lucide-react';
import GameBoard from '../features/game/components/GameBoard';
import { getGameById } from '../features/game/gameService';
import { generateAndDownloadCertificate } from '../utils/canvasHelpers';

const PlayPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [gameData, setGameData] = useState<{ imageUrl: string; gridSize: number } | null>(() => {
    if (location.state?.image && location.state?.size) {
      return { imageUrl: location.state.image, gridSize: location.state.size };
    }
    return null;
  });

  const [loading, setLoading] = useState(!gameData);
  const [error, setError] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showMobileHint, setShowMobileHint] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (isTimerRunning) {
      interval = window.setInterval(() => setTimer(p => p + 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isTimerRunning]);

  useEffect(() => {
    if (!gameData && id) {
      getGameById(id)
        .then(data => {
          setGameData({ imageUrl: data.imageUrl, gridSize: data.gridSize });
          setLoading(false);
          // Preload the image
          if (data.imageUrl) {
            const img = new Image();
            img.onload = () => setImageLoaded(true);
            img.onerror = () => setImageLoaded(false);
            img.src = data.imageUrl;
          }
        })
        .catch(() => { setError(true); setLoading(false); });
    } else if (gameData?.imageUrl) {
      // Preload image if we have it from location.state
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageLoaded(false);
      img.src = gameData.imageUrl;
    }
  }, [id, gameData]);

  const handlePuzzleSolved = () => { setIsSolved(true); setIsTimerRunning(false); };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (!playerName.trim() || !gameData) return;
    
    generateAndDownloadCertificate({
      imageUrl: gameData.imageUrl,
      gridSize: gameData.gridSize,
      playerName,
      timeString: formatTime(timer),
      onComplete: () => setShowDownloadModal(false)
    });
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-indigo-600 font-bold">Loading...</div>;
  if (error || !gameData) return <div className="p-10 text-center font-bold text-red-500">Error loading game data.</div>;

  return (
    <div className="fixed inset-0 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 z-30 shrink-0">
         <button onClick={() => navigate('/')} className="p-2 -ml-2 text-slate-500 hover:text-slate-800">
           <ChevronLeft size={24} />
         </button>
         <div className="flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-full">
           <Clock size={14} className="text-indigo-500"/>
           <span className="font-mono font-black text-slate-700">{formatTime(timer)}</span>
         </div>
         <div className="w-8"></div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-[400px] bg-white/80 backdrop-blur-xl border-r border-white/50 shadow-2xl z-20 flex-col p-6 relative overflow-y-auto h-full">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-bold mb-6 group w-fit">
          <div className="p-1 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all">
            <ChevronLeft size={20} />
          </div>
          <span className="text-sm uppercase tracking-wider">Exit</span>
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Game On</h1>
          <p className="text-slate-500 font-medium">Reassemble the tiles.</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2 mb-1">
                <Clock size={14} /> Timer
              </span>
              <div className="text-4xl font-black text-slate-700 font-mono tracking-tighter">
                {formatTime(timer)}
              </div>
            </div>
            {isTimerRunning && <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-200"/>}
        </div>

        <div className="flex-1 min-h-[200px] lg:max-h-[300px] relative rounded-3xl overflow-hidden shadow-inner border-4 border-white bg-slate-100 mb-6 flex items-center justify-center p-4">
           {imageLoaded ? (
             <img 
               src={gameData.imageUrl} 
               className="max-w-full max-h-full object-contain shadow-sm rounded-lg" 
               alt="Target"
               onError={() => setImageLoaded(false)}
             />
           ) : (
             <div className="text-slate-400 text-sm font-medium">Loading preview...</div>
           )}
        </div>

        <div className="mt-auto pt-4">
          {isSolved ? (
            <button onClick={() => setShowDownloadModal(true)} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-95">
              <Trophy size={20} /> Claim Certificate
            </button>
          ) : (
             <button onClick={() => window.location.reload()} className="w-full py-4 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95">
              <RefreshCw size={18} /> Restart Puzzle
            </button>
          )}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 bg-slate-50/30 overflow-hidden">
        <GameBoard 
          imageUrl={gameData.imageUrl} 
          gridSize={gameData.gridSize} 
          onPuzzleSolved={handlePuzzleSolved} 
        />
      </div>

      {/* Mobile Footer */}
      <div className="lg:hidden bg-white border-t border-slate-200 p-4 pb-8 z-30 shrink-0 flex gap-3">
         {isSolved ? (
            <button onClick={() => setShowDownloadModal(true)} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
              <Trophy size={18} /> Certificate
            </button>
         ) : (
           <>
             <button onClick={() => setShowMobileHint(true)} className="flex items-center justify-center w-14 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200">
               <Eye size={20} />
             </button>
             <button onClick={() => window.location.reload()} className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-slate-50">
               <RefreshCw size={18} /> Restart
             </button>
           </>
         )}
      </div>

      {/* Modals */}
      {showMobileHint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setShowMobileHint(false)}>
           <div className="relative max-w-sm w-full bg-transparent">
             <button onClick={() => setShowMobileHint(false)} className="absolute -top-12 right-0 text-white/80 p-2">
               <X size={24} />
             </button>
             {imageLoaded ? (
               <img 
                 src={gameData.imageUrl} 
                 className="w-full h-auto rounded-2xl shadow-2xl border-4 border-white/20" 
                 alt="Hint"
                 onError={() => setImageLoaded(false)}
               />
             ) : (
               <div className="w-full h-64 bg-slate-800 rounded-2xl flex items-center justify-center">
                 <div className="text-white/60 text-sm">Loading image...</div>
               </div>
             )}
             <p className="text-white/60 text-center mt-4 font-medium text-sm">Tap anywhere to close</p>
           </div>
        </div>
      )}

      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md p-8 rounded-4xl shadow-2xl transform transition-all animate-in zoom-in-95">
             <div className="text-center mb-6">
               <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Trophy size={32} />
               </div>
               <h2 className="text-2xl font-black text-slate-800">Puzzle Complete!</h2>
               <p className="text-slate-500 font-medium mt-1">Immortalize your victory.</p>
             </div>
             
             <input
               value={playerName}
               onChange={(e) => setPlayerName(e.target.value)}
               placeholder="Enter your name"
               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4"
               autoFocus
             />
             
             <div className="grid grid-cols-2 gap-3">
               <button onClick={() => setShowDownloadModal(false)} className="py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
               <button onClick={handleDownload} className="py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                 <Download size={18} /> Save
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayPage;