'use client';

import Link from 'next/link';
import { Cpu, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/[0.05] bg-black/60 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-blue-500/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none">FORGE</span>
            <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Engine v0.1</span>
          </div>
        </Link>
        
        <div className="flex items-center space-x-12">
          <Link href="/releases" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors tracking-tight">
            Releases
          </Link>
          <Link 
            href="#" 
            className="hidden sm:flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-sm font-bold hover:bg-white/[0.08] transition-all"
          >
            <Terminal className="w-4 h-4 text-blue-500" />
            <span>Documentation</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
