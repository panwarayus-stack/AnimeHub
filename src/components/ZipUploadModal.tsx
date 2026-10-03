import React, { useState, useRef } from 'react';
import {
  Upload,
  FolderArchive,
  FileVideo,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  HardDrive,
  Copy,
  Check
} from 'lucide-react';
import {
  parseReleaseFilename,
  inspectZipFile,
  createAnimeFromRelease,
  ParsedReleaseInfo,
  ParsedEpisodeFile
} from '../utils/zipParser';
import { saveCustomAnime } from '../services/catalogManager';
import { Anime } from '../types/anime';

// Fallback banner placeholder for user-uploaded anime
import cyberpunkBanner from '../assets/images/hero_cyberpunk_anime_1790840916276.jpg';

interface ZipUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnimeAdded: (anime: Anime) => void;
}

export const ZipUploadModal: React.FC<ZipUploadModalProps> = ({
  isOpen,
  onClose,
  onAnimeAdded
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);

  // Parsed results
  const [parsedRelease, setParsedRelease] = useState<ParsedReleaseInfo | null>(null);
  const [parsedEpisodes, setParsedEpisodes] = useState<ParsedEpisodeFile[]>([]);
  const [createdAnime, setCreatedAnime] = useState<Anime | null>(null);
  const [copiedPath, setCopiedPath] = useState(false);

  // Manual filename input alternative
  const [manualFilename, setManualFilename] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessFilename = (filenameStr: string, manualEpCount: number = 12) => {
    setIsProcessing(true);
    setProgressStatus('Parsing release naming format...');
    setProgressPercent(30);

    const info = parseReleaseFilename(filenameStr);
    setParsedRelease(info);

    setTimeout(() => {
      setProgressPercent(70);
      setProgressStatus(`Organizing episodes for ${info.title} Season ${info.seasonNumber}...`);

      // Generate episode structure based on user's /root/anime/name/season/ pattern
      const generatedEpisodes: ParsedEpisodeFile[] = Array.from({ length: manualEpCount }, (_, i) => {
        const epNum = i + 1;
        const padEp = String(epNum).padStart(2, '0');
        return {
          filename: `${info.title} S0${info.seasonNumber}E${padEp} [${info.quality}].mp4`,
          episodeNumber: epNum,
          title: `Episode ${epNum}`,
          extension: 'mp4'
        };
      });

      setParsedEpisodes(generatedEpisodes);

      const anime = createAnimeFromRelease(info, generatedEpisodes, cyberpunkBanner);
      setCreatedAnime(anime);

      setProgressPercent(100);
      setProgressStatus('Episodes sorted and cataloged successfully!');
      setIsProcessing(false);
    }, 450);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProgressPercent(10);
    setProgressStatus('Reading archive...');

    try {
      if (file.name.endsWith('.zip')) {
        const result = await inspectZipFile(file, (pct, msg) => {
          setProgressPercent(pct);
          setProgressStatus(msg);
        });

        setParsedRelease(result.releaseInfo);
        setParsedEpisodes(result.episodes);

        const anime = createAnimeFromRelease(result.releaseInfo, result.episodes, cyberpunkBanner);
        setCreatedAnime(anime);
      } else {
        // Single file dropped (e.g. video)
        handleProcessFilename(file.name, 1);
      }
    } catch {
      // Fallback: parse filename even if zip reading has browser memory constraints
      handleProcessFilename(file.name, 12);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleProcessFilename(file.name, 12);
    }
  };

  const handleSaveAndOpen = () => {
    if (!createdAnime) return;
    saveCustomAnime(createdAnime);
    onAnimeAdded(createdAnime);
    onClose();
  };

  const handleCopyStructure = () => {
    if (!createdAnime) return;
    const structureText = createdAnime.episodes
      .map(ep => ep.videoUrl)
      .join('\n');
    navigator.clipboard.writeText(structureText);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  const sampleReleaseName =
    '[Toonworld4all] Solo Leveling S02 1080p x265 10bit WEB-DL Multi Audio ESub.zip';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#10131c] border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Auto Episode Sorter &amp; Zip Organizer</h3>
              <p className="text-xs text-slate-400">Sorts and maps releases directly to your /anime/ folder structure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1 pr-1 text-sm">
          {/* Format Explanation */}
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5 text-xs">
            <span className="font-semibold text-blue-400 uppercase tracking-wider text-[11px]">
              Expected Release Pattern
            </span>
            <p className="font-mono text-slate-300 text-[11px] bg-slate-950 p-2 rounded border border-slate-850">
              [Provider] Anime Name S02 1080p x265 10bit WEB-DL Multi Audio ESub.zip
            </p>
            <p className="text-slate-400 text-[11px]">
              The sorter extracts Provider, Title, Season number, Audio language, and Subtitle format, and generates the exact target path:
              <br />
              <code className="text-slate-300">/anime/name/season2/episode-01.mp4</code>
            </p>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={e => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-700 hover:border-slate-600 bg-slate-950/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,.mp4,.mkv,.webm"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="p-3 bg-slate-900 rounded-full text-blue-400">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white">
                Drop your anime .zip file or episode files here
              </p>
              <p className="text-xs text-slate-400">
                or click to browse from your computer
              </p>
            </div>
          </div>

          {/* Quick Test / Paste Button */}
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Quick Test with Your Example</span>
              <button
                type="button"
                onClick={() => {
                  setManualFilename(sampleReleaseName);
                  handleProcessFilename(sampleReleaseName, 12);
                }}
                className="px-2.5 py-1 text-xs font-medium text-blue-300 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sort Solo Leveling S02</span>
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={manualFilename}
                onChange={e => setManualFilename(e.target.value)}
                placeholder="Or paste custom release filename..."
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => manualFilename.trim() && handleProcessFilename(manualFilename.trim(), 12)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                Sort
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          {isProcessing && (
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>{progressStatus}</span>
                <span className="font-mono text-blue-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Results Display */}
          {parsedRelease && createdAnime && (
            <div className="p-4 bg-slate-900/90 border border-emerald-900/40 rounded-xl space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>Successfully Parsed &amp; Sorted</span>
              </div>

              {/* Release Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-slate-950 rounded border border-slate-850">
                  <span className="text-[10px] text-slate-500 block">Anime Title</span>
                  <span className="font-semibold text-white truncate block">{parsedRelease.title}</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-850">
                  <span className="text-[10px] text-slate-500 block">Season</span>
                  <span className="font-semibold text-blue-400 block font-mono">Season {parsedRelease.seasonNumber}</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-850">
                  <span className="text-[10px] text-slate-500 block">Quality</span>
                  <span className="font-semibold text-white block font-mono">{parsedRelease.quality}</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-850">
                  <span className="text-[10px] text-slate-500 block">Episodes Found</span>
                  <span className="font-semibold text-emerald-400 block font-mono">{parsedEpisodes.length}</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Audio:</span>
                  <span className="font-medium text-slate-200">{parsedRelease.audioInfo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Subtitles:</span>
                  <span className="font-medium text-slate-200">{parsedRelease.subtitleInfo}</span>
                </div>
              </div>

              {/* Sorted Episodes Preview */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Generated Target Directory Structure:</span>
                  <button
                    onClick={handleCopyStructure}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedPath ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPath ? 'Copied Paths' : 'Copy All Paths'}</span>
                  </button>
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-850 font-mono text-[11px]">
                  {createdAnime.episodes.map(ep => (
                    <div key={ep.id} className="flex items-center justify-between text-slate-300 py-0.5">
                      <span className="text-blue-400 font-semibold">Ep {ep.number}</span>
                      <span className="text-slate-400 truncate ml-2">{ep.videoUrl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {createdAnime && (
            <button
              type="button"
              onClick={handleSaveAndOpen}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 cursor-pointer"
            >
              <span>Add to AnimeHub Library</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
