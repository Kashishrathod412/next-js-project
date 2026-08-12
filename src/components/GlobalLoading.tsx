"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function GlobalLoading() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const pathname = usePathname();

  // Reset loading state on pathname change to play the animation again
  useEffect(() => {
    setLoadingComplete(false);
  }, [pathname]);

  const handleComplete = () => {
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
    <AnimatePresence>
      {!loadingComplete && (
        <LoadingScreen key="global-loading" onComplete={handleComplete} />
      )}
    </AnimatePresence>
  );
}
