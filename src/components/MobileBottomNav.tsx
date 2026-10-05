import React from 'react';
import { Home, Search, Bookmark } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'home' | 'browse' | 'genres' | 'library' | 'search' | 'admin';
  onNavigate: (tab: 'home' | 'browse' | 'genres' | 'library' | 'search' | 'admin') => void;
  favoritesCount: number;
  isTVMode: boolean;
  onToggleTVMode: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onNavigate,
  favoritesCount
}) => {
  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07090e]/95 backdrop-blur-xl border-t border-white/[0.08] px-4 py-2 flex items-center justify-around shadow-2xl safe-area-pb"
    >
      <button
        onClick={() => onNavigate('home')}
        className={`min-h-[44px] min-w-[56px] flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
          currentTab === 'home' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className={`w-5 h-5 transition-transform ${currentTab === 'home' ? 'scale-110' : ''}`} />
        <span className="text-[11px] mt-1 font-semibold tracking-tight">Home</span>
      </button>

      <button
        onClick={() => onNavigate('search')}
        className={`min-h-[44px] min-w-[56px] flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
          currentTab === 'search' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Search className={`w-5 h-5 transition-transform ${currentTab === 'search' ? 'scale-110' : ''}`} />
        <span className="text-[11px] mt-1 font-semibold tracking-tight">Search</span>
      </button>

      <button
        onClick={() => onNavigate('library')}
        className={`min-h-[44px] min-w-[56px] relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
          currentTab === 'library' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Bookmark className={`w-5 h-5 transition-transform ${currentTab === 'library' ? 'scale-110' : ''}`} />
        <span className="text-[11px] mt-1 font-semibold tracking-tight">Library</span>
        {favoritesCount > 0 && (
          <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#07090e]" />
        )}
      </button>
    </nav>
  );
};
