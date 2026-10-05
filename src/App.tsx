/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AnimeDetailsPage } from './pages/AnimeDetailsPage';
import { WatchPage } from './pages/WatchPage';
import { SearchPage } from './pages/SearchPage';
import { LibraryPage } from './pages/LibraryPage';
import { AdminPage } from './pages/AdminPage';
import { LorePage } from './pages/LorePage';
import { OstPage } from './pages/OstPage';
import { MobileBottomNav } from './components/MobileBottomNav';

import { Anime } from './types/anime';
import { getAnimeById } from './data/anime';
import { useWatchHistory } from './hooks/useWatchHistory';
import { useFavorites } from './hooks/useFavorites';
import { useTVNavigation } from './hooks/useTVNavigation';
import { isAdminAuthenticated } from './services/catalogManager';

type ViewMode = 'home' | 'details' | 'watch' | 'library' | 'search' | 'admin' | 'lore' | 'ost';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [activeWatchAnime, setActiveWatchAnime] = useState<Anime | null>(null);
  const [activeEpisodeNumber, setActiveEpisodeNumber] = useState<number>(1);
  const [activeGenre, setActiveGenre] = useState<string>('All');
  const [isAdmin, setIsAdmin] = useState(isAdminAuthenticated());
  const [, setCatalogVersion] = useState(0);

  // Smart TV 10-Foot Mode & Remote Control Navigation Hook
  const { isTVMode, toggleTVMode } = useTVNavigation();

  // Watch History & Favorites Hooks
  const {
    history,
    saveProgress,
    getProgress,
    getResumeEpisodeNumber,
    removeFromHistory,
    clearHistory
  } = useWatchHistory();

  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();

  // Listen for catalog & auth updates and fetch backend DB
  useEffect(() => {
    // Sync catalog from server
    fetch('/api/catalog')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem('animehub_live_catalog_v3', JSON.stringify(data));
          window.dispatchEvent(new Event('animehub:catalog_updated'));
        }
      })
      .catch(err => console.log('Using local catalog cache:', err));

    const handleCatalogUpdate = () => {
      setCatalogVersion(v => v + 1);
    };
    const handleAuthUpdate = () => {
      setIsAdmin(isAdminAuthenticated());
    };
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        handleNavClick('admin');
      }
    };

    window.addEventListener('animehub:catalog_updated', handleCatalogUpdate);
    window.addEventListener('animehub:admin_auth_changed', handleAuthUpdate);
    window.addEventListener('keydown', handleGlobalKeys);
    return () => {
      window.removeEventListener('animehub:catalog_updated', handleCatalogUpdate);
      window.removeEventListener('animehub:admin_auth_changed', handleAuthUpdate);
      window.removeEventListener('keydown', handleGlobalKeys);
    };
  }, []);

  // Hash-based client router for browser Back/Forward and direct bookmarking
  const syncFromHash = useCallback(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) {
      setViewMode('home');
      setSelectedAnime(null);
      setActiveWatchAnime(null);
      return;
    }

    const [route, queryString] = hash.split('?');
    const params = new URLSearchParams(queryString || '');

    if (route === 'admin') {
      setViewMode('admin');
      setSelectedAnime(null);
      setActiveWatchAnime(null);
      return;
    }

    if (route === 'lore') {
      setViewMode('lore');
      setSelectedAnime(null);
      setActiveWatchAnime(null);
      return;
    }

    if (route === 'ost') {
      setViewMode('ost');
      setSelectedAnime(null);
      setActiveWatchAnime(null);
      return;
    }

    if (route === 'watch') {
      const animeId = params.get('id');
      const ep = parseInt(params.get('ep') || '1', 10);
      const found = animeId ? getAnimeById(animeId) : null;
      if (found) {
        setActiveWatchAnime(found);
        setActiveEpisodeNumber(isNaN(ep) ? 1 : ep);
        setViewMode('watch');
        return;
      }
    }

    if (route === 'anime') {
      const animeId = params.get('id');
      const found = animeId ? getAnimeById(animeId) : null;
      if (found) {
        setSelectedAnime(found);
        setViewMode('details');
        return;
      }
    }

    if (route === 'library') {
      setViewMode('library');
      return;
    }

    if (route === 'search') {
      const genre = params.get('genre') || 'All';
      setActiveGenre(genre);
      setViewMode('search');
      return;
    }

    setViewMode('home');
  }, []);

  useEffect(() => {
    // Clear stale watch hash on initial page load so reopening always opens to Home
    if (window.location.hash && window.location.hash.includes('watch')) {
      window.location.hash = '';
    }
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [syncFromHash]);

  // Navigation handlers
  type NavTab = 'home' | 'lore' | 'ost' | 'library' | 'search' | 'admin';

  const handleNavClick = (tab: NavTab) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedAnime(null);
    setActiveWatchAnime(null);

    if (tab === 'home') {
      window.location.hash = '';
      setViewMode('home');
    } else if (tab === 'lore') {
      window.location.hash = 'lore';
      setViewMode('lore');
    } else if (tab === 'ost') {
      window.location.hash = 'ost';
      setViewMode('ost');
    } else if (tab === 'library') {
      window.location.hash = 'library';
      setViewMode('library');
    } else if (tab === 'search') {
      window.location.hash = 'search';
      setViewMode('search');
    } else if (tab === 'admin') {
      window.location.hash = 'admin';
      setViewMode('admin');
    }
  };

  const handleSelectAnime = (anime: Anime) => {
    setSelectedAnime(anime);
    setViewMode('details');
    window.location.hash = `anime?id=${anime.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayAnime = (anime: Anime, episodeNumber?: number) => {
    const epNum = episodeNumber || getResumeEpisodeNumber(anime.id);
    setActiveWatchAnime(anime);
    setActiveEpisodeNumber(epNum);
    setViewMode('watch');
    window.location.hash = `watch?id=${anime.id}&ep=${epNum}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEpisodeChange = (newEpNumber: number) => {
    if (!activeWatchAnime) return;
    setActiveEpisodeNumber(newEpNumber);
    window.location.hash = `watch?id=${activeWatchAnime.id}&ep=${newEpNumber}`;
  };

  const handleBackToDetails = () => {
    if (activeWatchAnime) {
      setSelectedAnime(activeWatchAnime);
      setViewMode('details');
      window.location.hash = `anime?id=${activeWatchAnime.id}`;
    } else {
      handleNavClick('home');
    }
  };

  const getActiveTabForNavbar = (): NavTab => {
    if (viewMode === 'lore') return 'lore';
    if (viewMode === 'ost') return 'ost';
    if (viewMode === 'library') return 'library';
    if (viewMode === 'search') return 'search';
    if (viewMode === 'admin') return 'admin';
    return 'home';
  };

  // Saved resume time for current episode in watch player
  const currentEpisodeWatchProgress =
    activeWatchAnime
      ? getProgress(
          activeWatchAnime.id,
          activeWatchAnime.episodes.find(e => e.number === activeEpisodeNumber)?.id
        )
      : null;

  return (
    <div
      className={`min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white ${
        isTVMode ? 'tv-mode-active text-lg' : ''
      }`}
    >
      {/* Smart TV Remote Banner */}
      {isTVMode && (
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 border-b border-blue-800/40 text-center py-1.5 px-4 text-xs text-blue-300 font-mono flex items-center justify-center gap-2">
          <span>✦ Smart TV 10-Foot Mode Active</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Remote D-Pad Navigation Enabled (Arrow Keys + OK / Enter) ✦</span>
        </div>
      )}

      {/* 3-Zone Top Navigation */}
      <Navbar
        currentTab={getActiveTabForNavbar()}
        onNavigate={handleNavClick}
        isAdmin={isAdmin}
        favoritesCount={favoriteIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-0 bg-[#07090e]">
        {viewMode === 'home' && (
          <HomePage
            onSelectAnime={handleSelectAnime}
            onPlayAnime={handlePlayAnime}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            continueWatchingItems={history}
            onRemoveContinueWatching={removeFromHistory}
            getProgress={getProgress}
            getResumeEpisodeNumber={getResumeEpisodeNumber}
          />
        )}

        {viewMode === 'details' && selectedAnime && (
          <AnimeDetailsPage
            anime={selectedAnime}
            onBack={() => handleNavClick('home')}
            onPlay={handlePlayAnime}
            onSelectAnime={handleSelectAnime}
            isFavorite={isFavorite(selectedAnime.id)}
            onToggleFavorite={toggleFavorite}
            progress={getProgress(selectedAnime.id)}
            getAnimeProgress={getProgress}
            getResumeEpisodeNumber={getResumeEpisodeNumber}
          />
        )}

        {viewMode === 'watch' && activeWatchAnime && (
          <WatchPage
            anime={activeWatchAnime}
            episodeNumber={activeEpisodeNumber}
            onEpisodeChange={handleEpisodeChange}
            onBackToDetails={handleBackToDetails}
            onSaveProgress={saveProgress}
            initialTime={currentEpisodeWatchProgress ? currentEpisodeWatchProgress.currentTime : 0}
            isFavorite={isFavorite(activeWatchAnime.id)}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {viewMode === 'lore' && (
          <LorePage />
        )}

        {viewMode === 'ost' && (
          <OstPage />
        )}

        {viewMode === 'search' && (
          <SearchPage
            initialGenre={activeGenre}
            onSelectAnime={handleSelectAnime}
            onPlayAnime={handlePlayAnime}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            getProgress={getProgress}
          />
        )}

        {viewMode === 'library' && (
          <LibraryPage
            favoriteIds={favoriteIds}
            historyItems={history}
            onSelectAnime={handleSelectAnime}
            onPlayAnime={handlePlayAnime}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onRemoveHistoryItem={removeFromHistory}
            onClearHistory={clearHistory}
            getProgress={getProgress}
            onBrowse={() => handleNavClick('home')}
          />
        )}

        {viewMode === 'admin' && (
          <AdminPage
            onBackToSite={() => handleNavClick('home')}
            onPreviewAnime={handleSelectAnime}
            onPlayEpisode={handlePlayAnime}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <Footer
        onNavigate={handleNavClick}
      />

      {/* Mobile Bottom Navigation Bar (Hidden on desktop & TVs) */}
      <MobileBottomNav
        currentTab={getActiveTabForNavbar()}
        onNavigate={handleNavClick}
        favoritesCount={favoriteIds.length}
        isTVMode={isTVMode}
        onToggleTVMode={toggleTVMode}
      />
    </div>
  );
}
