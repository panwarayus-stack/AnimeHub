import React from 'react';
import { Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'lore' | 'ost' | 'library' | 'search' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-white/[0.08] bg-[#05070c] py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-2">
            <span className="font-display text-xl font-black tracking-tight text-white">
              Anime<span className="text-blue-500">Hub</span>
            </span>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              High-definition anime streaming with multi-audio and soft subtitles.
            </p>
          </div>

          {/* Clean Navigation Links */}
          <div className="flex items-center gap-6 text-xs font-semibold text-slate-300">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('library')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              My Library
            </button>
            <button
              onClick={() => onNavigate('search')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            <span>© {new Date().getFullYear()} AnimeHub. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('admin')}
              className="text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 cursor-pointer"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
