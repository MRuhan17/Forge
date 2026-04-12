'use client';

import { useState, useEffect } from 'react';
import { Download, ChevronRight, Apple, Monitor, Loader2, CheckCircle2 } from 'lucide-react';
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
      if (detectedOs === 'windows') return a.name.endsWith('.exe');
      if (detectedOs === 'macos') return a.name.includes('macos') || a.name.endsWith('.dmg');
      if (detectedOs === 'linux') return a.name.includes('linux') && !a.name.endsWith('.exe');
      return false;
    });

    setRecommendedAsset(asset || assets[0]);
  }, [assets]);

  const handleDownload = (e: React.MouseEvent) => {
    if (isDownloading || isFinished) return;
    
    setIsDownloading(true);
    
    // Simulate interactive binary preparation
    setTimeout(() => {
      setIsDownloading(false);
      setIsFinished(true);
      
      // The button anchor logic will still trigger the browser download
      // but we wait for the animation to feel "interactable"
      if (recommendedAsset) {
        window.location.href = recommendedAsset.browser_download_url;
      }
      
      setTimeout(() => setIsFinished(false), 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownload}
        className={`group relative min-w-[320px] h-[72px] bg-white text-black font-black rounded-2xl transition-all shadow-2xl shadow-blue-500/20 overflow-hidden ${!recommendedAsset && 'opacity-50 pointer-events-none'}`}
      >
        <AnimatePresence mode="wait">
          {isDownloading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex items-center justify-center space-x-3 w-full"
            >
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg">Preparing Binary...</span>
              <div className="absolute bottom-0 left-0 h-1 bg-blue-600 animate-[loading-bar_1.5s_ease-in-out]" />
            </motion.div>
          ) : isFinished ? (
            <motion.div 
              key="finished"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-3 w-full text-green-600"
            >
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-lg tracking-tight">Download Started!</span>
            </motion.div>
          ) : (
            <motion.div 
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-4 px-8 w-full"
            >
              <Download className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
              <div className="flex flex-col items-start leading-[1.2]">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black opacity-40">Direct Install</span>
                <span className="text-lg whitespace-nowrap">Windows x64 Stable</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      
      <Link 
        href="/releases"
        className="flex items-center space-x-3 px-10 h-[72px] glass hover:bg-white/[0.05] text-white font-black rounded-2xl transition-all border border-white/10 group overflow-hidden"
      >
        <span className="relative z-10">Archived Versions</span>
        <ChevronRight className="relative z-10 w-5 h-5 text-zinc-500 group-hover:translate-x-2 transition-transform" />
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-zinc-500 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </Link>
    </div>
  );
}
