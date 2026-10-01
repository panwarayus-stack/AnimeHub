import React, { useState, useEffect } from 'react';
import { X, Cloud, CheckCircle, ExternalLink, RefreshCw, AlertCircle, Info } from 'lucide-react';
import { getCustomVideoBaseUrl, setCustomVideoBaseUrl, resetCustomVideoBaseUrl, VIDEO_BASE_URL } from '../services/video';

interface R2ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const R2ConfigModal: React.FC<R2ConfigModalProps> = ({ isOpen, onClose }) => {
  const [urlInput, setUrlInput] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUrlInput(getCustomVideoBaseUrl());
      setTestStatus('idle');
      setTestMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setCustomVideoBaseUrl(urlInput);
    setTestStatus('success');
    setTestMessage('Video base URL saved for this browser session.');
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleReset = () => {
    resetCustomVideoBaseUrl();
    setUrlInput('');
    setTestStatus('idle');
    setTestMessage('Reset to default demo streams.');
  };

  const handleTestConnection = async () => {
    if (!urlInput.trim()) {
      setTestStatus('error');
      setTestMessage('Please enter a URL to test.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Testing connectivity to Cloudflare R2 bucket...');

    try {
      const cleanUrl = urlInput.trim().replace(/\/$/, '');
      const testEndpoint = `${cleanUrl}/test.mp4`;

      // Try a lightweight HEAD request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      await fetch(testEndpoint, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'cors'
      });
      clearTimeout(timeoutId);

      setTestStatus('success');
      setTestMessage('Connection successful! Bucket endpoint responded.');
    } catch {
      // Due to CORS on non-existent test file or offline bucket, warn politely
      setTestStatus('idle');
      setTestMessage(
        'Note: Bucket was queried. Ensure your Cloudflare R2 bucket has Public Access or Custom Domain enabled and CORS allowed for GET/HEAD.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#11141c] border border-slate-800 rounded-xl p-6 shadow-2xl text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Video Source Architecture</h3>
              <p className="text-xs text-slate-400">Cloudflare R2 Direct Streaming Configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-sm">
          {/* Architecture Card */}
          <div className="p-3.5 bg-slate-900/80 border border-slate-800/80 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
              <Info className="w-4 h-4 shrink-0" />
              <span>Direct-to-Client Video Pipeline (No Vercel Bandwidth Limits)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Videos stream directly from <strong className="text-white">Cloudflare R2</strong> to the viewer&apos;s browser.
              Vercel only hosts the fast React frontend, keeping latency low and avoiding costly proxy bandwidth.
            </p>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-950/70 p-2 rounded border border-slate-800/60">
              Browser &rarr; Vercel (UI) &nbsp;|&nbsp; Browser &rarr; Cloudflare R2 (Video MP4)
            </div>
          </div>

          {/* Form input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Cloudflare R2 Public Domain / Base URL
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="e.g. https://pub-xxxxxxxx.r2.dev or https://media.yourdomain.com"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-mono text-xs"
            />
            <p className="text-[11px] text-slate-400">
              Current environment build default: <span className="font-mono text-slate-300">{VIDEO_BASE_URL || '(none - using demo streams)'}</span>
            </p>
          </div>

          {/* Test Status feedback */}
          {testMessage && (
            <div
              className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                testStatus === 'success'
                  ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-300'
                  : testStatus === 'error'
                  ? 'bg-rose-950/40 border border-rose-800 text-rose-300'
                  : 'bg-slate-900 border border-slate-800 text-slate-300'
              }`}
            >
              {testStatus === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : testStatus === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
              )}
              <span>{testMessage}</span>
            </div>
          )}

          {/* Deployment guide tip */}
          <div className="text-xs text-slate-400 space-y-1">
            <div className="font-medium text-slate-300">Vercel Deployment Setup:</div>
            <p className="text-[11px] leading-relaxed">
              When ready to deploy on Vercel, simply add the environment variable{' '}
              <code className="px-1.5 py-0.5 bg-slate-800 rounded text-rose-300 font-mono">
                VITE_VIDEO_BASE_URL
              </code>{' '}
              in your Vercel Project Settings. You will never need to modify UI code.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Reset to Demo Streams
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {testStatus === 'testing' ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ExternalLink className="w-3.5 h-3.5" />
              )}
              Test R2
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
