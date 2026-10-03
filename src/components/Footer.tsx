import React from 'react';
import { Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'browse' | 'genres' | 'library' | 'search' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-slate-850 bg-[#07090e] py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <span className="font-display text-xl font-bold tracking-tight text-white">
              Anime<span className="text-blue-500">Hub</span>
            </span>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A private anime streaming platform for family and friends. Streams authorized collections
              directly to client browsers and Smart TV devices with native high-definition video.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-slate-500">
              <span>Optimized for Mobile, Desktop &amp; Smart TV remote controls</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Featured &amp; Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('browse')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Popular &amp; Trending
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('genres')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Browse by Genre
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('library')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  My Library &amp; History
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} AnimeHub. Private hobby streaming.</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Direct Media Streaming</span>
            <span aria-hidden="true">·</span>
            {/* Discrete Admin Entry Point */}
            <button
              onClick={() => onNavigate('admin')}
              className="text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 cursor-pointer"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
