import React from 'react';
import { Film, Swords, Music, Bookmark } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'home' | 'lore' | 'ost' | 'library' | 'search' | 'admin';
  onNavigate: (tab: 'home' | 'lore' | 'ost' | 'library' | 'search' | 'admin') => void;
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07090e]/95 backdrop-blur-xl border-t border-white/[0.08] px-2 py-2 flex items-center justify-around shadow-2xl safe-area-pb"
    >
      <button
        onClick={() => onNavigate('home')}
        className={`min-h-[44px] min-w-[56px] flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
          currentTab === 'home' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Film className={`w-4 h-4 transition-transform ${currentTab === 'home' ? 'scale-110 text-blue-400' : 'text-slate-500'}`} />
        <span className="text-[10px] mt-1 font-semibold tracking-tight">Episodes</span>
      </button>

      <button
        onClick={() => onNavigate('lore')}
        className={`min-h-[44px] min-w-[56px] flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
          currentTab === 'lore' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Swords className={`w-4 h-4 transition-transform ${currentTab === 'lore' ? 'scale-110 text-blue-400' : 'text-slate-500'}`} />
        <span className="text-[10px] mt-1 font-semibold tracking-tight">Lore</span>
      </button>

      <button
        onClick={() => onNavigate('ost')}
        className={`min-h-[44px] min-w-[56px] flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
          currentTab === 'ost' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Music className={`w-4 h-4 transition-transform ${currentTab === 'ost' ? 'scale-110 text-blue-400' : 'text-slate-500'}`} />
        <span className="text-[10px] mt-1 font-semibold tracking-tight">OST</span>
      </button>

      <button
        onClick={() => onNavigate('library')}
        className={`min-h-[44px] min-w-[56px] relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
          currentTab === 'library' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Bookmark className={`w-4 h-4 transition-transform ${currentTab === 'library' ? 'scale-110 text-blue-400' : 'text-slate-500'}`} />
        <span className="text-[10px] mt-1 font-semibold tracking-tight">Watchlist</span>
        {favoritesCount > 0 && (
          <span className="absolute top-1 right-2.5 w-1.5 h-1.5 rounded-full bg-blue-500 ring-2 ring-[#07090e]" />
        )}
      </button>
    </nav>
  );
};
