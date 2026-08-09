"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturedReelsSection from "@/components/FeaturedReelsSection";
import ServicesSection from "@/components/ServicesSection";
import GearSection from "@/components/GearSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("loadingSeen");
    if (seen) {
      setLoadingComplete(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem("loadingSeen", "true");
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

      {/* Main Content only mounts/starts animating after loading completes to allow GSAP staggered entrances to run properly */}
      {loadingComplete && (
        <>
          <main>
            <Navigation />
            <HeroSection />
            <FeaturedReelsSection />
            <AboutSection />
            <ServicesSection />
            <GearSection />
            <ContactSection />
          </main>
        </>
      )}
    </>
  );
}
