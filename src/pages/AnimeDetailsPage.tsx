import React from 'react';
import { Play, Bookmark, ArrowLeft, Film, CheckCircle2, Star, Sparkles, Volume2, Globe } from 'lucide-react';
import { Anime, WatchProgress } from '../types/anime';
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

  // Find related seasons of the franchise
  const franchiseSeasons = catalog.filter(
    a => a.id.startsWith('solo-leveling') || (a.slug && a.slug.startsWith('solo-leveling'))
  );
  const isMultiSeason = franchiseSeasons.length > 1;

  // Recommendations: other seasons/series
  const relatedAnime = catalog.filter(a => a.id !== anime.id).slice(0, 4);

  return (
    <div className="pb-28 animate-in fade-in duration-500">
      {/* Cinematic Banner Backdrop with Extended Depth */}
      <div className="relative w-full h-[460px] sm:h-[540px] lg:h-[620px] bg-[#07090e] overflow-hidden">
        <img
          src={anime.bannerImage}
          alt={anime.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 filter brightness-90 contrast-105 transition-transform duration-1000"
        />
        {/* Deep Multi-Layered Vignette Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090e] via-[#07090e]/60 to-transparent w-full lg:w-3/4" />

        {/* Back Navigation Bar */}
        <div className="absolute top-8 left-4 sm:left-8 lg:left-12 z-20">
          <button
            onClick={onBack}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-black/60 hover:bg-black/90 text-slate-200 hover:text-white backdrop-blur-xl border border-white/10 shadow-lg transition-all text-xs font-semibold tracking-wide cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Browse</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout with Generous Spatial Hierarchy */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 -mt-44 sm:-mt-56 lg:-mt-64 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          {/* Left Column: Premium Poster Card with Soft Ambient Shadow */}
          <div className="w-56 sm:w-64 lg:w-80 shrink-0 mx-auto lg:mx-0">
            <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/5 transition-transform hover:scale-[1.01] duration-500">
              <img
                src={anime.posterImage}
                alt={anime.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Title, Metadata, Synopsis & Action Deck */}
          <div className="flex-1 space-y-6 text-left">
            {/* Origin & Japanese Kicker */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs md:text-sm font-mono tracking-widest text-blue-400 uppercase font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{anime.japaneseTitle}</span>
              </div>

              {/* Primary Title with High-Impact Display Typography */}
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] text-balance drop-shadow-sm">
                {anime.title}
              </h1>
            </div>

            {/* Unboxed Metadata Strip (Zero-Pill Aesthetic) */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 font-medium">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold font-mono">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{anime.score?.toFixed(1)}</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{anime.releaseYear}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400 font-semibold">{anime.status}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-200">{anime.rating}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{anime.totalEpisodes} Episodes</span>
              {anime.studio && (
                <>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-400">{anime.studio}</span>
                </>
              )}
            </div>

            {/* Genre Categorization */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold tracking-wider uppercase text-blue-300/90 font-mono">
              <span>{anime.genres.join('  ·  ')}</span>
            </div>

            {/* Audio & Subtitle Details Card with Obsidian Glass Texture */}
            <div className="p-4 sm:p-5 bg-white/[0.03] border border-white/[0.08] rounded-2xl backdrop-blur-xl max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="block font-bold text-white text-[11px] uppercase tracking-wider font-mono">Audio Tracks</span>
                  <span className="text-slate-300 leading-relaxed block">{anime.audioInfo}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="block font-bold text-white text-[11px] uppercase tracking-wider font-mono">Subtitles (Soft ESub)</span>
                  <span className="text-slate-300 leading-relaxed block">{anime.subtitleInfo}</span>
                </div>
              </div>
            </div>

            {/* Synopsis with Generous Leading and Readable Width */}
            <p className="text-base sm:text-lg text-slate-300/95 leading-[1.8] max-w-3xl font-normal text-pretty">
              {anime.synopsis}
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onPlay(anime, resumeEp)}
                className="primary-cta px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-blue-600/30 flex items-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap focus:ring-4 focus:ring-blue-400"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>{resumeEp > 1 ? `Resume Episode ${resumeEp}` : 'Watch Episode 1'}</span>
              </button>

              <button
                onClick={() => onToggleFavorite(anime.id)}
                className={`px-6 py-4 rounded-2xl border backdrop-blur-xl transition-all flex items-center gap-2.5 text-sm sm:text-base font-semibold cursor-pointer ${
                  isFavorite
                    ? 'bg-blue-500/20 border-blue-500/60 text-blue-300 shadow-lg shadow-blue-500/10'
                    : 'bg-white/[0.04] border-white/10 text-slate-200 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-blue-300' : ''}`} />
                <span>{isFavorite ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Episodes Section with Expansive Whitespace */}
        <section className="mt-20 lg:mt-28 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <Film className="w-5 h-5 text-blue-400" />
                <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                  Episodes
                </h2>
                <span className="text-xs font-mono text-slate-400 font-semibold">
                  ({anime.episodes.length} Episodes)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Stream in full 1080p Ultra HD with multi-track audio and English soft subtitles.
              </p>
            </div>

            {/* Franchise Season Switcher Tabs */}
            {isMultiSeason && (
              <div className="flex items-center gap-1.5 p-1.5 bg-white/[0.03] border border-white/[0.08] rounded-xl self-start sm:self-auto">
                {franchiseSeasons.map(s => {
                  const isActive = s.id === anime.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => onSelectAnime(s)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      {s.season || s.title}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Episode Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
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
                  className="group flex flex-col sm:flex-row gap-5 p-4 sm:p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500 rounded-2xl transition-all duration-300 cursor-pointer text-left shadow-sm hover:shadow-xl hover:-translate-y-0.5"
                >
                  {/* Episode Thumbnail */}
                  <div className="relative aspect-video sm:w-52 shrink-0 rounded-xl overflow-hidden bg-slate-950">
                    <img
                      src={ep.thumbnail || anime.bannerImage}
                      alt={ep.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="p-3 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-600/40 transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-4 h-4 fill-white translate-x-0.5" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm rounded font-mono text-[10px] font-semibold text-slate-200">
                      {ep.durationFormatted}
                    </div>

                    {/* Progress Bar */}
                    {epProgress && epProgress.percentage > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${epProgress.percentage}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Episode Info */}
                  <div className="flex-1 space-y-2 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold text-blue-400 font-mono tracking-wider">
                        EPISODE {ep.number}
                      </span>
                      {isFinished && (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Watched
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                      {ep.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed font-normal">
                      {ep.synopsis || anime.synopsis}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* More Like This / Complete Universe Section */}
        {relatedAnime.length > 0 && (
          <section className="mt-24 lg:mt-32 space-y-8">
            <div className="pb-4 border-b border-white/[0.08]">
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                Complete Collection
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Explore all seasons and storylines in the Solo Leveling anime franchise.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
