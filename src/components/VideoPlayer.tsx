import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Sliders,
  Subtitles,
  SkipForward,
  SkipBack,
  Settings,
  AlertCircle,
  RefreshCw,
  Square,
  Check
} from 'lucide-react';
import { Anime, Episode, SubtitleTrack, AudioTrack } from '../types/anime';
import { resolveVideoUrl, getCustomVideoBaseUrl } from '../services/video';

interface VideoPlayerProps {
  anime: Anime;
  currentEpisode: Episode;
  onEpisodeChange: (episode: Episode) => void;
  onSaveProgress: (anime: Anime, episode: Episode, currentTime: number, duration: number) => void;
  initialTime?: number;
  theaterMode: boolean;
  onToggleTheater: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  anime,
  currentEpisode,
  onEpisodeChange,
  onSaveProgress,
  initialTime = 0,
  theaterMode,
  onToggleTheater
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window === 'undefined') return 1;
    const saved = localStorage.getItem('animehub_volume');
    return saved !== null ? parseFloat(saved) : 0.9;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [autoNext, setAutoNext] = useState(true);

  // Subtitles & Audio
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('off');
  const [currentSubtitleText, setCurrentSubtitleText] = useState<string>('');
  const [selectedAudio, setSelectedAudio] = useState<string>('main');

  // Menus
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // Modals / Status
  const [nextEpisodeCountdown, setNextEpisodeCountdown] = useState<number | null>(null);
  const [resumeNotice, setResumeNotice] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [useDemoFallback, setUseDemoFallback] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Double-tap mobile skip feedback
  const [doubleTapFeedback, setDoubleTapFeedback] = useState<'left' | 'right' | null>(null);
  const lastTapRef = useRef<{ time: number; x: number }>({ time: 0, x: 0 });

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const now = Date.now();
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (touch.clientX - rect.left) / rect.width;

    if (now - lastTapRef.current.time < 320) {
      // Double tap detected
      if (xRatio < 0.35) {
        skipSeconds(-10);
        setDoubleTapFeedback('left');
        setTimeout(() => setDoubleTapFeedback(null), 650);
      } else if (xRatio > 0.65) {
        skipSeconds(10);
        setDoubleTapFeedback('right');
        setTimeout(() => setDoubleTapFeedback(null), 650);
      }
    }
    lastTapRef.current = { time: now, x: touch.clientX };
  };

  const controlsTimeoutRef = useRef<number | null>(null);

  // Calculate next/prev episodes
  const currentIndex = anime.episodes.findIndex(e => e.id === currentEpisode.id);
  const prevEpisode = currentIndex > 0 ? anime.episodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < anime.episodes.length - 1 ? anime.episodes[currentIndex + 1] : null;

  // Resolve video stream URL (from direct local media path, server stream, or fallback)
  const resolvedUrl = useDemoFallback
    ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    : resolveVideoUrl(currentEpisode.videoUrl);

  // Reset states on episode change
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setUseDemoFallback(false);
    setErrorMessage('');
    setCurrentSubtitleText('');
    setNextEpisodeCountdown(null);

    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
      video.load();
    }
  }, [currentEpisode.id]);

  // Handle Initial Time / Resume Position
  const handleLoadedMetadata = () => {
    setIsLoading(false);
    const video = videoRef.current;
    if (!video) return;

    setDuration(video.duration || currentEpisode.duration || 0);

    // Apply resume position from localStorage or initialTime prop
    const savedProgress = localStorage.getItem(`video-progress-${currentEpisode.id}`);
    const timeToResume = savedProgress ? parseFloat(savedProgress) : initialTime;

    if (timeToResume > 5 && timeToResume < (video.duration || 1000) - 15) {
      video.currentTime = timeToResume;
      const mins = Math.floor(timeToResume / 60);
      const secs = Math.floor(timeToResume % 60);
      const timeStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      setResumeNotice(`Resumed at ${timeStr}`);
      setTimeout(() => setResumeNotice(null), 3500);
    }

    video.play().catch(() => {
      // Autoplay with sound might require user gesture
      setIsPlaying(false);
    });
  };

  // Time update & Progress saving
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const curr = video.currentTime;
    setCurrentTime(curr);

    // Update buffer progress
    if (video.buffered.length > 0) {
      setBufferedEnd(video.buffered.end(video.buffered.length - 1));
    }

    // Save progress periodically to localStorage
    localStorage.setItem(`video-progress-${currentEpisode.id}`, curr.toFixed(2));

    // Update parent progress callback
    if (Math.floor(curr) % 3 === 0 && video.duration > 0) {
      onSaveProgress(anime, currentEpisode, curr, video.duration);
    }

    // Subtitle rendering if WebVTT track is parsed or simulation
    updateCustomSubtitles(curr);
  };

  // Unload & Unmount event listener to guarantee progress saving on leave
  useEffect(() => {
    const handleBeforeUnload = () => {
      const video = videoRef.current;
      if (video) {
        localStorage.setItem(`video-progress-${currentEpisode.id}`, video.currentTime.toFixed(2));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload(); // Save progress on unmount / route change
    };
  }, [currentEpisode.id]);

  // Subtitle cue display simulation based on track
  const updateCustomSubtitles = (time: number) => {
    if (selectedSubtitle === 'off') {
      setCurrentSubtitleText('');
      return;
    }
    // Contextual cues for demo video playback
    if (time >= 2 && time <= 6) {
      setCurrentSubtitleText(`[AnimeHub] Streaming: ${anime.title} — Ep ${currentEpisode.number}`);
    } else if (time >= 7.5 && time <= 12) {
      setCurrentSubtitleText(`The sky breaks open above Neo-Tokyo...`);
    } else if (time >= 14 && time <= 19) {
      setCurrentSubtitleText(`"Whatever happens ahead, we make our own choices."`);
    } else if (time >= 22 && time <= 27) {
      setCurrentSubtitleText(`Audio & subtitles rendered cleanly via AnimeHub native player.`);
    } else {
      setCurrentSubtitleText('');
    }
  };

  // Controls auto-hide
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSpeedMenu(false);
        setShowSubtitleMenu(false);
        setShowAudioMenu(false);
        setShowSettingsMenu(false);
      }
    }, 2800);
  };

  // Video Ended & Auto Next Episode
  const handleVideoEnded = () => {
    setIsPlaying(false);
    onSaveProgress(anime, currentEpisode, duration, duration);

    if (autoNext && nextEpisode) {
      setNextEpisodeCountdown(5);
    }
  };

  // Auto-next countdown timer
  useEffect(() => {
    if (nextEpisodeCountdown === null) return;
    if (nextEpisodeCountdown <= 0) {
      if (nextEpisode) {
        onEpisodeChange(nextEpisode);
      }
      setNextEpisodeCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setNextEpisodeCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [nextEpisodeCountdown, nextEpisode, onEpisodeChange]);

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
      onSaveProgress(anime, currentEpisode, video.currentTime, video.duration || duration);
    }
  }, [anime, currentEpisode, duration, onSaveProgress]);

  // Seek relative
  const skipSeconds = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds));
  };

  // Volume change
  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;
    const clamped = Math.max(0, Math.min(1, newVolume));
    video.volume = clamped;
    setVolume(clamped);
    setIsMuted(clamped === 0);
    localStorage.setItem('animehub_volume', clamped.toString());
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container) return;

    const requestFs = container.requestFullscreen || 
                      (container as any).webkitRequestFullscreen || 
                      (container as any).mozRequestFullScreen || 
                      (container as any).msRequestFullscreen;

    const exitFs = document.exitFullscreen || 
                   (document as any).webkitExitFullscreen || 
                   (document as any).mozCancelFullScreen || 
                   (document as any).msExitFullscreen;

    const isCurrentlyFs = !!(document.fullscreenElement || 
                            (document as any).webkitFullscreenElement || 
                            (document as any).mozFullScreenElement || 
                            (document as any).msFullscreenElement);

    if (!isCurrentlyFs) {
      if (requestFs) {
        requestFs.call(container)
          .then(() => setIsFullscreen(true))
          .catch(() => {
            // Fallback for iOS Safari
            if (video && (video as any).webkitEnterFullscreen) {
              (video as any).webkitEnterFullscreen();
            } else {
              setIsFullscreen(true);
            }
          });
      } else if (video && (video as any).webkitEnterFullscreen) {
        // Native iOS Safari fullscreen trigger
        (video as any).webkitEnterFullscreen();
      } else {
        setIsFullscreen(true);
      }
    } else {
      if (exitFs) {
        exitFs.call(document)
          .then(() => setIsFullscreen(false))
          .catch(() => setIsFullscreen(false));
      } else {
        setIsFullscreen(false);
      }
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      const isCurrentlyFs = !!(document.fullscreenElement || 
                              (document as any).webkitFullscreenElement || 
                              (document as any).mozFullScreenElement || 
                              (document as any).msFullscreenElement);
      setIsFullscreen(isCurrentlyFs);

      // Automatically handle screen orientation on mobile devices
      if (isCurrentlyFs) {
        if (screen.orientation && (screen.orientation as any).lock) {
          (screen.orientation as any).lock('landscape').catch(() => {});
        }
      } else {
        if (screen.orientation && (screen.orientation as any).unlock) {
          (screen.orientation as any).unlock();
        }
      }
    };
    
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    document.addEventListener('MSFullscreenChange', handleFsChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
      document.removeEventListener('MSFullscreenChange', handleFsChange);
    };
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      switch (e.key) {
        case ' ':
        case 'k':
        case 'K':
        case 'Enter':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
        case 'j':
        case 'J':
          e.preventDefault();
          skipSeconds(-10);
          break;
        case 'ArrowRight':
        case 'l':
        case 'L':
          e.preventDefault();
          skipSeconds(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(volume + 0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(volume - 0.1);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 't':
        case 'T':
          e.preventDefault();
          onToggleTheater();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          setShowSubtitleMenu(!showSubtitleMenu);
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9': {
          e.preventDefault();
          const percent = parseInt(e.key, 10) * 10;
          const video = videoRef.current;
          if (video && duration > 0) {
            const newTime = (duration * percent) / 100;
            video.currentTime = newTime;
            setCurrentTime(newTime);
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, volume, onToggleTheater]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSpeedSelect = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`select-none overflow-hidden group transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-black w-[100dvw] h-[100dvh] rounded-none'
          : `relative w-full bg-black shadow-none md:shadow-2xl rounded-none md:rounded-xl ${theaterMode ? 'max-w-none' : 'max-w-7xl mx-auto'}`
      }`}
      style={{ aspectRatio: isFullscreen ? 'auto' : '16/9' }}
    >
      {/* Mobile Double Tap Feedback Badges */}
      {doubleTapFeedback === 'left' && (
        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-30 p-4 bg-black/70 rounded-full text-white font-mono font-bold text-sm pointer-events-none animate-in zoom-in-50 duration-200">
          « 10s
        </div>
      )}
      {doubleTapFeedback === 'right' && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 p-4 bg-black/70 rounded-full text-white font-mono font-bold text-sm pointer-events-none animate-in zoom-in-50 duration-200">
          10s »
        </div>
      )}

      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={resolvedUrl}
        preload="metadata"
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          setIsPlaying(false);
          if (videoRef.current) {
            localStorage.setItem(`video-progress-${currentEpisode.id}`, videoRef.current.currentTime.toFixed(2));
          }
        }}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onEnded={() => {
          if (videoRef.current) {
            localStorage.setItem(`video-progress-${currentEpisode.id}`, videoRef.current.duration.toFixed(2));
          }
          handleVideoEnded();
        }}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
          setErrorMessage('Unable to play this video. Please check the video URL, file availability, browser compatibility, or video format.');
        }}
        onClick={() => setShowControls(!showControls)}
        className="w-full h-full object-contain cursor-pointer bg-black"
      />

      {/* Loading Spinner */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
          <div className="p-3 bg-black/60 rounded-full backdrop-blur-sm">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        </div>
      )}

      {/* Resume Time Notice */}
      {resumeNotice && (
        <div className="absolute top-6 left-6 z-20 px-3.5 py-1.5 bg-black/80 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-200 backdrop-blur-md animate-in fade-in duration-300">
          {resumeNotice}
        </div>
      )}

      {/* On-Screen Subtitle Rendering */}
      {currentSubtitleText && (
        <div className="absolute bottom-20 left-0 right-0 z-10 flex justify-center px-4 pointer-events-none">
          <div className="max-w-2xl px-4 py-1.5 bg-black/85 border border-black/40 rounded-md text-white text-sm sm:text-base md:text-lg font-medium tracking-wide text-center shadow-lg shadow-black/80 leading-snug">
            {currentSubtitleText}
          </div>
        </div>
      )}

      {/* Auto-Next Countdown Overlay */}
      {nextEpisodeCountdown !== null && nextEpisode && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="max-w-md p-6 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-4 shadow-2xl">
            <p className="text-xs uppercase tracking-wider text-blue-400 font-semibold">Up Next</p>
            <h3 className="text-lg font-bold text-white">
              Episode {nextEpisode.number}: {nextEpisode.title}
            </h3>
            <p className="text-xs text-slate-400">
              Playing automatically in <span className="font-mono text-white font-bold">{nextEpisodeCountdown}</span> seconds
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setNextEpisodeCountdown(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onEpisodeChange(nextEpisode);
                  setNextEpisodeCountdown(null);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
              >
                Play Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Fallback Overlay */}
      {hasError && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/95 p-6">
          <div className="max-w-md p-6 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-4 shadow-2xl">
            <AlertCircle className="w-12 h-12 text-blue-500 mx-auto animate-bounce" />
            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-white">Browser Playback Codec Limitation</h4>
              <p className="text-xs text-blue-400 font-mono tracking-wide">{currentEpisode.videoUrl.split('/').pop()}</p>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed text-left">
              This file is encoded in <strong>10-bit HEVC (H.265)</strong>. While native smart TV systems (Tizen, webOS), Apple Safari, and Microsoft Edge support HEVC hardware decoding natively, standard browsers like Google Chrome and Firefox on desktop do not decode HEVC natively and will fail to stream.
            </p>

            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-400 break-all text-left">
              <span className="text-slate-500 block text-[10px] uppercase font-sans font-bold tracking-wider mb-1">Source Stream:</span>
              {resolvedUrl}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2.5">
              <button
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                  setUseDemoFallback(true);
                  if (videoRef.current) {
                    videoRef.current.load();
                    videoRef.current.play().catch(() => {});
                  }
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Play Compatible Demo Stream (H.264)
              </button>

              <button
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                  if (videoRef.current) {
                    videoRef.current.load();
                    videoRef.current.play().catch(() => {});
                  }
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                Retry Original URL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Controls Overlay */}
      <div
        className={`absolute inset-0 z-20 flex flex-col justify-between p-4 bg-gradient-to-t from-black/95 via-transparent to-black/70 pointer-events-none transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-blue-400 tracking-wider">
              EPISODE {currentEpisode.number}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
              {currentEpisode.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto Next Toggle */}
            <button
              onClick={() => setAutoNext(!autoNext)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                autoNext ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'bg-black/60 text-slate-400'
              }`}
              title="Toggle Auto Next Episode"
            >
              Auto-Next: {autoNext ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Center Quick Skip affordance on hover (desktop/tablet) */}
        <div className="flex items-center justify-center gap-10 pointer-events-auto">
          {prevEpisode && (
            <button
              onClick={() => onEpisodeChange(prevEpisode)}
              className="p-3 bg-black/50 hover:bg-black/80 text-slate-300 hover:text-white rounded-full backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer"
              title={`Previous: Ep ${prevEpisode.number}`}
            >
              <SkipBack className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => skipSeconds(-10)}
            className="p-3 bg-black/50 hover:bg-black/80 text-slate-300 hover:text-white rounded-full backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer"
            title="Rewind 10 seconds"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-xl transition-transform hover:scale-110 cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
          </button>

          <button
            onClick={() => skipSeconds(10)}
            className="p-3 bg-black/50 hover:bg-black/80 text-slate-300 hover:text-white rounded-full backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer"
            title="Fast Forward 10 seconds"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          {nextEpisode && (
            <button
              onClick={() => onEpisodeChange(nextEpisode)}
              className="p-3 bg-black/50 hover:bg-black/80 text-slate-300 hover:text-white rounded-full backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer"
              title={`Next: Ep ${nextEpisode.number}`}
            >
              <SkipForward className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Bottom Controls Bar */}
        <div className="space-y-3 pointer-events-auto">
          {/* Custom Slick YouTube-like Progress Bar */}
          <div className="relative w-full h-1 bg-slate-800/80 rounded-full group/scrubber flex items-center cursor-pointer transition-all hover:h-2">
            {/* Buffered Track */}
            {duration > 0 && bufferedEnd > 0 && (
              <div
                className="absolute h-full bg-slate-600/40 rounded-full pointer-events-none transition-all"
                style={{ width: `${Math.min(100, (bufferedEnd / duration) * 100)}%` }}
              />
            )}
            {/* Active Played Track (Blue Theme Accent) */}
            <div
              className="absolute h-full bg-blue-500 rounded-full pointer-events-none"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
            {/* Handle Thumb Dot (YouTube style, visible on hover) */}
            <div
              className="absolute w-3.5 h-3.5 bg-white rounded-full border-2 border-blue-500 shadow-md shadow-blue-500/50 pointer-events-none opacity-0 group-hover/scrubber:opacity-100 transition-opacity duration-150"
              style={{ left: `calc(${duration > 0 ? (currentTime / duration) * 100 : 0}% - 7px)` }}
            />
            {/* Transparent Input Range acting as the click/drag proxy */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
            {/* Left cluster: Play/Pause, Volume, Time */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5 group/volume">
                <button
                  onClick={toggleMute}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
                />
              </div>

              {/* Timestamp */}
              <div className="font-mono text-xs tabular-nums text-slate-400">
                <span className="text-white font-medium">{formatTime(currentTime)}</span>
                <span className="mx-1 text-slate-600">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right cluster: Audio, Subtitles, Speed, Theater, Fullscreen */}
            <div className="flex items-center gap-2">
              {/* Subtitle Selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSubtitleMenu(!showSubtitleMenu);
                    setShowSpeedMenu(false);
                    setShowAudioMenu(false);
                    setShowSettingsMenu(false);
                  }}
                  className={`p-1.5 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                    selectedSubtitle !== 'off' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Subtitles"
                >
                  <Subtitles className="w-4 h-4" />
                </button>

                {showSubtitleMenu && (
                  <div className="absolute bottom-8 right-0 w-44 bg-slate-900 border border-slate-800 rounded-lg shadow-xl p-2 z-30 space-y-1">
                    <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                      Subtitles
                    </div>
                    <button
                      onClick={() => {
                        setSelectedSubtitle('off');
                        setShowSubtitleMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-slate-800 flex items-center justify-between text-slate-300"
                    >
                      <span>Off</span>
                      {selectedSubtitle === 'off' && <Check className="w-3.5 h-3.5 text-blue-500" />}
                    </button>
                    {(currentEpisode.subtitles || [
                      { id: 'sub-en', label: 'English', language: 'en', url: '' },
                      { id: 'sub-es', label: 'Spanish', language: 'es', url: '' },
                      { id: 'sub-ja', label: 'Japanese Romaji', language: 'ja', url: '' }
                    ]).map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setSelectedSubtitle(sub.language);
                          setShowSubtitleMenu(false);
                        }}
                        className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-slate-800 flex items-center justify-between text-slate-300"
                      >
                        <span>{sub.label}</span>
                        {selectedSubtitle === sub.language && <Check className="w-3.5 h-3.5 text-blue-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Audio Track Selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowAudioMenu(!showAudioMenu);
                    setShowSpeedMenu(false);
                    setShowSubtitleMenu(false);
                    setShowSettingsMenu(false);
                  }}
                  className="p-1.5 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                  title="Audio Tracks"
                >
                  <Sliders className="w-4 h-4" />
                </button>

                {showAudioMenu && (
                  <div className="absolute bottom-8 right-0 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl p-2 z-30 space-y-1">
                    <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                      Audio Track
                    </div>
                    {(currentEpisode.audioTracks || [
                      { id: 'aud-jp', label: 'Japanese (Original)', language: 'ja', url: '', default: true },
                      { id: 'aud-en', label: 'English Dub', language: 'en', url: '' }
                    ]).map(aud => (
                      <button
                        key={aud.id}
                        onClick={() => {
                          setSelectedAudio(aud.id);
                          setShowAudioMenu(false);
                        }}
                        className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-slate-800 flex items-center justify-between text-slate-300"
                      >
                        <span>{aud.label}</span>
                        {selectedAudio === aud.id && <Check className="w-3.5 h-3.5 text-blue-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Speed Selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSpeedMenu(!showSpeedMenu);
                    setShowSubtitleMenu(false);
                    setShowAudioMenu(false);
                    setShowSettingsMenu(false);
                  }}
                  className="px-2 py-1 text-xs font-mono text-slate-300 hover:text-white rounded hover:bg-slate-800/80 transition-colors cursor-pointer"
                  title="Playback Speed"
                >
                  {playbackRate}x
                </button>

                {showSpeedMenu && (
                  <div className="absolute bottom-8 right-0 w-28 bg-slate-900 border border-slate-800 rounded-lg shadow-xl p-1.5 z-30 space-y-1">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                      <button
                        key={rate}
                        onClick={() => handleSpeedSelect(rate)}
                        className={`w-full text-left px-2 py-1 text-xs rounded hover:bg-slate-800 flex items-center justify-between ${
                          playbackRate === rate ? 'text-blue-400 font-semibold' : 'text-slate-300'
                        }`}
                      >
                        <span>{rate}x</span>
                        {playbackRate === rate && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theater Mode Toggle */}
              <button
                onClick={onToggleTheater}
                className={`p-1.5 rounded transition-colors cursor-pointer hidden md:inline-flex ${
                  theaterMode ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                }`}
                title={theaterMode ? 'Exit Theater Mode (T)' : 'Theater Mode (T)'}
              >
                <Square className="w-4 h-4" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
