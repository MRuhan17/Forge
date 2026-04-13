"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Home, 
  Terminal, 
  Activity, 
  Cpu, 
  Settings,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
}

const MENU_ITEMS = [
  { id: "Dashboard", label: "My Dashboard", icon: Home, href: "/" },
  { id: "Projects", label: "Projects", icon: Terminal, href: "/projects" },
  { id: "Activities", label: "Status Stream", icon: Activity, href: "/activities" },
  { id: "Settings", label: "Configuration", icon: Settings, href: "/settings" },
];

export function Sidebar({ activeTab }: SidebarProps) {
  return (
    <div className="w-80 h-screen border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl flex flex-col p-8 sticky top-0 hidden lg:flex">
      {/* Brand */}
      <div className="flex items-center gap-4 mb-16">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Cpu className="w-7 h-7 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-[1000] tracking-tighter text-white leading-none">FORGE</span>
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 mt-1">Platform</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {MENU_ITEMS.map((item) => {
          const isActive = activeTab === item.label || activeTab === item.id;
          return (
            <Link key={item.id} href={item.href}>
              <div className={cn(
                "group flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 relative",
                isActive ? "bg-white/5 text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
              )}>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-white/5 rounded-2xl border border-white/5"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon 
                  className={cn("w-6 h-6 relative z-10", isActive ? "text-blue-400" : "text-zinc-600")} 
                />
                <span className="font-bold text-sm tracking-tight relative z-10">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User */}
      <div className="mt-8 pt-8 border-t border-white/5">
        <div className="p-6 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-between group cursor-pointer hover:bg-blue-600/20 transition-all">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-black text-blue-400 mb-1">Current Version</span>
            <span className="text-sm font-bold text-white tracking-tight">v1.2.0-stable</span>
          </div>
          <Download className="w-5 h-5 text-blue-400 group-hover:translate-y-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
