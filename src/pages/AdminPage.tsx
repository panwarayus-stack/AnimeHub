import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Plus,
  Trash2,
  Edit,
  FolderArchive,
  Cloud,
  Film,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Eye,
  LogOut,
  Sliders,
  Copy,
  Check,
  ListVideo
} from 'lucide-react';
import { Anime, Episode } from '../types/anime';
import {
  isAdminAuthenticated,
  adminLogin,
  adminLogout,
  changeAdminPasscode,
  upsertAnime,
  deleteAnime,
  addEpisodeToAnime,
  updateEpisodeInAnime,
  deleteEpisodeFromAnime,
  batchGenerateEpisodes,
  exportCatalogJson,
  importCatalogJson,
  resetCatalogToDefault
} from '../services/catalogManager';
import { getActiveCatalog, ALL_GENRES } from '../data/anime';
import {
  getCustomVideoBaseUrl,
  setCustomVideoBaseUrl,
  resetCustomVideoBaseUrl,
  resolveVideoUrl
} from '../services/video';
import { parseReleaseFilename, createAnimeFromRelease, ParsedReleaseInfo } from '../utils/zipParser';

// Placeholder banner
import fantasyBanner from '../assets/images/fantasy_sword_anime_1790840930951.jpg';

interface AdminPageProps {
  onBackToSite: () => void;
  onPreviewAnime: (anime: Anime) => void;
  onPlayEpisode: (anime: Anime, epNumber: number) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  onBackToSite,
  onPreviewAnime,
  onPlayEpisode
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'anime' | 'episodes' | 'zip' | 'settings'>('anime');
  const [catalog, setCatalog] = useState<Anime[]>([]);

  // Selection states
  const [selectedAnimeId, setSelectedAnimeId] = useState<string>('');
  const [editingAnime, setEditingAnime] = useState<Anime | null>(null);
  const [isAnimeModalOpen, setIsAnimeModalOpen] = useState(false);

  // Episode Editing state
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);

  // Batch Episode Generator state
  const [batchSeason, setBatchSeason] = useState(2);
  const [batchCount, setBatchCount] = useState(12);

  // Zip Sorter state
  const [zipInputFilename, setZipInputFilename] = useState('');
  const [zipEpCount, setZipEpCount] = useState(12);
  const [zipResultAnime, setZipResultAnime] = useState<Anime | null>(null);
  const [zipResultInfo, setZipResultInfo] = useState<ParsedReleaseInfo | null>(null);

  // Settings & Media Storage state
  const [mediaBaseUrl, setMediaBaseUrl] = useState('');
  const [mediaTestStatus, setMediaTestStatus] = useState<string>('');
  const [newPasscode, setNewPasscode] = useState('');
  const [passcodeSuccess, setPasscodeSuccess] = useState(false);
  const [jsonImportText, setJsonImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [copiedCatalog, setCopiedCatalog] = useState(false);

  // Google Drive Downloader state
  const [gdriveFileId, setGdriveFileId] = useState('14Oo0_LyWFvDeZTsR9KeMVGhwDu6Zb3YV');
  const [downloadStatus, setDownloadStatus] = useState<any>(null);
  const [triggeringDownload, setTriggeringDownload] = useState(false);

  // Reload catalog helper
  const refreshCatalog = () => {
    const list = getActiveCatalog();
    setCatalog(list);
    if (!selectedAnimeId && list.length > 0) {
      setSelectedAnimeId(list[0].id);
    }
  };

  // Poll Google Drive status
  useEffect(() => {
    let interval: any;
    if (activeTab === 'settings') {
      const fetchStatus = () => {
        fetch('/api/download-status')
          .then(res => res.json())
          .then(data => setDownloadStatus(data))
          .catch(err => console.log('Downloader endpoint not active:', err));
      };
      fetchStatus();
      interval = setInterval(fetchStatus, 3000);
    }
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleStartDownload = () => {
    setTriggeringDownload(true);
    fetch('/api/download-drive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId: gdriveFileId })
    })
      .then(res => res.json())
      .then(data => {
        setTriggeringDownload(false);
        // Refresh catalog in background after a few seconds
        setTimeout(refreshCatalog, 5000);
      })
      .catch(err => {
        setTriggeringDownload(false);
        console.error('Failed to start download:', err);
      });
  };

  useEffect(() => {
    refreshCatalog();
    setMediaBaseUrl(getCustomVideoBaseUrl());

    const handleAuthChange = () => {
      setIsAuthenticated(isAdminAuthenticated());
    };
    const handleCatalogUpdate = () => {
      refreshCatalog();
    };

    window.addEventListener('animehub:admin_auth_changed', handleAuthChange);
    window.addEventListener('animehub:catalog_updated', handleCatalogUpdate);
    return () => {
      window.removeEventListener('animehub:admin_auth_changed', handleAuthChange);
      window.removeEventListener('animehub:catalog_updated', handleCatalogUpdate);
    };
  }, []);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(passcodeInput)) {
      setIsAuthenticated(true);
      setAuthError('');
      setPasscodeInput('');
    } else {
      setAuthError('Incorrect passcode. Default is "admin123".');
    }
  };

  // If not authenticated, render Passcode Prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6 text-center">
          <div className="p-3.5 bg-blue-500/10 rounded-2xl w-14 h-14 mx-auto flex items-center justify-center text-blue-500">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white font-display">AnimeHub Admin Access</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Restricted management portal for adding videos, managing seasons, and configuring local / server streaming paths.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Security Passcode
              </label>
              <input
                type="password"
                value={passcodeInput}
                onChange={e => setPasscodeInput(e.target.value)}
                placeholder="Enter passcode (default: admin123)"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 font-mono"
                autoFocus
              />
              {authError && <p className="text-xs text-blue-400 mt-1.5">{authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-lg shadow-blue-600/20"
            >
              Authenticate &amp; Enter Admin Panel
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={onBackToSite}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Return to Streaming Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active selected anime
  const activeAnime = catalog.find(a => a.id === selectedAnimeId) || catalog[0] || null;

  // Save / Upsert Anime
  const handleSaveAnime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnime) return;

    upsertAnime(editingAnime);
    setIsAnimeModalOpen(false);
    setEditingAnime(null);
    refreshCatalog();
  };

  // Delete Anime
  const handleDeleteAnime = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}" and all its episodes?`)) {
      deleteAnime(id);
      refreshCatalog();
    }
  };

  // Episode Add / Update
  const handleSaveEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAnime || !editingEpisode) return;

    const exists = activeAnime.episodes.some(ep => ep.id === editingEpisode.id);
    if (exists) {
      updateEpisodeInAnime(activeAnime.id, editingEpisode);
    } else {
      addEpisodeToAnime(activeAnime.id, editingEpisode);
    }

    setIsEpisodeModalOpen(false);
    setEditingEpisode(null);
    refreshCatalog();
  };

  // Episode Delete
  const handleDeleteEpisode = (episodeId: string, epTitle: string) => {
    if (!activeAnime) return;
    if (window.confirm(`Delete ${epTitle}?`)) {
      deleteEpisodeFromAnime(activeAnime.id, episodeId);
      refreshCatalog();
    }
  };

  // Run Batch Episode Generation
  const handleRunBatchGenerate = () => {
    if (!activeAnime) return;
    if (
      window.confirm(
        `Generate ${batchCount} episodes for Season ${batchSeason} of "${activeAnime.title}"? This will set paths to /anime/${activeAnime.slug}/season${batchSeason}/episode-XX.mp4.`
      )
    ) {
      batchGenerateEpisodes(activeAnime.id, batchSeason, batchCount);
      refreshCatalog();
    }
  };

  // Run Zip Sorter
  const handleSortReleaseZip = () => {
    if (!zipInputFilename.trim()) return;

    const info = parseReleaseFilename(zipInputFilename.trim());
    setZipResultInfo(info);

    const generatedEpisodes = Array.from({ length: zipEpCount }, (_, i) => {
      const epNum = i + 1;
      const pad = String(epNum).padStart(2, '0');
      return {
        filename: `${info.title} S0${info.seasonNumber}E${pad} [${info.quality}].mp4`,
        episodeNumber: epNum,
        title: `Episode ${epNum}`,
        extension: 'mp4'
      };
    });

    const anime = createAnimeFromRelease(info, generatedEpisodes, fantasyBanner);
    setZipResultAnime(anime);
  };

  const handleCommitZipToCatalog = () => {
    if (!zipResultAnime) return;
    upsertAnime(zipResultAnime);
    setSelectedAnimeId(zipResultAnime.id);
    setActiveTab('episodes');
    setZipResultAnime(null);
    setZipResultInfo(null);
    setZipInputFilename('');
    refreshCatalog();
  };

  // Save Media Server URL
  const handleSaveMediaUrl = () => {
    setCustomVideoBaseUrl(mediaBaseUrl);
    setMediaTestStatus('Direct Media Base URL saved successfully.');
    setTimeout(() => setMediaTestStatus(''), 3000);
  };

  // Change passcode
  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscode.trim()) return;
    changeAdminPasscode(newPasscode);
    setNewPasscode('');
    setPasscodeSuccess(true);
    setTimeout(() => setPasscodeSuccess(false), 3000);
  };

  // Copy Catalog JSON
  const handleCopyCatalog = () => {
    navigator.clipboard.writeText(exportCatalogJson());
    setCopiedCatalog(true);
    setTimeout(() => setCopiedCatalog(false), 2000);
  };

  // Import Catalog JSON
  const handleImportJson = () => {
    if (!jsonImportText.trim()) return;
    const res = importCatalogJson(jsonImportText);
    if (res.success) {
      setImportStatus({ success: true, message: `Successfully imported ${res.count} anime titles!` });
      setJsonImportText('');
      refreshCatalog();
    } else {
      setImportStatus({ success: false, message: res.error || 'Failed to parse JSON.' });
    }
  };

  const totalEpisodesCount = catalog.reduce((acc, a) => acc + (a.episodes?.length || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Admin Top Dashboard Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white font-display">AnimeHub Admin Console</h1>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[11px] font-mono">
                Authenticated
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Hidden management panel · Not visible to public users
            </p>
          </div>
        </div>

        {/* Top metrics & actions */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden md:flex items-center gap-4 px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-slate-300">
            <span>
              <strong className="text-white">{catalog.length}</strong> Series
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>
              <strong className="text-blue-400">{totalEpisodesCount}</strong> Episodes
            </span>
          </div>

          <button
            onClick={onBackToSite}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>Viewer Site</span>
          </button>

          <button
            onClick={() => {
              adminLogout();
              setIsAuthenticated(false);
            }}
            className="px-3.5 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('anime')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'anime'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Anime Catalog ({catalog.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('episodes')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'episodes'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ListVideo className="w-4 h-4" />
          <span>Season &amp; Episode Manager</span>
        </button>

        <button
          onClick={() => setActiveTab('zip')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'zip'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FolderArchive className="w-4 h-4" />
          <span>Zip &amp; Release Auto-Sorter</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Direct Storage &amp; Backups</span>
        </button>
      </div>

      {/* TAB 1: ANIME CATALOG MANAGEMENT */}
      {activeTab === 'anime' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-display">Manage Anime Catalog</h2>
              <p className="text-xs text-slate-400">Add new series, edit titles, and organize poster art</p>
            </div>

            <button
              onClick={() => {
                setEditingAnime({
                  id: `anime-${Date.now()}`,
                  slug: 'new-series',
                  title: '',
                  japaneseTitle: '',
                  synopsis: '',
                  bannerImage: fantasyBanner,
                  posterImage: fantasyBanner,
                  genres: ['Action', 'Fantasy'],
                  status: 'Ongoing',
                  releaseYear: new Date().getFullYear(),
                  season: 'Season 1',
                  rating: 'TV-14',
                  score: 9.0,
                  studio: '',
                  audioInfo: 'Multi Audio (Japanese, English Dub)',
                  subtitleInfo: 'English (ESub)',
                  totalEpisodes: 0,
                  episodes: []
                });
                setIsAnimeModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-600/25"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Anime</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {catalog.map(anime => (
              <div
                key={anime.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4 space-y-3 flex flex-col justify-between shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={anime.posterImage || anime.bannerImage}
                    alt={anime.title}
                    className="w-16 h-22 object-cover rounded-lg bg-slate-950 border border-slate-800 shrink-0"
                  />
                  <div className="min-w-0 space-y-1 flex-1">
                    <span className="text-[10px] text-blue-400 font-mono tracking-wider block">
                      {anime.season || 'Season 1'} · {anime.releaseYear}
                    </span>
                    <h3 className="text-sm font-bold text-white truncate" title={anime.title}>
                      {anime.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate font-mono">
                      {anime.japaneseTitle}
                    </p>
                    <div className="text-[11px] text-slate-400 font-mono">
                      <span className="text-emerald-400 font-semibold">{anime.episodes.length}</span> episodes
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setSelectedAnimeId(anime.id);
                      setActiveTab('episodes');
                    }}
                    className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage Episodes</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingAnime({ ...anime });
                        setIsAnimeModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      title="Edit Anime Details"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAnime(anime.id, anime.title)}
                      className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Delete Anime"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SEASON & EPISODE MANAGER */}
      {activeTab === 'episodes' && (
        <div className="space-y-6">
          {/* Header & Anime Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-400">
                Selected Series for Episode Management:
              </label>
              <select
                value={activeAnime?.id || ''}
                onChange={e => setSelectedAnimeId(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-semibold focus:outline-none focus:border-blue-500"
              >
                {catalog.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.title} ({a.episodes.length} episodes)
                  </option>
                ))}
              </select>
            </div>

            {activeAnime && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPreviewAnime(activeAnime)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preview Page</span>
                </button>

                <button
                  onClick={() => {
                    const nextNum = (activeAnime.episodes.length || 0) + 1;
                    const pad = String(nextNum).padStart(2, '0');
                    setEditingEpisode({
                      id: `${activeAnime.id}-ep-${nextNum}`,
                      number: nextNum,
                      title: `Episode ${nextNum}`,
                      synopsis: '',
                      duration: 1440,
                      durationFormatted: '24m',
                      thumbnail: activeAnime.bannerImage,
                      videoUrl: `/anime/${activeAnime.slug}/season1/episode-${pad}.mp4`
                    });
                    setIsEpisodeModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Episode</span>
                </button>
              </div>
            )}
          </div>

          {/* Batch Generator Tool */}
          {activeAnime && (
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Batch Episode &amp; Season Generator</h3>
                  <p className="text-xs text-slate-400">
                    Quickly sets up sequential episode paths like{' '}
                    <code className="text-blue-300 font-mono text-[11px]">
                      /anime/{activeAnime.slug}/season{batchSeason}/episode-01.mp4
                    </code>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Season:</span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={batchSeason}
                    onChange={e => setBatchSeason(parseInt(e.target.value, 10) || 1)}
                    className="w-16 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-center"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Episode Count:</span>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={batchCount}
                    onChange={e => setBatchCount(parseInt(e.target.value, 10) || 1)}
                    className="w-20 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-center"
                  />
                </div>

                <button
                  onClick={handleRunBatchGenerate}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 font-semibold rounded-lg transition-colors cursor-pointer border border-blue-500/20"
                >
                  Generate {batchCount} Season {batchSeason} Episodes
                </button>
              </div>
            </div>
          )}

          {/* Episode List */}
          {activeAnime && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Total Episodes for {activeAnime.title}:{' '}
                  <strong className="text-white">{activeAnime.episodes.length}</strong>
                </span>
              </div>

              {activeAnime.episodes.length > 0 ? (
                <div className="space-y-2">
                  {activeAnime.episodes.map(ep => {
                    const resolved = resolveVideoUrl(ep.videoUrl);
                    return (
                      <div
                        key={ep.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <span className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs text-blue-400 shrink-0">
                            {ep.number}
                          </span>
                          <div className="min-w-0 space-y-0.5">
                            <h4 className="text-sm font-semibold text-white truncate">{ep.title}</h4>
                            <p className="text-xs text-slate-400 font-mono truncate" title={ep.videoUrl}>
                              Storage Path: <span className="text-slate-300">{ep.videoUrl}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                          <button
                            onClick={() => onPlayEpisode(activeAnime, ep.number)}
                            className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg transition-colors cursor-pointer font-medium"
                          >
                            Play
                          </button>
                          <button
                            onClick={() => {
                              setEditingEpisode({ ...ep });
                              setIsEpisodeModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                            title="Edit Episode"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEpisode(ep.id, ep.title)}
                            className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-800 transition-colors"
                            title="Delete Episode"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No episodes registered for this series yet. Add one or use the batch generator above.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ZIP & RELEASE AUTO-SORTER */}
      {activeTab === 'zip' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white font-display">Auto Episode &amp; Zip Sorter</h2>
            <p className="text-xs text-slate-400">
              Input anime community release filenames and automatically extract provider, title, season, and quality tags
            </p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Release Filename / Zip Archive Name:
              </label>
              <input
                type="text"
                value={zipInputFilename}
                onChange={e => setZipInputFilename(e.target.value)}
                placeholder="[Toonworld4all] Solo Leveling S02 1080p x265 10bit WEB-DL Multi Audio ESub.zip"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-blue-500"
              />
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="text-slate-500">Quick Fill:</span>
                <button
                  type="button"
                  onClick={() =>
                    setZipInputFilename(
                      '[Toonworld4all] Solo Leveling S02 1080p x265 10bit WEB-DL Multi Audio ESub.zip'
                    )
                  }
                  className="text-blue-400 hover:underline"
                >
                  Solo Leveling S02
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Number of episodes in release:</span>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={zipEpCount}
                  onChange={e => setZipEpCount(parseInt(e.target.value, 10) || 12)}
                  className="w-20 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-center"
                />
              </div>

              <button
                type="button"
                onClick={handleSortReleaseZip}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-md shadow-blue-600/20"
              >
                Parse &amp; Sort Release
              </button>
            </div>
          </div>

          {/* Sorter Result Preview */}
          {zipResultInfo && zipResultAnime && (
            <div className="p-5 bg-slate-900 border border-emerald-900/40 rounded-2xl space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Release Parsed Successfully</span>
                </div>
                <button
                  type="button"
                  onClick={handleCommitZipToCatalog}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  Commit &amp; Add to Live Catalog
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 block">Parsed Title</span>
                  <span className="font-bold text-white block">{zipResultInfo.title}</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 block">Season</span>
                  <span className="font-bold text-blue-400 font-mono block">
                    Season {zipResultInfo.seasonNumber}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 block">Quality</span>
                  <span className="font-bold text-white font-mono block">{zipResultInfo.quality}</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 block">Audio &amp; Sub</span>
                  <span className="font-bold text-slate-300 truncate block">
                    {zipResultInfo.audioInfo}
                  </span>
                </div>
              </div>

              {/* Episode paths preview */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-300">Target Folder Structure:</span>
                <div className="max-h-36 overflow-y-auto bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-[11px] text-slate-400 space-y-1">
                  {zipResultAnime.episodes.map(ep => (
                    <div key={ep.id} className="flex justify-between">
                      <span className="text-blue-400 font-semibold">Ep {ep.number}</span>
                      <span className="text-slate-300 truncate ml-3">{ep.videoUrl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SETTINGS & BACKUP */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white font-display">Storage &amp; Database Settings</h2>
            <p className="text-xs text-slate-400">Configure media streaming endpoints, export database backups, and manage security</p>
          </div>

          {/* Media Streaming Server Config */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Direct Media Storage &amp; Streaming Server Endpoint</h3>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Media Server Base URL (Leave empty for direct / local paths):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mediaBaseUrl}
                  onChange={e => setMediaBaseUrl(e.target.value)}
                  placeholder="https://media.yourdomain.com or http://localhost:8080"
                  className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleSaveMediaUrl}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Save URL
                </button>
              </div>
              {mediaTestStatus && <p className="text-xs text-emerald-400">{mediaTestStatus}</p>}
            </div>
          </div>

          {/* Google Drive Master Downloader & Real-time Progress */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Google Drive Master Downloader &amp; Extractor</h3>
            </div>

            <div className="space-y-3.5">
              <p className="text-xs text-slate-400 leading-relaxed">
                Download zip packages directly from Google Drive, extract episodes automatically into local storage, and organize them into folders.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Google Drive File ID or Share URL
                  </label>
                  <input
                    type="text"
                    value={gdriveFileId}
                    onChange={e => setGdriveFileId(e.target.value)}
                    placeholder="Enter File ID (e.g. 14Oo0_LyWFvDeZTsR9KeMVGhwDu6Zb3YV)"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="sm:self-end">
                  <button
                    type="button"
                    disabled={triggeringDownload || (downloadStatus && ['downloading', 'extracting'].includes(downloadStatus.stage))}
                    onClick={handleStartDownload}
                    className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {triggeringDownload ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Starting...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Start Downloader Process</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Real-time Status Card */}
              {downloadStatus && downloadStatus.stage !== 'idle' && (
                <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">
                      Downloader Stage:{' '}
                      <span className="text-blue-400 uppercase font-mono tracking-wider font-bold">
                        {downloadStatus.stage}
                      </span>
                    </span>
                    {downloadStatus.speed && (
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                        Speed: {downloadStatus.speed}
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="relative w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-300 ${
                        downloadStatus.stage === 'error'
                          ? 'bg-blue-600'
                          : downloadStatus.stage === 'ready'
                          ? 'bg-emerald-500'
                          : 'bg-blue-500 animate-pulse'
                      }`}
                      style={{ width: `${downloadStatus.percent || 0}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{downloadStatus.message}</span>
                    <span>{downloadStatus.percent || 0}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Backup & Restore Catalog JSON */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Catalog Backup &amp; Migration</h3>
                <p className="text-xs text-slate-400">
                  Export the active catalog to a JSON file or restore from a backup
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyCatalog}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {copiedCatalog ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCatalog ? 'Catalog Copied' : 'Copy Catalog JSON'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Import Catalog JSON (paste catalog string below):
              </label>
              <textarea
                rows={4}
                value={jsonImportText}
                onChange={e => setJsonImportText(e.target.value)}
                placeholder='[ { "id": "...", "title": "...", "episodes": [...] } ]'
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleImportJson}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Import &amp; Restore
                </button>

                {importStatus && (
                  <span
                    className={`text-xs ${
                      importStatus.success ? 'text-emerald-400' : 'text-blue-400'
                    }`}
                  >
                    {importStatus.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Change Security Passcode */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-white">Change Admin Security Passcode</h3>
            <form onSubmit={handleChangePasscode} className="flex gap-2 max-w-md">
              <input
                type="password"
                value={newPasscode}
                onChange={e => setNewPasscode(e.target.value)}
                placeholder="New passcode (e.g. MySecretPass!)"
                className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Update Passcode
              </button>
            </form>
            {passcodeSuccess && (
              <p className="text-xs text-emerald-400">Passcode updated successfully.</p>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT ANIME */}
      {isAnimeModalOpen && editingAnime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#11141d] border border-slate-800 rounded-2xl p-6 w-full max-w-xl shadow-2xl text-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingAnime.title ? 'Edit Anime' : 'Add New Anime'}
              </h3>
              <button
                onClick={() => setIsAnimeModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAnime} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Anime Title</label>
                <input
                  type="text"
                  required
                  value={editingAnime.title}
                  onChange={e => setEditingAnime({ ...editingAnime, title: e.target.value })}
                  placeholder="e.g. Solo Leveling Season 2"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Japanese / Original Title</label>
                <input
                  type="text"
                  value={editingAnime.japaneseTitle}
                  onChange={e => setEditingAnime({ ...editingAnime, japaneseTitle: e.target.value })}
                  placeholder="e.g. 俺だけレベルアップな件"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Synopsis</label>
                <textarea
                  rows={3}
                  value={editingAnime.synopsis}
                  onChange={e => setEditingAnime({ ...editingAnime, synopsis: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Season</label>
                  <input
                    type="text"
                    value={editingAnime.season || 'Season 1'}
                    onChange={e => setEditingAnime({ ...editingAnime, season: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Release Year</label>
                  <input
                    type="number"
                    value={editingAnime.releaseYear}
                    onChange={e =>
                      setEditingAnime({ ...editingAnime, releaseYear: parseInt(e.target.value, 10) || 2025 })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Audio Track Details</label>
                <input
                  type="text"
                  value={editingAnime.audioInfo}
                  onChange={e => setEditingAnime({ ...editingAnime, audioInfo: e.target.value })}
                  placeholder="e.g. Multi Audio (Japanese, English Dub, Hindi)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Subtitle Details</label>
                <input
                  type="text"
                  value={editingAnime.subtitleInfo}
                  onChange={e => setEditingAnime({ ...editingAnime, subtitleInfo: e.target.value })}
                  placeholder="e.g. English (ESub), Spanish, French"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAnimeModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg"
                >
                  Save Anime
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT EPISODE */}
      {isEpisodeModalOpen && editingEpisode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#11141d] border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl text-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingEpisode.title ? `Edit Episode ${editingEpisode.number}` : 'Add Episode'}
              </h3>
              <button
                onClick={() => setIsEpisodeModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEpisode} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Episode #</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editingEpisode.number}
                    onChange={e =>
                      setEditingEpisode({ ...editingEpisode, number: parseInt(e.target.value, 10) || 1 })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-slate-300 mb-1">Episode Title</label>
                  <input
                    type="text"
                    required
                    value={editingEpisode.title}
                    onChange={e => setEditingEpisode({ ...editingEpisode, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Video Storage Path / Direct Streaming URL
                </label>
                <input
                  type="text"
                  required
                  value={editingEpisode.videoUrl}
                  onChange={e => setEditingEpisode({ ...editingEpisode, videoUrl: e.target.value })}
                  placeholder="/anime/series-name/season1/episode-01.mp4"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Will be streamed from: {resolveVideoUrl(editingEpisode.videoUrl)}
                </p>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Episode Synopsis</label>
                <textarea
                  rows={2}
                  value={editingEpisode.synopsis || ''}
                  onChange={e => setEditingEpisode({ ...editingEpisode, synopsis: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEpisodeModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg"
                >
                  Save Episode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
