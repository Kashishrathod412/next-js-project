"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import WorkSection from "@/components/WorkSection";
import ReelsSection from "@/components/ReelsSection";
import LoadingScreen from "@/components/LoadingScreen";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function WorkPage() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("workLoadingSeen");
    if (seen) {
      setLoadingComplete(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem("workLoadingSeen", "true");
    setLoadingComplete(true);
  };

  // Lock body scroll while loading
  useEffect(() => {
    if (!loadingComplete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [loadingComplete]);

  return (
    <>
      {!loadingComplete && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

      {loadingComplete && (
        <main className="min-h-screen text-text pt-20 sm:pt-24 pb-32 relative overflow-hidden">
          <Navigation />
          <div className="max-w-[1200px] mx-auto relative z-10">
            <div className="px-4 sm:px-6 md:px-12 mb-[-1rem] md:mb-[-3rem] mt-4 md:mt-2 relative z-40">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-muted hover:text-text transition-colors bg-surface/50 backdrop-blur-sm border border-stroke rounded-full px-4 py-2.5 w-fit min-h-[44px]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Home
              </Link>
            </div>
            <ReelsSection />
            <WorkSection />
          </div>
        </main>
      )}
    </>
  );
}
