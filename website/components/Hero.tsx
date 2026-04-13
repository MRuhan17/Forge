'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { 
  Download, ChevronRight, Play, Terminal as TerminalIcon, 
  Shield, Zap, Sparkles, Layout, Globe, Activity 
} from 'lucide-react';
import DownloadButton from './DownloadButton';
import DashboardPreview from './DashboardPreview';
import { FALLBACK_RELEASES } from '@/lib/constants';
import { useState, useEffect, useRef } from 'react';

export default function Hero() {
  const [latest, setLatest] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-400, 400], [8, -8]), { stiffness: 60, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-400, 400], [-8, 8]), { stiffness: 60, damping: 20 });

  useEffect(() => {
    setLatest(FALLBACK_RELEASES[0]);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex flex-col items-center py-20 px-6 overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <div className="max-w-7xl mx-auto text-center z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center space-x-2 px-6 py-2 rounded-full glass mb-12 border border-white/10 shadow-[0_0_30px_rgba(6,182,212,0.15)] glow-text-cyan"
        >
          <Sparkles className="w-4 h-4 text-cyan-500 animate-pulse" />
          <span className="text-xs font-black tracking-[0.4em] uppercase text-zinc-300">
             Architecting the <span className="text-white">Future</span>
          </span>
        </motion.div>

        <motion.h1 
          className="text-7xl md:text-[12rem] font-[1000] mb-10 tracking-tighter leading-[0.7] uppercase relative"
        >
          <motion.span 
            className="block text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Forge
          </motion.span>
          <motion.span 
            className="block text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 via-white to-zinc-900 py-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Digital.
          </motion.span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-2xl text-zinc-400 max-w-4xl mx-auto mb-20 font-medium leading-tight font-mono tracking-tighter"
        >
          High-performance orchestration for modern infrastructures. <br />
          Experience terminal-native power at lightning speed.
        </motion.p>

        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.5 }}
           className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-44"
        >
          <DownloadButton assets={latest?.assets || []} tagName={latest?.tag_name || ''} />
        </motion.div>

        {/* The 3D Interactive Masterpiece */}
        <div className="relative w-full max-w-7xl mx-auto perspective-2000">
          <motion.div
            style={{ rotateX, rotateY }}
            className="relative neon-border-cyan rounded-[3.5rem] p-1 bg-white/[0.02]"
          >
             <DashboardPreview />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function DashFloatingCard({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.8 }}
      className="p-6 rounded-3xl glass-dark border border-white/5 flex flex-col items-start space-y-2 animate-float shadow-2xl"
    >
       <div className="p-3 bg-white/5 rounded-2xl mb-2">{icon}</div>
       <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{label}</span>
       <span className="text-xl font-black text-white">{value}</span>
    </motion.div>
  );
}
