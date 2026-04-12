'use client';

import { motion } from 'framer-motion';
import { Zap, Cpu, Terminal, Shield, Workflow, Layers, Globe, Activity, Database, Lock } from 'lucide-react';

export default function FeatureSection() {
  return (
    <section className="py-40 px-6 relative bg-black/40">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 text-left">
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-none">
            Built for <br /> 
            <span className="text-cyan-500">Atomic Scale.</span>
          </h2>
          <p className="text-zinc-500 max-w-2xl text-xl leading-relaxed">
            Forge is a high-availability orchestration environment designed for developers who demand sub-millisecond feedback loops.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 md:grid-rows-2 gap-6 min-h-[800px]">
          {/* Main Large Card */}
          <BentoCard 
            className="col-span-12 md:col-span-8 md:row-span-2"
            title="Rust Execution Core"
            description="Our sidecar engine is built on Tokio, providing non-blocking task isolation and zero-cost abstractions for production scale."
            icon={<Cpu className="w-12 h-12 text-cyan-400" />}
            preview={<BentoChart />}
          />

          {/* Top Right Card */}
          <BentoCard 
            className="col-span-12 md:col-span-4"
            title="Real-time Persistence"
            description="SQLite with WAL mode enabled by default for ACID compliance at TUI speeds."
            icon={<Database className="w-8 h-8 text-purple-400" />}
          />

          {/* Bottom Right Card */}
          <BentoCard 
            className="col-span-12 md:col-span-4"
            title="Zero-Trust Privacy"
            description="Your data never leaves your environment. Forge is local-first, always."
            icon={<Lock className="w-8 h-8 text-green-400" />}
          />
        </div>
      </div>
    </section>
  );
}

function BentoCard({ title, description, icon, className, preview }: { 
  title: string, 
  description: string, 
  icon: any, 
  className?: string,
  preview?: any 
}) {
  return (
    <div className={`group relative p-10 rounded-[2.5rem] glass hover:bg-white/[0.04] transition-all border border-white/5 overflow-hidden flex flex-col justify-between ${className}`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none group-hover:bg-cyan-500/10 transition-all" />
      
      <div>
        <div className="mb-8 p-4 rounded-2xl bg-white/[0.02] border border-white/5 inline-block group-hover:scale-110 transition-transform shadow-2xl">
          {icon}
        </div>
        <h3 className="text-3xl font-black mb-4 tracking-tight uppercase">{title}</h3>
        <p className="text-zinc-500 leading-relaxed text-lg max-w-md">
          {description}
        </p>
      </div>

      {preview && <div className="mt-10">{preview}</div>}
    </div>
  );
}

function BentoChart() {
  return (
    <div className="w-full h-64 bg-black/40 rounded-3xl border border-white/5 p-8 relative overflow-hidden flex items-end space-x-2">
       {[40, 70, 45, 90, 65, 80, 50, 95, 75, 85].map((h, i) => (
         <motion.div 
           key={i}
           initial={{ height: 0 }}
           whileInView={{ height: `${h}%` }}
           transition={{ delay: i * 0.1, duration: 1 }}
           className="w-full bg-gradient-to-t from-cyan-600/20 to-cyan-500 rounded-t-lg shadow-[0_0_20px_rgba(6,182,212,0.3)]"
         />
       ))}
    </div>
  );
}
