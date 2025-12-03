import { Link } from 'react-router-dom';
import { Home, Terminal, FileText } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full overflow-hidden font-mono text-white flex items-center justify-center">
      <div className="relative z-10 text-center px-6">
        {/* 404 Title */}
        <h1 className="text-8xl sm:text-9xl font-bold text-[#E8B4A0] mb-4">
          404
        </h1>
        
        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Page Not Found
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Navigation Options */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/"
            className="flex items-center gap-2 px-5 py-3 bg-[#E8B4A0] text-[#1E1E1E] rounded-lg font-semibold hover:bg-[#d4a08c] transition-all hover:scale-105 active:scale-95"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <Link 
            to="/projects"
            className="flex items-center gap-2 px-5 py-3 bg-[#2DD4BF] text-[#1E1E1E] rounded-lg font-semibold hover:bg-[#5EEAD4] transition-all hover:scale-105 active:scale-95"
          >
            <Terminal size={18} />
            Projects
          </Link>
          <Link 
            to="/experience"
            className="flex items-center gap-2 px-5 py-3 bg-[#A855F7] text-white rounded-lg font-semibold hover:bg-[#C084FC] transition-all hover:scale-105 active:scale-95"
          >
            <FileText size={18} />
            Experience
          </Link>
        </div>
      </div>
    </div>
  );
}

