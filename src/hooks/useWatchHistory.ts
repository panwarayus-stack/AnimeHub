import { useState, useEffect, useCallback } from 'react';
import { Anime, Episode, WatchHistoryItem, WatchProgress } from '../types/anime';

const STORAGE_KEY = 'animehub_watch_history_v1';
const HISTORY_UPDATE_EVENT = 'animehub:history_updated';

export function useWatchHistory() {
  const [history, setHistory] = useState<WatchHistoryItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const reloadHistory = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setHistory(saved ? JSON.parse(saved) : []);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) reloadHistory();
    };
    const handleCustom = () => reloadHistory();

    window.addEventListener('storage', handleStorage);
    window.addEventListener(HISTORY_UPDATE_EVENT, handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(HISTORY_UPDATE_EVENT, handleCustom);
    };
  }, [reloadHistory]);

  const saveProgress = useCallback(
    (anime: Anime, episode: Episode, currentTime: number, duration: number) => {
      if (!anime || !episode || duration <= 0) return;

      const percentage = Math.min(100, Math.max(0, Math.round((currentTime / duration) * 100)));

      setHistory(prev => {
        const filtered = prev.filter(item => item.animeId !== anime.id);
        const newItem: WatchHistoryItem = {
          animeId: anime.id,
          episodeId: episode.id,
          episodeNumber: episode.number,
          currentTime: Math.floor(currentTime),
          duration: Math.floor(duration),
          percentage,
          lastWatchedAt: Date.now(),
          animeTitle: anime.title,
          animePoster: anime.posterImage,
          animeBanner: anime.bannerImage,
          episodeTitle: episode.title,
          totalEpisodes: anime.totalEpisodes
        };

        const updated = [newItem, ...filtered].slice(0, 30); // keep up to 30 items
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          window.dispatchEvent(new Event(HISTORY_UPDATE_EVENT));
        } catch {
          // Ignore quota errors
        }
        return updated;
      });
    },
    []
  );

  const getProgress = useCallback(
    (animeId: string, episodeId?: string): WatchProgress | null => {
      const found = history.find(h => h.animeId === animeId && (!episodeId || h.episodeId === episodeId));
      return found || null;
    },
    [history]
  );

  const getResumeEpisodeNumber = useCallback(
    (animeId: string): number => {
      const progress = history.find(h => h.animeId === animeId);
      return progress ? progress.episodeNumber : 1;
    },
    [history]
  );

  const removeFromHistory = useCallback((animeId: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.animeId !== animeId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event(HISTORY_UPDATE_EVENT));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
      window.dispatchEvent(new Event(HISTORY_UPDATE_EVENT));
    } catch {
      // Ignore
    }
  }, []);

  return {
    history,
    saveProgress,
    getProgress,
    getResumeEpisodeNumber,
    removeFromHistory,
    clearHistory
  };
}
