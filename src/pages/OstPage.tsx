import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, Volume2, Disc } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  type: 'Opening' | 'Theme' | 'Ending' | 'Battle';
  duration: string;
  sourceUrl: string;
  lyrics: string[];
}

const TRACKS: Track[] = [
  {
    id: 'level',
    title: 'LEvel',
    artist: 'SawanoHiroyuki[nZk] feat. TOMORROW X TOGETHER',
    type: 'Opening',
    duration: '1:30',
    sourceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // high quality MP3 loop
    lyrics: [
      'Grasping onto the light within the shadow',
      'Arise from the dark, let the storm blow',
      'The levels keep rising, limits are gone',
      'We stand as the hunters, the monarchs of dawn!'
    ]
  },
  {
    id: 'arise',
    title: 'Arise (Symphonic Battle Theme)',
    artist: 'SawanoHiroyuki[nZk]',
    type: 'Battle',
    duration: '2:15',
    sourceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    lyrics: [
      '[Chorus - Dark Symphonic Choirs]',
      'Extract the souls of the fallen kings',
      'Command the army under shadow wings',
      'Rise from your graves, obey the call',
      'The Monarch commands, we crush them all!'
    ]
  },
  {
    id: 'darkaria',
    title: 'Darkaria (Shadow Extraction Theme)',
    artist: 'SawanoHiroyuki[nZk]',
    type: 'Theme',
    duration: '3:05',
    sourceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    lyrics: [
      'Pure strings rising in high tension',
      'Shadows merging in another dimension',
      'System synchronized. Power ascended.',
      'All of the world\'s rules have been bended.'
    ]
  },
  {
    id: 'everyeach',
    title: 'Every & Each',
    artist: 'SawanoHiroyuki[nZk] feat. ASCA',
    type: 'Ending',
    duration: '1:45',
    sourceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    lyrics: [
      'Fading into the twilight sun',
      'Countless trials have just begun',
      'I\'ll stand by your side until the end',
      'Even if the darkness must descend...'
    ]
  }
];

export const OstPage: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<Track>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array.from({ length: 24 }, () => 15));

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio(activeTrack.sourceUrl);
    audioRef.current.loop = true;

    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [activeTrack]);

  // Handle Play/Pause
  const handlePlayToggle = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  // Track selection
  const handleTrackSelect = (track: Track) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setActiveTrack(track);
  };

  // Simulating high-end visualizer beats when playing
  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setVisualizerBars(Array.from({ length: 24 }, () => Math.floor(Math.random() * 55) + 10));
      }, 100);
    } else {
      setVisualizerBars(Array.from({ length: 24 }, () => 10));
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="border-b border-white/[0.08] pb-5 text-left">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400 font-bold mb-1.5">
          <Music className="w-4 h-4" />
          <span>Symphonic Audio Player</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight leading-none">
          Original Soundtracks
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Experience the critically acclaimed symphonic arrangements composed by SawanoHiroyuki[nZk] for Solo Leveling.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Track Playlist */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 text-left">
            Playlist
          </h3>
          <div className="space-y-3">
            {TRACKS.map(track => {
              const isSelected = activeTrack.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => handleTrackSelect(track)}
                  className={`w-full p-4 rounded-2xl text-left border flex items-center justify-between transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isSelected
                      ? 'bg-blue-600/10 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/10'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.05] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
                      isSelected ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-950 border-white/[0.05] text-slate-500'
                    }`}>
                      <Music className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm sm:text-base font-bold truncate transition-colors ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {track.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {track.artist}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-500 font-semibold pl-2">
                    {track.duration}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Symphonic player card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06] rounded-3xl p-6 sm:p-8 space-y-8 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row gap-8 items-center justify-between">
            {/* Spinning Album Plate */}
            <div className="relative w-40 h-40 flex items-center justify-center bg-slate-950 rounded-full border border-white/10 shadow-2xl shrink-0 group">
              <div className={`absolute inset-3 rounded-full border border-dashed border-white/20 flex items-center justify-center ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}>
                <Disc className="w-20 h-20 text-blue-500/70" />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/20 z-10 shadow-inner flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              </div>
            </div>

            {/* Now playing text */}
            <div className="text-center sm:text-left flex-1 space-y-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-600/20 text-blue-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-blue-500/30">
                {activeTrack.type} Soundtrack
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
                {activeTrack.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wide">
                {activeTrack.artist}
              </p>
            </div>
          </div>

          {/* Interactive Symphonic Audio Visualizer */}
          <div className="space-y-4 pt-4 border-t border-white/[0.06]">
            <div className="h-16 flex items-end justify-center gap-1.5 px-4 bg-slate-950/80 rounded-2xl border border-white/[0.04]">
              {visualizerBars.map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-t bg-gradient-to-t from-blue-600 via-blue-400 to-purple-500 transition-all duration-100"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            {/* Play controls deck */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={handlePlayToggle}
                className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transform active:scale-95 transition-all cursor-pointer focus:ring-4 focus:ring-blue-400"
                title={isPlaying ? 'Pause Preview' : 'Play Preview'}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white translate-x-0.5" />}
              </button>

              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                <Volume2 className="w-4 h-4 text-blue-400" />
                <span>Stereo Preview Stream</span>
              </div>
            </div>
          </div>

          {/* Lyrics / Transcription segment */}
          <div className="pt-4 border-t border-white/[0.06] text-center space-y-1.5">
            <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Lyrics / Motif Transcription</span>
            <div className="space-y-1">
              {activeTrack.lyrics.map((line, idx) => (
                <p key={idx} className="text-xs sm:text-sm text-slate-300 font-medium italic">
                  "{line}"
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
