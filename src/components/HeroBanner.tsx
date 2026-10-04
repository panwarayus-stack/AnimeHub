import React, { useState, useEffect } from 'react';
import { Play, Info, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { Anime } from '../types/anime';

interface HeroBannerProps {
  featuredAnime: Anime[];
  onSelect: (anime: Anime) => void;
  onPlay: (anime: Anime, episodeNumber?: number) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  getResumeEpisodeNumber: (id: string) => number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredAnime,
  onSelect,
  onPlay,
  isFavorite,
  onToggleFavorite,
  getResumeEpisodeNumber
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate every 8 seconds if user doesn't interact
  useEffect(() => {
    if (featuredAnime.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featuredAnime.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredAnime.length]);

  if (!featuredAnime.length) return null;

  const currentAnime = featuredAnime[currentIndex];
  const resumeEp = getResumeEpisodeNumber(currentAnime.id);
  const isFav = isFavorite(currentAnime.id);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? featuredAnime.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % featuredAnime.length);
  };

  return (
    <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] overflow-hidden bg-slate-950">
      {/* Background Media with Gradient Scrim */}
      <div className="absolute inset-0">
        <img
          src={currentAnime.bannerImage}
          alt={currentAnime.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-all duration-700 transform scale-100"
        />
        {/* Measured dark scrim for high readability across all lighting conditions */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/70 to-[#090b10]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090b10] via-[#090b10]/80 to-transparent w-full md:w-3/4" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-14 sm:pb-16">
        <div className="max-w-2xl space-y-4">
          {/* Clean Unboxed Release Meta */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300">
            <span className="text-blue-400 font-bold uppercase">{currentAnime.rating || 'TV-MA'}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>1080p Ultra HD</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Multi Audio</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 font-semibold">ESub</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400 font-sans">{currentAnime.japaneseTitle}</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight text-balance drop-shadow-md">
            {currentAnime.title}
          </h1>

          {/* Unboxed Metadata Line */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
            <span className="font-mono text-emerald-400 font-bold tabular-nums">★ {currentAnime.score?.toFixed(1)}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{currentAnime.releaseYear}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{currentAnime.season || 'Season 1'}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{currentAnime.totalEpisodes} Episodes</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{currentAnime.genres.slice(0, 3).join(', ')}</span>
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed max-w-xl">
            {currentAnime.synopsis}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPlay(currentAnime, resumeEp)}
              className="primary-cta px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer whitespace-nowrap focus:ring-4 focus:ring-blue-400"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{resumeEp > 1 ? `Resume Ep ${resumeEp}` : 'Watch Episode 1'}</span>
            </button>

            <button
              onClick={() => onSelect(currentAnime)}
              className="px-5 py-3 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm rounded-xl border border-slate-700/80 backdrop-blur-md flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Info className="w-4 h-4 text-slate-400" />
              <span>Details</span>
            </button>

            <button
              onClick={() => onToggleFavorite(currentAnime.id)}
              className={`p-3 rounded-xl border backdrop-blur-md transition-colors cursor-pointer ${
                isFav
                  ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={isFav ? 'Remove from Watchlist' : 'Add to Watchlist'}
              aria-label={isFav ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Bookmark className={`w-4 h-4 ${isFav ? 'fill-blue-300' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Arrows & Dots */}
      {featuredAnime.length > 1 && (
        <div className="absolute bottom-6 right-6 sm:right-10 flex items-center gap-3 z-10">
          <button
            onClick={handlePrev}
            className="p-2 rounded-lg bg-black/50 hover:bg-black/80 text-white/80 hover:text-white border border-slate-800 backdrop-blur-sm transition-colors cursor-pointer"
            aria-label="Previous Featured Anime"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Indicators */}
          <div className="flex items-center gap-1.5">
            {featuredAnime.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === currentIndex ? 'w-6 bg-blue-500' : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2 rounded-lg bg-black/50 hover:bg-black/80 text-white/80 hover:text-white border border-slate-800 backdrop-blur-sm transition-colors cursor-pointer"
            aria-label="Next Featured Anime"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
