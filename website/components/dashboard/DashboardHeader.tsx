"use client";

import React from "react";
import { Bell, User } from "lucide-react";

interface HeaderProps {
  firstName: string;
  status?: string;
}

export function DashboardHeader({ firstName, status = "System Stable" }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-12">
      <div>
        <h1 className="text-5xl font-[1000] tracking-tighter text-white mb-2 uppercase">
          Welcome back, <span className="text-blue-500">{firstName}</span>
        </h1>
        <p className="text-zinc-500 font-medium tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {status} — API response time 14ms
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="p-4 rounded-3xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer">
          <Bell className="w-6 h-6" />
        </div>
        <div className="p-2 pl-4 pr-6 rounded-full bg-white text-black font-black flex items-center gap-4 hover:scale-105 transition-transform cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center">
            <User className="w-5 h-5 text-zinc-900" />
          </div>
          <span className="text-sm tracking-tight">M. Ruhan</span>
        </div>
      </div>
    </div>
  );
}
