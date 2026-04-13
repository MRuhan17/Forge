"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";

interface AppFrameProps {
  active: string;
  children: React.ReactNode;
  loading?: boolean;
}

export function AppFrame({ active, children, loading = false }: AppFrameProps) {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar activeTab={active} />
      
      <div className="flex-1 relative p-4 lg:p-12 overflow-y-auto h-screen custom-scrollbar">
        <div className="relative z-10 max-w-7xl mx-auto space-y-8 pb-20">
          {children}
        </div>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
          >
             <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
