import React from 'react';
import { Home, Flame, Search, Bookmark, Tv } from 'lucide-react';

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
  favoritesCount,
  isTVMode,
  onToggleTVMode
}) => {
  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07090e]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 flex items-center justify-around shadow-2xl safe-area-pb"
    >
      <button
        onClick={() => onNavigate('home')}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
          currentTab === 'home' ? 'text-rose-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className={`w-5 h-5 transition-transform ${currentTab === 'home' ? 'scale-110' : ''}`} />
        <span className="text-[10px] mt-1 font-medium tracking-tight">Home</span>
      </button>

      <button
        onClick={() => onNavigate('browse')}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
          currentTab === 'browse' ? 'text-rose-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Flame className={`w-5 h-5 transition-transform ${currentTab === 'browse' ? 'scale-110' : ''}`} />
        <span className="text-[10px] mt-1 font-medium tracking-tight">Popular</span>
      </button>

      <button
        onClick={() => onNavigate('search')}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
          currentTab === 'search' ? 'text-rose-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Search className={`w-5 h-5 transition-transform ${currentTab === 'search' ? 'scale-110' : ''}`} />
        <span className="text-[10px] mt-1 font-medium tracking-tight">Search</span>
      </button>

      <button
        onClick={() => onNavigate('library')}
        className={`min-h-[44px] min-w-[44px] relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
          currentTab === 'library' ? 'text-rose-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Bookmark className={`w-5 h-5 transition-transform ${currentTab === 'library' ? 'scale-110' : ''}`} />
        <span className="text-[10px] mt-1 font-medium tracking-tight">Library</span>
        {favoritesCount > 0 && (
          <span className="absolute top-0.5 right-2 w-2 h-2 bg-rose-500 rounded-full" />
        )}
      </button>

      <button
        onClick={onToggleTVMode}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          isTVMode ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-slate-200'
        }`}
        title="Toggle Smart TV 10-foot UI"
      >
        <Tv className="w-5 h-5" />
        <span className="text-[10px] mt-1 font-medium tracking-tight">TV Mode</span>
      </button>
    </nav>
  );
};
