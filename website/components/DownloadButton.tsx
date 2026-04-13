'use client';

import { useState, useEffect } from 'react';
import { Download, ChevronRight, Apple, Monitor, Loader2, CheckCircle2, Terminal } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Asset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface DownloadButtonProps {
  assets: Asset[];
  tagName: string;
}

export default function DownloadButton({ assets, tagName }: DownloadButtonProps) {
  const [os, setOs] = useState<'windows' | 'macos' | 'linux' | 'unknown'>('unknown');
  const [recommendedAsset, setRecommendedAsset] = useState<Asset | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const ua = window.navigator.userAgent.toLowerCase();
    let detectedOs: 'windows' | 'macos' | 'linux' | 'unknown' = 'unknown';

    if (ua.includes('win')) detectedOs = 'windows';
    else if (ua.includes('mac')) detectedOs = 'macos';
    else if (ua.includes('linux')) detectedOs = 'linux';

    setOs(detectedOs);

    const asset = assets.find(a => {
      const name = a.browser_download_url.toLowerCase();
      if (detectedOs === 'windows') return name.includes('windows') || name.endsWith('.exe');
      if (detectedOs === 'macos') return name.includes('macos');
      if (detectedOs === 'linux') return name.includes('linux');
      return false;
    });

    setRecommendedAsset(asset || assets[0]);
  }, [assets]);

  const triggerDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = () => {
    if (isDownloading || isFinished || !recommendedAsset) return;
    
    setIsDownloading(true);
    
    // Aesthetic preparation delay for high-fidelity feel
    setTimeout(() => {
      setIsDownloading(false);
      setIsFinished(true);
      
      // Perform the actual file transfer
      triggerDownload(recommendedAsset.browser_download_url, recommendedAsset.browser_download_url.split('/').pop() || 'forge-binary');
      
      setTimeout(() => setIsFinished(false), 3000);
    }, 1200);
  };

  const getOsLabel = () => {
    if (os === 'windows') return "Windows x64";
    if (os === 'macos') return "macOS (Apple Silicon)";
    if (os === 'linux') return "Linux x64 Binary";
    return "Standard Binary";
  };

  const getOsIcon = () => {
    if (os === 'windows') return <Monitor className="w-5 h-5 text-blue-400" />;
    if (os === 'macos') return <Apple className="w-5 h-5 text-zinc-300" />;
    return <Terminal className="w-5 h-5 text-emerald-400" />;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownload}
        className={`group relative min-w-[320px] h-[72px] bg-white text-black font-black rounded-2xl transition-all shadow-2xl shadow-blue-500/20 overflow-hidden ${!recommendedAsset && 'opacity-50 pointer-events-none'}`}
      >
        <AnimatePresence mode="wait">
          {isDownloading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center space-x-3 w-full"
            >
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-lg">Streaming Binary...</span>
            </motion.div>
          ) : isFinished ? (
            <motion.div 
              key="finished"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-3 w-full text-green-600"
            >
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-lg tracking-tight">Binary Received!</span>
            </motion.div>
          ) : (
            <motion.div 
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center px-8 w-full gap-4"
            >
              <div className="p-2 bg-black/5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {getOsIcon()}
              </div>
              <div className="flex flex-col items-start leading-[1.1]">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black opacity-30">Production Stable</span>
                <span className="text-lg whitespace-nowrap">{getOsLabel()}</span>
              </div>
              <Download className="w-5 h-5 ml-auto opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
