import React, { useState } from 'react';
import { Tv, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CornerDownLeft, Play, Volume2, Maximize2 } from 'lucide-react';

interface TVRemoteGuideProps {
  isTVMode: boolean;
  onToggleTVMode: () => void;
}

export const TVRemoteGuide: React.FC<TVRemoteGuideProps> = ({
  isTVMode,
  onToggleTVMode
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Dispatch virtual key press for touch or mouse navigation
  const triggerKey = (key: string, code?: string) => {
    const event = new KeyboardEvent('keydown', {
      key,
      code: code || key,
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(event);
  };

  if (!isTVMode) return null;

  return (
    <>
      {/* Floating Indicator in Bottom Right */}
      <div className="fixed bottom-20 right-4 z-40 hidden md:block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-2 rounded-xl bg-[#0e131f]/90 hover:bg-[#161d2f] text-slate-200 border border-rose-500/40 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-semibold transition-all hover:scale-105 cursor-pointer"
          title="TV Mode Active - Click for Remote Guide"
        >
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <Tv className="w-3.5 h-3.5 text-rose-400" />
          <span className="font-mono text-[11px]">10-Foot TV Mode</span>
        </button>
      </div>

      {/* Remote Guide & Virtual Controller Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0c1018] border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-600/20 text-rose-400 rounded-xl border border-rose-500/30">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Smart TV Remote Guide</h3>
                  <p className="text-xs text-slate-400">10-Foot UI &amp; D-Pad Navigation</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Virtual D-Pad for testing or remote controls */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-slate-850">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                On-Screen Virtual D-Pad
              </p>
              <div className="grid grid-cols-3 gap-2 w-44">
                <div />
                <button
                  onClick={() => triggerKey('ArrowUp')}
                  className="p-3 bg-slate-900 hover:bg-slate-800 active:bg-rose-600 rounded-xl text-white flex items-center justify-center border border-slate-800 transition-colors cursor-pointer"
                  title="Up"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
                <div />

                <button
                  onClick={() => triggerKey('ArrowLeft')}
                  className="p-3 bg-slate-900 hover:bg-slate-800 active:bg-rose-600 rounded-xl text-white flex items-center justify-center border border-slate-800 transition-colors cursor-pointer"
                  title="Left"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => triggerKey('Enter')}
                  className="p-3 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 rounded-xl text-white flex items-center justify-center font-bold text-xs shadow-lg transition-transform active:scale-95 cursor-pointer"
                  title="OK / Select"
                >
                  OK
                </button>
                <button
                  onClick={() => triggerKey('ArrowRight')}
                  className="p-3 bg-slate-900 hover:bg-slate-800 active:bg-rose-600 rounded-xl text-white flex items-center justify-center border border-slate-800 transition-colors cursor-pointer"
                  title="Right"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div />
                <button
                  onClick={() => triggerKey('ArrowDown')}
                  className="p-3 bg-slate-900 hover:bg-slate-800 active:bg-rose-600 rounded-xl text-white flex items-center justify-center border border-slate-800 transition-colors cursor-pointer"
                  title="Down"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
                <div />
              </div>
            </div>

            {/* Remote Shortcuts Legend */}
            <div className="space-y-2 text-xs">
              <h4 className="font-semibold text-slate-300">TV Remote / Keyboard Controls:</h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 bg-slate-900/60 rounded-lg flex items-center justify-between">
                  <span className="text-slate-400">Navigate:</span>
                  <span className="text-rose-300">Arrow Keys</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded-lg flex items-center justify-between">
                  <span className="text-slate-400">Select:</span>
                  <span className="text-rose-300">Enter / OK</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded-lg flex items-center justify-between">
                  <span className="text-slate-400">Go Back:</span>
                  <span className="text-rose-300">Escape / Return</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded-lg flex items-center justify-between">
                  <span className="text-slate-400">Play/Pause:</span>
                  <span className="text-rose-300">Spacebar</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded-lg flex items-center justify-between">
                  <span className="text-slate-400">Seek 10s:</span>
                  <span className="text-rose-300">◄ Left / Right ►</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded-lg flex items-center justify-between">
                  <span className="text-slate-400">Toggle TV:</span>
                  <span className="text-rose-300">T Key</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={onToggleTVMode}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Exit TV 10-Foot Mode
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
