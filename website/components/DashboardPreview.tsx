'use client';

import { motion } from 'framer-motion';
import { 
  Home, Folder, Book, Zap, Clock, BarChart2, 
  Terminal as TerminalIcon, Shield, Play, 
  Bell, CheckCircle2, AlertCircle, Cpu, 
  ChevronRight, Search, Settings, Activity
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, 
  ResponsiveContainer, Tooltip 
} from 'recharts';

const chartData = [
  { name: '00:00', value: 400 },
  { name: '04:00', value: 300 },
  { name: '08:00', value: 600 },
  { name: '12:00', value: 450 },
  { name: '16:00', value: 700 },
  { name: '20:00', value: 500 },
  { name: '23:59', value: 800 },
];

export default function DashboardPreview() {
  return (
    <div className="relative w-full max-w-7xl mx-auto rounded-[3rem] overflow-hidden bg-black border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] group selection:bg-cyan-500/30">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_70%)]" />
      
      {/* Sidebar */}
      <div className="flex h-[750px]">
        <div className="w-20 bg-zinc-950/80 border-r border-white/5 flex flex-col items-center py-10 space-y-8 z-20 backdrop-blur-3xl">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
             <Cpu className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 flex flex-col space-y-6">
            <SideIcon icon={<Home />} active />
            <SideIcon icon={<Folder />} />
            <SideIcon icon={<Book />} />
            <SideIcon icon={<Zap />} />
            <SideIcon icon={<Clock />} />
            <SideIcon icon={<BarChart2 />} />
          </div>
          <SideIcon icon={<Settings />} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-black/60 z-10 p-10 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-4 font-mono">
               <span className="text-zinc-600 text-xs">FORGE DASHBOARD //</span>
               <span className="text-cyan-400 text-xs font-bold tracking-widest">PROJECT ORBITAL //</span>
               <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] border border-green-500/20 font-black tracking-tighter">
                 SYSTEM STATUS: STABLE
               </span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="QUICK_FIND" 
                  className="bg-zinc-900/50 border border-white/5 rounded-full px-10 py-2 text-[10px] font-bold text-zinc-400 focus:outline-none focus:border-cyan-500/50 transition-all w-48"
                />
              </div>
              <Bell className="w-5 h-5 text-zinc-500" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8 flex-1">
            {/* Left Column - Stats & Main Chart */}
            <div className="col-span-8 flex flex-col space-y-8">
              <div className="grid grid-cols-3 gap-6">
                 <StatCard label="PROJECTS ACTIVE" value="14" color="text-cyan-400" />
                 <StatCard label="DEPLOYMENTS (24h)" value="317" color="text-purple-400" />
                 <StatCard label="SERVER HEALTH" value="99.8%" color="text-green-400" />
              </div>

              {/* API Requests Chart Container */}
              <div className="flex-1 min-h-[300px] rounded-3xl glass border border-white/5 p-8 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xs font-black text-zinc-500 tracking-widest flex items-center space-x-2">
                     <Activity className="w-4 h-4 text-cyan-500" />
                     <span>API REQUEST METRICS</span>
                   </h3>
                   <div className="flex space-x-4 text-[9px] font-bold">
                      <span className="text-cyan-400">● Status</span>
                      <span className="text-purple-400">● Build</span>
                      <span className="text-pink-400">● Error</span>
                   </div>
                </div>
                <div className="flex-1 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#06b6d4" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right Column - Terminals & Lists */}
            <div className="col-span-4 flex flex-col space-y-6">
              {/* Projects List */}
              <div className="rounded-3xl glass border border-white/5 p-6 space-y-4">
                 <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest border-b border-white/5 pb-4">Projects</h4>
                 <div className="space-y-2">
                    <ProjectItem name="Orbital Platform" status="RUNNING" />
                    <ProjectItem name="Vector Engine" status="DEPLOYED" />
                    <ProjectItem name="Neural Synapse" status="OFFLINE" dimmed />
                 </div>
              </div>

              {/* Terminal Snippet */}
              <div className="flex-1 rounded-3xl bg-zinc-950/90 border border-white/5 p-6 font-mono text-[10px] text-left relative overflow-hidden group/term">
                 <div className="absolute top-0 right-0 p-3 flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                 </div>
                 <div className="text-zinc-500 mb-4 tracking-tighter">&gt; real-time build logs: ...Forge deploy --prod...</div>
                 <div className="space-y-1.5 overflow-hidden">
                    <p className="text-zinc-400">&gt; forge deploy --prod</p>
                    <p className="text-zinc-500">Initializing project metadata...</p>
                    <p className="text-zinc-500">Connecting to Rust engine v2.0...</p>
                    <p className="text-cyan-500 animate-pulse">&gt; Building forge-engine-win32.exe...</p>
                    <p className="text-zinc-700">Linking 912 crates...</p>
                    <div className="w-full h-[1px] bg-white/5 my-4" />
                    <p className="text-green-500 leading-none flex items-center space-x-2">
                       <CheckCircle2 className="w-3 h-3" />
                       <span className="font-bold">DEPLOYMENT_SUCCESSFUL // ORBIT_X1</span>
                    </p>
                 </div>
              </div>

              {/* Alert Mock */}
              <div className="rounded-3xl bg-pink-500/5 border border-pink-500/20 p-6 flex items-center justify-between group cursor-pointer hover:bg-pink-500/10 transition-colors">
                <div className="flex items-center space-x-4">
                   <div className="p-3 bg-pink-500/20 rounded-xl text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                      <AlertCircle className="w-5 h-5" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-xs font-black text-pink-500 uppercase tracking-tighter">Alert Detected</span>
                      <span className="text-[10px] text-pink-500/60 font-mono">Build #743 Failed</span>
                   </div>
                </div>
                <ChevronRight className="w-4 h-4 text-pink-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlapping Floating Code Editor - Visual Flourish */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-32 w-1/3 glass-dark border border-cyan-500/20 rounded-3xl p-8 z-30 shadow-2xl backdrop-blur-2xl hidden lg:block"
      >
        <div className="flex space-x-2 mb-6">
           <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
           <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
           <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="font-mono text-[11px] text-zinc-400 leading-relaxed">
          <p><span className="text-purple-500">export function</span> <span className="text-blue-400">DeployNode</span>() &#123;</p>
          <p className="pl-4"><span className="text-purple-500">const</span> status = <span className="text-cyan-400">await</span> getStatus();</p>
          <p className="pl-4 text-zinc-600">// initiate orbital burn sequence</p>
          <p className="pl-4"><span className="text-purple-500">return</span> status === <span className="text-green-400">'STABLE'</span>;</p>
          <p>&#125;</p>
        </div>
      </motion.div>
    </div>
  );
}

function SideIcon({ icon, active = false }: { icon: any, active?: boolean }) {
  return (
    <div className={`p-3 rounded-xl transition-all cursor-pointer group-hover:scale-110 ${active ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' : 'text-zinc-600 hover:text-white hover:bg-white/5'}`}>
       {cloneWithProps(icon, { className: 'w-6 h-6' })}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="rounded-3xl glass border border-white/5 p-6 flex flex-col justify-between hover:border-white/20 transition-all cursor-default group">
       <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{label}</span>
       <div className="mt-4 flex items-end justify-between">
          <span className={`text-4xl font-black ${color} group-hover:scale-110 transition-transform origin-left`}>{value}</span>
          <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${color}`}>
             <Activity className="w-4 h-4 opacity-50" />
          </div>
       </div>
    </div>
  );
}

function ProjectItem({ name, status, dimmed = false }: { name: string, status: string, dimmed?: boolean }) {
  return (
    <div className={`p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all ${dimmed ? 'opacity-40 grayscale' : ''}`}>
       <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center font-black text-[10px] ${status === 'RUNNING' ? 'text-cyan-500' : 'text-zinc-500'}`}>
            {name.charAt(0)}
          </div>
          <span className="text-xs font-bold text-zinc-300">{name}</span>
       </div>
       <span className={`text-[9px] font-black tracking-tighter ${status === 'RUNNING' ? 'text-cyan-500' : status === 'DEPLOYED' ? 'text-purple-500' : 'text-zinc-600'}`}>{status}</span>
    </div>
  );
}

// Helper to clone icon with consistent dimensions
function cloneWithProps(element: any, props: any) {
  const React = require('react');
  return React.cloneElement(element, props);
}
