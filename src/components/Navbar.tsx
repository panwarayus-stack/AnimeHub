import React, { useState } from 'react';
import { Search, Bookmark, Menu, X, ShieldCheck, Swords, Music, Film } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'lore' | 'ost' | 'library' | 'search' | 'admin';
  onNavigate: (tab: 'home' | 'lore' | 'ost' | 'library' | 'search' | 'admin') => void;
  isAdmin: boolean;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  isAdmin,
  favoritesCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'lore' | 'ost' | 'library' | 'search' | 'admin') => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07090e]/95 backdrop-blur-md border-b border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Prestige Wordmark */}
          <div className="flex items-center gap-10">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="font-display text-2xl font-black tracking-tight text-white group-hover:text-blue-400 transition-all duration-350">
                Anime<span className="text-blue-500">Hub</span>
              </span>
            </button>

            {/* Clean, Focused Widescreen Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 text-xs font-bold tracking-widest uppercase text-slate-400">
              <button
                onClick={() => handleNavClick('home')}
                className={`transition-all duration-200 hover:text-white flex items-center gap-1.5 cursor-pointer pb-1 border-b-2 ${
                  currentTab === 'home'
                    ? 'text-white border-blue-500'
                    : 'border-transparent text-slate-400'
                }`}
              >
                <Film className="w-4 h-4 text-blue-400" />
                <span>Episodes</span>
              </button>

              <button
                onClick={() => handleNavClick('lore')}
                className={`transition-all duration-200 hover:text-white flex items-center gap-1.5 cursor-pointer pb-1 border-b-2 ${
                  currentTab === 'lore'
                    ? 'text-white border-blue-500'
                    : 'border-transparent text-slate-400'
                }`}
              >
                <Swords className="w-4 h-4 text-blue-400" />
                <span>Characters &amp; Lore</span>
              </button>

              <button
                onClick={() => handleNavClick('ost')}
                className={`transition-all duration-200 hover:text-white flex items-center gap-1.5 cursor-pointer pb-1 border-b-2 ${
                  currentTab === 'ost'
                    ? 'text-white border-blue-500'
                    : 'border-transparent text-slate-400'
                }`}
              >
                <Music className="w-4 h-4 text-blue-400" />
                <span>Soundtrack</span>
              </button>

              <button
                onClick={() => handleNavClick('library')}
                className={`transition-all duration-200 hover:text-white flex items-center gap-1.5 cursor-pointer pb-1 border-b-2 ${
                  currentTab === 'library'
                    ? 'text-white border-blue-500'
                    : 'border-transparent text-slate-400'
                }`}
              >
                <Bookmark className="w-4 h-4 text-blue-400" />
                <span>Watchlist</span>
                {favoritesCount > 0 && (
                  <span className="text-[10px] font-mono text-blue-400 font-bold tabular-nums bg-blue-500/10 border border-blue-500/30 px-1.5 py-0.5 rounded-full">
                    {favoritesCount}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Right Actions: Search & Quick Watchlist */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => handleNavClick('search')}
              className={`p-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
                currentTab === 'search'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
              title="Search"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Admin Panel Button */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                title="Admin Management Panel"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/[0.05] cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#07090e] border-b border-white/[0.08] px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer flex items-center gap-2 ${
              currentTab === 'home'
                ? 'bg-blue-600/20 text-blue-400 font-bold'
                : 'text-slate-300 hover:bg-white/[0.04]'
            }`}
          >
            <Film className="w-4 h-4 text-blue-400" />
            <span>Episodes</span>
          </button>

          <button
            onClick={() => handleNavClick('lore')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer flex items-center gap-2 ${
              currentTab === 'lore'
                ? 'bg-blue-600/20 text-blue-400 font-bold'
                : 'text-slate-300 hover:bg-white/[0.04]'
            }`}
          >
            <Swords className="w-4 h-4 text-blue-400" />
            <span>Characters &amp; Lore</span>
          </button>

          <button
            onClick={() => handleNavClick('ost')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer flex items-center gap-2 ${
              currentTab === 'ost'
                ? 'bg-blue-600/20 text-blue-400 font-bold'
                : 'text-slate-300 hover:bg-white/[0.04]'
            }`}
          >
            <Music className="w-4 h-4 text-blue-400" />
            <span>Soundtrack</span>
          </button>

          <button
            onClick={() => handleNavClick('library')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer flex items-center justify-between ${
              currentTab === 'library'
                ? 'bg-blue-600/20 text-blue-400 font-bold'
                : 'text-slate-300 hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-400" />
              <span>Watchlist</span>
            </div>
            {favoritesCount > 0 && (
              <span className="text-xs font-mono text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
