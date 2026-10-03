import React, { useState } from 'react';
import { Play, Bookmark, ArrowLeft, Clock, Film, CheckCircle2 } from 'lucide-react';
import { Anime, Episode, WatchProgress } from '../types/anime';
import { getActiveCatalog } from '../data/anime';
import { AnimeCard } from '../components/AnimeCard';

interface AnimeDetailsPageProps {
  anime: Anime;
  onBack: () => void;
  onPlay: (anime: Anime, episodeNumber?: number) => void;
  onSelectAnime: (anime: Anime) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  progress?: WatchProgress | null;
  getAnimeProgress: (id: string) => WatchProgress | null;
  getResumeEpisodeNumber: (id: string) => number;
}

export const AnimeDetailsPage: React.FC<AnimeDetailsPageProps> = ({
  anime,
  onBack,
  onPlay,
  onSelectAnime,
  isFavorite,
  onToggleFavorite,
  progress,
  getAnimeProgress,
  getResumeEpisodeNumber
}) => {
  const resumeEp = getResumeEpisodeNumber(anime.id);
  const catalog = getActiveCatalog();

  // Find related seasons of the same franchise (e.g. Solo Leveling Season 1 & 2)
  const franchiseSeasons = catalog.filter(
    a => a.id.startsWith('solo-leveling') || (a.slug && a.slug.startsWith('solo-leveling'))
  );
  const isMultiSeason = franchiseSeasons.length > 1 && (anime.id.startsWith('solo-leveling') || anime.slug.startsWith('solo-leveling'));

  // Recommendations: anime sharing at least one genre, excluding current
  const relatedAnime = catalog.filter(
    a => a.id !== anime.id && a.genres.some(g => anime.genres.includes(g))
  ).slice(0, 4);

  return (
    <div className="pb-16 animate-in fade-in duration-300">
      {/* Cinematic Banner Backdrop */}
      <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[480px] bg-slate-950 overflow-hidden">
        <img
          src={anime.bannerImage}
          alt={anime.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/80 to-black/40" />

        {/* Back navigation button */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-slate-700/60 transition-colors text-xs font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Browse</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 sm:-mt-44 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left Column: Poster Image */}
          <div className="w-48 sm:w-60 md:w-72 shrink-0 mx-auto md:mx-0">
            <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-800 shadow-2xl">
              <img
                src={anime.posterImage}
                alt={anime.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Title, Metadata, Synopsis & CTAs */}
          <div className="flex-1 space-y-4 text-left">
            {/* Japanese Title Kicker */}
            <div className="text-sm font-semibold tracking-wider text-rose-400 font-mono">
              {anime.japaneseTitle}
            </div>

            {/* Title */}
            <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {anime.title}
            </h1>

            {/* Unboxed Metadata (Zero-Pill Rule) */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium pt-1">
              <span className="font-mono text-emerald-400 font-semibold tabular-nums">★ {anime.score?.toFixed(1)}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{anime.releaseYear}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{anime.status}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{anime.rating}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{anime.totalEpisodes} Episodes</span>
              {anime.studio && (
                <>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-400">{anime.studio}</span>
                </>
              )}
            </div>

            {/* Genres unboxed with typographic slashes */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-rose-300 font-medium">
              <span>{anime.genres.join('  /  ')}</span>
            </div>

            {/* Audio & Subtitle Details */}
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Audio:</span>
                <span>{anime.audioInfo}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Subtitles:</span>
                <span>{anime.subtitleInfo}</span>
              </div>
            </div>

            {/* Synopsis */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              {anime.synopsis}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onPlay(anime, resumeEp)}
                className="px-7 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2.5 transition-all transform active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>{resumeEp > 1 ? `Resume Episode ${resumeEp}` : 'Watch Episode 1'}</span>
              </button>

              <button
                onClick={() => onToggleFavorite(anime.id)}
                className={`px-5 py-3.5 rounded-xl border backdrop-blur-md transition-colors flex items-center gap-2 text-sm font-medium cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-rose-300' : ''}`} />
                <span>{isFavorite ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Episodes Section */}
        <section className="mt-14 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
            <div className="flex items-center gap-3">
              <Film className="w-5 h-5 text-rose-500" />
              <h2 className="text-2xl font-bold text-white font-display">Episodes</h2>
              <span className="text-xs font-mono text-slate-400">
                ({anime.episodes.length} Available)
              </span>
            </div>

            {/* Franchise Season Switcher (e.g. Solo Leveling Season 1 vs Season 2) */}
            {isMultiSeason && (
              <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                {franchiseSeasons.map(s => {
                  const isActive = s.id === anime.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => onSelectAnime(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {s.season || s.title}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Episode Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anime.episodes.map(ep => {
              const epProgress = progress && progress.episodeId === ep.id ? progress : null;
              const isFinished = epProgress && epProgress.percentage > 90;

              return (
                <div
                  key={ep.id}
                  onClick={() => onPlay(anime, ep.number)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={e => {
                    if (e.key === 'Enter') onPlay(anime, ep.number);
                  }}
                  className="group flex flex-col sm:flex-row gap-4 p-3.5 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 focus:outline-none focus:ring-4 focus:ring-rose-500 focus:scale-[1.02] rounded-xl transition-all cursor-pointer text-left shadow-sm"
                >
                  {/* Episode Thumbnail */}
                  <div className="relative aspect-video sm:w-44 shrink-0 rounded-lg overflow-hidden bg-slate-950">
                    <img
                      src={ep.thumbnail || anime.bannerImage}
                      alt={ep.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="p-2.5 bg-rose-600 text-white rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 rounded text-[10px] font-mono text-slate-300">
                      {ep.durationFormatted}
                    </div>

                    {/* Progress Bar */}
                    {epProgress && epProgress.percentage > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                        <div
                          className="h-full bg-rose-500"
                          style={{ width: `${epProgress.percentage}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Episode Info */}
                  <div className="flex-1 space-y-1.5 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-rose-400 font-mono">
                        Episode {ep.number}
                      </span>
                      {isFinished && (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Watched
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-rose-400 transition-colors truncate">
                      {ep.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {ep.synopsis || anime.synopsis}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Related Anime Recommendations */}
        {relatedAnime.length > 0 && (
          <section className="mt-16 space-y-6">
            <h2 className="text-2xl font-bold text-white font-display pb-3 border-b border-slate-800">
              More Like This
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedAnime.map(rel => (
                <AnimeCard
                  key={rel.id}
                  anime={rel}
                  onSelect={onSelectAnime}
                  onPlay={onPlay}
                  isFavorite={false}
                  onToggleFavorite={onToggleFavorite}
                  progress={getAnimeProgress(rel.id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
