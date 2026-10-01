import React from 'react';
import { Cloud, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'browse' | 'genres' | 'library' | 'search') => void;
  onOpenR2Modal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenR2Modal }) => {
  return (
    <footer className="mt-20 border-t border-slate-850 bg-[#07090e] py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <span className="font-display text-xl font-bold tracking-tight text-white">
              Anime<span className="text-rose-500">Hub</span>
            </span>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A private hobby streaming website built for family and friends. Streams authorized video collections
              directly from Cloudflare R2 to client browsers with zero server proxy latency.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-slate-500">
              <span>Ready for Vercel deployment &amp; custom EU.org domains</span>
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

          {/* Architecture & Settings */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Streaming Architecture</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decoupled video storage prevents Vercel bandwidth overuse.
            </p>
            <button
              onClick={onOpenR2Modal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors cursor-pointer"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Configure Cloudflare R2</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} AnimeHub. Made for personal hobby streaming.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Frontend on Vercel</span>
            <span aria-hidden="true">·</span>
            <span>Storage on Cloudflare R2</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
