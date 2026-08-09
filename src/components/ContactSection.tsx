"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Send } from "lucide-react";
import emailjs from '@emailjs/browser';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const containerRef = useRef<HTMLElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await emailjs.sendForm(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID', 
      e.target as HTMLFormElement,
      'YOUR_PUBLIC_KEY'
    );
    // show success state
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const triggers: ScrollTrigger[] = [];

    // Focus pull + fade in on contact contents
    const content = containerRef.current.querySelector(".contact-content");
    if (content) {
      gsap.set(content, { willChange: "filter, transform" });
      const contentTween = gsap.fromTo(content,
        {
          y: 30,
          opacity: 0.7,
          filter: "blur(8px)"
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power2.out",
          onComplete: () => { (content as HTMLElement).style.willChange = "auto"; },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          }
        }
      );
      if (contentTween.scrollTrigger) triggers.push(contentTween.scrollTrigger);
    }

    // Fade in scene marker
    const marker = containerRef.current.querySelector(".scene-marker");
    if (marker) {
      const markerTween = gsap.fromTo(marker,
        { opacity: 0, y: 15 },
        {
          opacity: 0.35,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          }
        }
      );
      if (markerTween.scrollTrigger) triggers.push(markerTween.scrollTrigger);
    }

    return () => { triggers.forEach(t => t.kill()); };
  }, []);

  return (
    <section id="contact" ref={containerRef} className="py-24 px-4 sm:px-6 md:px-12 border-t border-stroke relative">
      <div className="relative z-10 max-w-[1200px] mx-auto contact-content">
        {/* Screenplay Scene Marker */}
        <div className="scene-marker opacity-0 flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase font-mono mb-6 text-muted select-none">
          <span>SCENE 05</span>
          <span className="w-1 h-1 rounded-full bg-purple-500/50" />
          <span>CONTACT</span>
        </div>

        <div className="mb-10">
          <h2 className="text-[clamp(28px,5vw,52px)] font-medium text-text tracking-tight mb-2">
            {"Let's"} make something{" "}
            <em className="font-display italic text-text">real.</em>
          </h2>
          <p className="text-[14px] text-muted">
            Available from October 2026 onwards.
          </p>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            {/* Name */}
            <div className="bg-surface border border-stroke rounded-lg px-4 py-3.5 hover:border-white/15 focus-within:border-white/25 transition-colors">
              <label className="block text-[10px] uppercase text-faint mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="bg-transparent text-text/70 text-[13px] outline-none w-full placeholder:text-ghost"
              />
            </div>

            {/* Email */}
            <div className="bg-surface border border-stroke rounded-lg px-4 py-3.5 hover:border-white/15 focus-within:border-white/25 transition-colors">
              <label className="block text-[10px] uppercase text-faint mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="bg-transparent text-text/70 text-[13px] outline-none w-full placeholder:text-ghost"
              />
            </div>
          </div>

          {/* Project Type */}
          <div className="bg-surface border border-stroke rounded-lg px-4 py-3.5 mb-2 hover:border-white/15 focus-within:border-white/25 transition-colors">
            <label className="block text-[10px] uppercase text-faint mb-1">
              Project type
            </label>
            <input
              type="text"
              placeholder="Commercial, Wedding, Music Video..."
              className="bg-transparent text-text/70 text-[13px] outline-none w-full placeholder:text-ghost"
            />
          </div>

          {/* Message */}
          <div className="bg-surface border border-stroke rounded-lg px-4 py-3.5 hover:border-white/15 focus-within:border-white/25 transition-colors mb-4">
            <label className="block text-[10px] uppercase text-faint mb-1">
              Message
            </label>
            <textarea
              placeholder="Tell me about your vision..."
              className="bg-transparent text-text/70 text-[13px] outline-none w-full min-h-[80px] sm:min-h-[96px] placeholder:text-ghost resize-y"
            />
          </div>

          {/* CTA Button */}
          <div>
            <button
              type="submit"
              className="bg-white text-bg text-xs uppercase tracking-[0.06em] font-medium px-6 py-3.5 rounded-lg mt-1 inline-flex justify-center items-center gap-2.5 hover:opacity-[0.88] transition-opacity w-full sm:w-auto"
            >
              <Send className="w-[14px] h-[14px]" />
              Send enquiry
            </button>
          </div>
        </form>

        <div className="border-t border-stroke mt-16 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center justify-center">
            <a
              href="https://www.instagram.com/dhruvil_2002_/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-medium hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 shadow-[0_0_20px_rgba(219,39,119,0.2)] hover:shadow-[0_0_30px_rgba(219,39,119,0.4)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:-rotate-12 transition-transform duration-300">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span>Follow on Instagram</span>
            </a>
          </div>
          <div className="text-[10px] text-ghost flex items-center gap-4">
            <span className="opacity-15 font-mono text-[8px] tracking-wider select-none pointer-events-none">CUT 002 // SEQ C</span>
            <span>© 2026 Dhruvil Naidu</span>
          </div>
        </div>
      </div>
    </section>
  );
}

