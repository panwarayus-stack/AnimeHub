import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Anime, WatchProgress } from '../types/anime';
import { AnimeCard } from './AnimeCard';

interface AnimeRowProps {
  title: string;
  subtitle?: string;
  animeList: Anime[];
  onSelect: (anime: Anime) => void;
  onPlay: (anime: Anime, episodeNumber?: number) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  getProgress: (animeId: string) => WatchProgress | null;
  onViewAll?: () => void;
}

export const AnimeRow: React.FC<AnimeRowProps> = ({
  title,
  subtitle,
  animeList,
  onSelect,
  onPlay,
  isFavorite,
  onToggleFavorite,
  getProgress,
  onViewAll
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!animeList || animeList.length === 0) return null;

  return (
    <section className="py-6">
      {/* Row Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white font-display">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors mr-2 cursor-pointer"
            >
              View All
            </button>
          )}

          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3"
      >
        {animeList.map(anime => (
          <div key={anime.id} className="w-[160px] sm:w-[190px] md:w-[210px] shrink-0">
            <AnimeCard
              anime={anime}
              onSelect={onSelect}
              onPlay={onPlay}
              isFavorite={isFavorite(anime.id)}
              onToggleFavorite={onToggleFavorite}
              progress={getProgress(anime.id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
