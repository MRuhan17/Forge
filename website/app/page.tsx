"use client";

import { AppFrame } from "@/components/dashboard/AppFrame";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import { useState, useEffect } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mimic Mentiora page loading experience
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppFrame active="My Dashboard" loading={isLoading}>
      <DashboardHeader firstName="Ruhan" />
      
      <div className="space-y-12">
        {/* Main Hero Component as the featured "Plan" section */}
        <section className="rounded-[4rem] bg-zinc-950/50 border border-white/5 overflow-hidden">
          <Hero />
        </section>

        {/* Feature Grid matching Mentiora's Insights layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FeatureSection />
        </div>
      </div>
    </AppFrame>
  );
}
