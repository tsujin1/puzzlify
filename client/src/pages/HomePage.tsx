import CreateForm from '../features/create/CreateForm';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center py-12 px-4 animate-in fade-in duration-700">
      <div className="mb-10 text-center transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600 drop-shadow-sm tracking-tight">
          Puzz<span className="font-light text-slate-800">lify</span>
        </h1>
        <p className="text-slate-500 font-medium mt-2 tracking-wide uppercase text-xs">The Modern Puzzle Engine</p>
      </div>
      <CreateForm />
    </div>
  );
};

export default HomePage;