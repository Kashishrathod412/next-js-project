"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { id: "work", label: "Work", path: "/work" },
  { id: "about", label: "About", path: "/#about" },
  { id: "contact", label: "Contact", path: "/#contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Only run intersection observer on the home page for anchors
    if (pathname !== "/") {
      setActiveSection(pathname.includes("work") ? "work" : "");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 max-w-[calc(100vw-32px)] w-full sm:w-auto flex justify-center">
      <div
        className={`flex items-center gap-2 sm:gap-4 rounded-full border px-2 py-2 transition-all duration-500 ${
          scrolled 
            ? "shadow-2xl shadow-black/80 backdrop-blur-3xl bg-white/[0.04] border-white/[0.08] scale-[0.98] -translate-y-1" 
            : "backdrop-blur-md bg-surface border-white/10 scale-100 translate-y-0"
        }`}
      >
        {/* Logo Circle */}
        <Link href="/" className="w-[36px] h-[36px] border border-white/10 rounded-full flex items-center justify-center shrink-0 hover:bg-white/5 transition-colors cursor-pointer">
          <span className="text-[11px] text-muted uppercase">DN</span>
        </Link>

        {/* Nav Links (Desktop) */}
        <div className="hidden md:flex items-center">
          {NAV_LINKS.map((link) => (
            <Link
              href={link.path}
              key={link.id}
              onClick={(e) => {
                if (link.path.startsWith("/#") && pathname === "/") {
                  e.preventDefault();
                  document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={`text-xs uppercase tracking-[0.06em] px-4 py-2 rounded-full transition-colors duration-200 ${
                activeSection === link.id
                  ? "text-text bg-raised"
                  : "text-muted hover:text-text hover:bg-raised/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Available Pill */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-muted border border-white/10 rounded-full px-3 py-1.5 shrink-0 ml-1">
          <div className="bg-green-400 rounded-full w-1.5 h-1.5 animate-pulse" />
          <span className="uppercase tracking-[0.06em]">Available</span>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden w-9 h-9 flex items-center justify-center text-muted hover:text-text transition-colors rounded-full hover:bg-white/5 ml-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -8, x: "-50%" }} 
            animate={{ opacity: 1, y: 0, x: "-50%" }} 
            exit={{ opacity: 0, y: -8, x: "-50%" }} 
            transition={{ duration: 0.2 }}
            className="absolute top-[calc(100%+12px)] left-1/2 w-[min(280px,calc(100vw-32px))] bg-surface/95 backdrop-blur-xl border border-stroke rounded-2xl p-2 flex flex-col gap-1 md:hidden shadow-xl"
          >
            {NAV_LINKS.map((link) => (
              <Link
                href={link.path}
                key={`mobile-${link.id}`}
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  if (link.path.startsWith("/#") && pathname === "/") {
                    e.preventDefault();
                    document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`text-xs uppercase tracking-[0.06em] px-4 py-3.5 rounded-xl transition-colors duration-200 text-center ${
                  activeSection === link.id
                    ? "text-text bg-raised"
                    : "text-muted hover:text-text hover:bg-raised/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

