import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Link as LinkIcon, Copy, Check, Puzzle, ArrowRight, Sparkles, Image as ImageIcon, Loader2, Diff } from 'lucide-react';
import { createGame } from './createService';

const CreateForm = () => {
  const navigate = useNavigate();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState(3);
  
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoCopied, setAutoCopied] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setGeneratedLink(null);
      setIsCopied(false);
      setAutoCopied(false);
    }
  };

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);

    try {
      const data = await createGame(selectedFile, gridSize);
      
      const newId = data._id; 
      const realLink = `${window.location.origin}/play/${newId}`;
      
      setGeneratedLink(realLink);
      setGameId(newId);
      
      await navigator.clipboard.writeText(realLink);
      setAutoCopied(true);

    } catch (error) {
      console.error(error);
      alert("Failed to create puzzle. Is the Server running?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (generatedLink) {
    return (
      <div className="w-full max-w-md bg-white rounded-4xl shadow-xl border border-white/50 relative overflow-hidden animate-in zoom-in-95 duration-300 mx-4">
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="p-6 sm:p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-sm animate-bounce">
            <Sparkles size={32} className="sm:size-10 fill-current text-green-500/20" />
            <div className="absolute"><Check size={32} className="sm:size-10" strokeWidth={3} /></div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2 tracking-tight">Puzzle Ready!</h2>
          <p className="text-slate-500 font-medium mb-6 sm:mb-8 text-sm sm:text-base">
            {autoCopied ? "Link copied to clipboard automatically." : "Share this link with your friends."}
          </p>

          <div className="w-full relative mb-6 sm:mb-8 group">
            <div className={`
              flex flex-col sm:flex-row items-stretch sm:items-center bg-slate-50 border-2 rounded-xl transition-all duration-300 overflow-hidden
              ${isCopied ? 'border-green-500 ring-4 ring-green-500/10' : 'border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10'}
            `}>
              <div className="flex items-center flex-1 min-w-0 p-3 sm:pr-0">
                <div className="shrink-0 text-slate-400 mr-3">
                  <LinkIcon size={20} />
                </div>
                <input 
                  readOnly 
                  value={generatedLink} 
                  className="flex-1 min-w-0 bg-transparent border-none outline-none text-slate-600 font-bold text-xs sm:text-sm truncate"
                />
              </div>
              <button 
                onClick={handleCopyLink}
                className={`
                  px-4 py-3 sm:py-2.5 font-bold text-sm transition-all flex items-center justify-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200/60
                  ${isCopied 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-200' 
                    : 'bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'}
                `}
              >
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
                <span className="hidden sm:inline">{isCopied ? "Copied" : "Copy"}</span>
                <span className="sm:hidden">{isCopied ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col w-full gap-3">
            <button 
              onClick={() => navigate(`/play/${gameId}`, { state: { image: previewUrl, size: gridSize } })}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              Play It Yourself <ArrowRight size={20} />
            </button>
            
            <button 
              onClick={() => { 
                setGeneratedLink(null); 
                setSelectedFile(null); 
                setPreviewUrl(null); 
                setGameId(null);
                setIsCopied(false);
                setAutoCopied(false);
              }}
              className="py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm sm:text-base"
            >
              Create New Puzzle
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-4xl shadow-xl border border-white/50 relative overflow-hidden mx-4">
      <div className="p-6 sm:p-8 pb-0 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest mb-4">
          <Puzzle size={14} /> Puzzle Creator
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2 tracking-tight">Upload Image</h2>
        <p className="text-slate-400 font-medium text-sm">Choose a photo to turn into a puzzle.</p>
      </div>

      <form onSubmit={handleGenerate} className="p-6 sm:p-8 flex flex-col gap-6 sm:gap-8">
        <div className="w-full">
          <label className="relative block group cursor-pointer w-full aspect-4/3">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className={`
              absolute inset-0 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 overflow-hidden
              ${previewUrl 
                 ? 'border-indigo-200 bg-slate-50' 
                 : 'border-slate-300 bg-slate-50 group-hover:bg-indigo-50/50 group-hover:border-indigo-400'}
            `}>
              {previewUrl ? (
                <>
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-contain p-2" 
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <span className="bg-white text-slate-800 px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                      <ImageIcon size={16} /> Change Photo
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center p-4 sm:p-6 transition-transform group-hover:scale-105">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 sm:mb-4 text-indigo-500">
                    <Upload size={24} className="sm:size-7" />
                  </div>
                  <h3 className="font-bold text-slate-700 mb-1 text-sm sm:text-base">Click to Upload</h3>
                  <p className="text-xs text-slate-400 font-medium">JPG, PNG up to 5MB</p>
                </div>
              )}
            </div>
          </label>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Diff size={16} className="text-indigo-500"/> Difficulty
            </label>
            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
              {gridSize} x {gridSize} Grid
            </span>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {[3, 4, 5, 6].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setGridSize(size)}
                className={`
                  py-3 rounded-xl font-bold text-sm transition-all border-2
                  ${gridSize === size 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200'}
                `}
              >
                {size}x{size}
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit"
          disabled={!selectedFile || isLoading}
          className={`
            w-full py-4 rounded-xl font-black text-lg text-white transition-all transform flex justify-center items-center gap-2
            ${selectedFile && !isLoading 
              ? 'bg-indigo-600 shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
          `}
        >
          {isLoading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              Generate Link 
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateForm;