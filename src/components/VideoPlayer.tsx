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
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('en');
  const [currentSubtitleText, setCurrentSubtitleText] = useState<string>('');
  const [selectedAudio, setSelectedAudio] = useState<string>('default');

  // Menus
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // Modals / Status
  const [nextEpisodeCountdown, setNextEpisodeCountdown] = useState<number | null>(null);
  const [resumeNotice, setResumeNotice] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const controlsTimeoutRef = useRef<number | null>(null);

  // Calculate next/prev episodes
  const currentIndex = anime.episodes.findIndex(e => e.id === currentEpisode.id);
  const prevEpisode = currentIndex > 0 ? anime.episodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < anime.episodes.length - 1 ? anime.episodes[currentIndex + 1] : null;

  // Resolve video stream URL (from R2 base URL or fallback demo)
  const resolvedUrl = resolveVideoUrl(currentEpisode.videoUrl);

  // Reset states on episode change
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
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

    // Apply resume position
    if (initialTime > 5 && initialTime < (video.duration || 1000) - 15) {
      video.currentTime = initialTime;
      const mins = Math.floor(initialTime / 60);
      const secs = Math.floor(initialTime % 60);
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

    // Save progress periodically (throttled every 3 seconds or on key steps)
    if (Math.floor(curr) % 3 === 0 && video.duration > 0) {
      onSaveProgress(anime, currentEpisode, curr, video.duration);
    }

    // Subtitle rendering if WebVTT track is parsed or simulation
    updateCustomSubtitles(curr);
  };

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
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipSeconds(-10);
          break;
        case 'ArrowRight':
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

  const customR2Base = getCustomVideoBaseUrl();

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative w-full bg-black select-none overflow-hidden group rounded-xl shadow-2xl transition-all ${
        theaterMode ? 'max-w-none' : 'max-w-7xl mx-auto'
      }`}
      style={{ aspectRatio: isFullscreen ? 'auto' : '16/9' }}
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={resolvedUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onEnded={handleVideoEnded}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
          setErrorMessage('Unable to stream video. Verify the Cloudflare R2 bucket permissions or CORS settings.');
        }}
        onClick={togglePlay}
        playsInline
        className="w-full h-full object-contain cursor-pointer bg-black"
      />

      {/* Loading Spinner */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
          <div className="p-3 bg-black/60 rounded-full backdrop-blur-sm">
            <RefreshCw className="w-8 h-8 text-rose-500 animate-spin" />
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
            <p className="text-xs uppercase tracking-wider text-rose-400 font-semibold">Up Next</p>
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
                className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer"
              >
                Play Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Fallback Overlay */}
      {hasError && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 p-6">
          <div className="max-w-md p-6 bg-slate-900/90 border border-rose-900/50 rounded-xl text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h4 className="text-base font-bold text-white">Video Stream Unavailable</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{errorMessage}</p>
            <div className="p-2 bg-slate-950 rounded text-[11px] font-mono text-slate-400 break-all text-left">
              Source: {resolvedUrl}
            </div>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                  if (videoRef.current) {
                    videoRef.current.load();
                    videoRef.current.play().catch(() => {});
                  }
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                Retry Playback
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
            <span className="text-xs font-semibold text-rose-400 tracking-wider">
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
                autoNext ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40' : 'bg-black/60 text-slate-400'
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
            className="p-4 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-xl transition-transform hover:scale-110 cursor-pointer"
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
        <div className="space-y-2 pointer-events-auto">
          {/* Scrubber Progress Bar */}
          <div className="relative flex items-center group/scrubber cursor-pointer">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none transition-all group-hover/scrubber:h-2.5"
            />
            {/* Buffer progress indicator */}
            {duration > 0 && bufferedEnd > 0 && (
              <div
                className="absolute left-0 top-0 bottom-0 bg-slate-700/50 rounded pointer-events-none -z-10"
                style={{ width: `${Math.min(100, (bufferedEnd / duration) * 100)}%` }}
              />
            )}
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
                  className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none"
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
                    selectedSubtitle !== 'off' ? 'text-rose-400' : 'text-slate-400 hover:text-white'
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
                      {selectedSubtitle === 'off' && <Check className="w-3.5 h-3.5 text-rose-500" />}
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
                        {selectedSubtitle === sub.language && <Check className="w-3.5 h-3.5 text-rose-500" />}
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
                        {selectedAudio === aud.id && <Check className="w-3.5 h-3.5 text-rose-500" />}
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
                          playbackRate === rate ? 'text-rose-400 font-semibold' : 'text-slate-300'
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
                  theaterMode ? 'text-rose-400' : 'text-slate-400 hover:text-white'
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
