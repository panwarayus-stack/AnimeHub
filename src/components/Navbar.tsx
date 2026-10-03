import React, { useState } from 'react';
import { Search, Bookmark, Menu, X, ShieldCheck, Tv } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'browse' | 'genres' | 'library' | 'search' | 'admin';
  onNavigate: (tab: 'home' | 'browse' | 'genres' | 'library' | 'search' | 'admin', genre?: string) => void;
  isAdmin: boolean;
  favoritesCount: number;
  isTVMode: boolean;
  onToggleTVMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  isAdmin,
  favoritesCount,
  isTVMode,
  onToggleTVMode
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'browse' | 'genres' | 'library' | 'search' | 'admin') => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#05070c]/95 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="font-display text-2xl font-bold tracking-tight text-white group-hover:text-rose-400 transition-colors">
                Anime<span className="text-rose-500">Hub</span>
              </span>
            </button>

            {/* Zone 2: 4 clean text navigation links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
              <button
                onClick={() => handleNavClick('home')}
                className={`transition-colors hover:text-white cursor-pointer ${
                  currentTab === 'home'
                    ? 'text-white font-semibold border-b-2 border-rose-500 pb-0.5'
                    : 'text-slate-400'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('browse')}
                className={`transition-colors hover:text-white cursor-pointer ${
                  currentTab === 'browse'
                    ? 'text-white font-semibold border-b-2 border-rose-500 pb-0.5'
                    : 'text-slate-400'
                }`}
              >
                Popular &amp; Trending
              </button>
              <button
                onClick={() => handleNavClick('genres')}
                className={`transition-colors hover:text-white cursor-pointer ${
                  currentTab === 'genres'
                    ? 'text-white font-semibold border-b-2 border-rose-500 pb-0.5'
                    : 'text-slate-400'
                }`}
              >
                Genres
              </button>
              <button
                onClick={() => handleNavClick('library')}
                className={`transition-colors hover:text-white cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'library'
                    ? 'text-white font-semibold border-b-2 border-rose-500 pb-0.5'
                    : 'text-slate-400'
                }`}
              >
                <span>My Library</span>
                {favoritesCount > 0 && (
                  <span className="text-[11px] font-mono text-rose-400 font-bold tabular-nums">
                    ({favoritesCount})
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2.5">
            {/* TV Mode Toggle Button */}
            <button
              onClick={onToggleTVMode}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                isTVMode
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
              title={isTVMode ? 'TV Mode Active (D-Pad remote enabled)' : 'Enable Smart TV Mode'}
            >
              <Tv className="w-4 h-4" />
              <span className="hidden sm:inline font-mono text-[11px]">
                {isTVMode ? 'TV ON' : 'TV Mode'}
              </span>
            </button>

            {/* Search Button */}
            <button
              onClick={() => handleNavClick('search')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
                currentTab === 'search'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
              title="Search Anime"
              aria-label="Search Anime"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Quick Watchlist Shortcut */}
            <button
              onClick={() => handleNavClick('library')}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors cursor-pointer"
              title="Watchlist"
              aria-label="Watchlist"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Admin Panel button - strictly only shown if admin is logged in */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                title="Admin Management Panel"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/70 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800/80 space-y-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentTab === 'home' ? 'bg-rose-500/10 text-rose-400' : 'text-slate-300'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('browse')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentTab === 'browse' ? 'bg-rose-500/10 text-rose-400' : 'text-slate-300'
              }`}
            >
              Popular &amp; Trending
            </button>
            <button
              onClick={() => handleNavClick('genres')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentTab === 'genres' ? 'bg-rose-500/10 text-rose-400' : 'text-slate-300'
              }`}
            >
              Genres
            </button>
            <button
              onClick={() => handleNavClick('library')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                currentTab === 'library' ? 'bg-rose-500/10 text-rose-400' : 'text-slate-300'
              }`}
            >
              <span>My Library</span>
              {favoritesCount > 0 && (
                <span className="text-xs text-rose-400 font-mono">({favoritesCount})</span>
              )}
            </button>
            <button
              onClick={() => handleNavClick('search')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentTab === 'search' ? 'bg-rose-500/10 text-rose-400' : 'text-slate-300'
              }`}
            >
              Search Catalog
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onToggleTVMode();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-400 flex items-center gap-2"
            >
              <Tv className="w-4 h-4" />
              <span>{isTVMode ? 'Disable TV 10-Foot Mode' : 'Enable Smart TV 10-Foot Mode'}</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-400 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Console</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};



