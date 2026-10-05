import React, { useState } from 'react';
import { Search, Bookmark, Menu, X, ShieldCheck } from 'lucide-react';

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
  favoritesCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'browse' | 'genres' | 'library' | 'search' | 'admin') => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07090e]/95 backdrop-blur-md border-b border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center gap-10">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="font-display text-2xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
                Anime<span className="text-blue-500">Hub</span>
              </span>
            </button>

            {/* Clean Desktop Navigation Links (No empty genres or duplicate tabs) */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
              <button
                onClick={() => handleNavClick('home')}
                className={`transition-colors hover:text-white cursor-pointer ${
                  currentTab === 'home'
                    ? 'text-white border-b-2 border-blue-500 pb-0.5'
                    : 'text-slate-400'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleNavClick('library')}
                className={`transition-colors hover:text-white cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'library'
                    ? 'text-white border-b-2 border-blue-500 pb-0.5'
                    : 'text-slate-400'
                }`}
              >
                <span>My Library</span>
                {favoritesCount > 0 && (
                  <span className="text-[11px] font-mono text-blue-400 font-bold tabular-nums">
                    ({favoritesCount})
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Right Actions: Search & Watchlist */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => handleNavClick('search')}
              className={`p-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
                currentTab === 'search'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
              title="Search"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Quick Watchlist */}
            <button
              onClick={() => handleNavClick('library')}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors cursor-pointer"
              title="Watchlist"
              aria-label="Watchlist"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Admin Panel button - strictly only shown if admin is logged in */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
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
        <div className="md:hidden bg-[#0a0d14] border-b border-white/[0.08] px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              currentTab === 'home'
                ? 'bg-blue-600/20 text-blue-400 font-bold'
                : 'text-slate-300 hover:bg-white/[0.04]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick('library')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center justify-between ${
              currentTab === 'library'
                ? 'bg-blue-600/20 text-blue-400 font-bold'
                : 'text-slate-300 hover:bg-white/[0.04]'
            }`}
          >
            <span>My Library</span>
            {favoritesCount > 0 && (
              <span className="text-xs font-mono text-blue-400 font-bold">
                {favoritesCount} saved
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('search')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            Search
          </button>
        </div>
      )}
    </header>
  );
};
