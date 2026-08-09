export interface ProjectData {
  id: number;
  slug: string;
  name: string;
  category: string;
  year: string;
  pattern: string;
  client: string;
  role: string;
  gear: string[];
  directorNotes: string;
  video?: string;
  poster?: string;
}

export const PROJECTS: ProjectData[] = [
  {
    id: 1,
    slug: "the-kapoor-film",
    name: "The Kapoor Film",
    category: "Wedding · 4K",
    year: "2024",
    pattern: "repeating-linear-gradient(45deg, #161616 0 1px, transparent 1px 14px)",
    client: "Priya & Rahul Kapoor",
    role: "Director of Photography & Lead Editor",
    gear: ["Sony FX3", "Sony 24-70mm f/2.8", "DJI RS 3 Pro", "DJI Mini 4 Pro"],
    directorNotes:
      "A cinematic three-day destination wedding shot entirely in 4K 10-bit log. The primary goal was to capture authentic, documentary-style moments while maintaining a highly polished, editorial aesthetic. We utilized natural light extensively and relied on the FX3's dual base ISO for pristine low-light reception events.",
    video: "/shot2_web.mp4",
    poster: "/posters/default.jpg",
  },
  {
    id: 2,
    slug: "arch-studio",
    name: "Arch Studio",
    category: "Commercial · Colour",
    year: "2024",
    pattern: "repeating-linear-gradient(-45deg, #161616 0 1px, transparent 1px 12px)",
    client: "Arch Architectural Studio",
    role: "Colorist & Second Cam",
    gear: ["DaVinci Resolve Studio", "Sony A7 IV", "Sigma 18-35mm f/1.8"],
    directorNotes:
      "A fast-paced commercial project designed to showcase brutalist concrete architecture. The color grade was built from scratch to emphasize the cold, imposing grays while keeping skin tones warm and natural. We shot mostly during blue hour to achieve the specific mood requested by the agency.",
    video: "/shot2_web.mp4",
    poster: "/posters/default.jpg",
  },
  {
    id: 3,
    slug: "void-ep-1",
    name: "Void — Ep. 1",
    category: "Music video · Edit",
    year: "2023",
    pattern: "repeating-linear-gradient(90deg, #161616 0 1px, transparent 1px 16px)",
    client: "Independent Artist",
    role: "Lead Editor & VFX",
    gear: ["Adobe Premiere Pro", "After Effects"],
    directorNotes:
      "An experimental narrative music video heavily reliant on rhythmic pacing and glitch aesthetics. I was brought on purely for post-production. The edit process involved manually creating stutter frames and building custom displacement maps to mimic analog tape damage, syncing perfectly with the heavy 808 beats.",
    video: "/shot2_web.mp4",
    poster: "/posters/default.jpg",
  },
  {
    id: 4,
    slug: "open-waters",
    name: "Open Waters",
    category: "Documentary · DCP",
    year: "2023",
    pattern: "repeating-linear-gradient(0deg, #161616 0 1px, transparent 1px 10px)",
    client: "Oceanic Trust",
    role: "Cinematographer",
    gear: ["Sony FX3", "GoPro Hero 12 (Underwater Housing)"],
    directorNotes:
      "A grueling 14-day shoot on open water following local fishermen. The harsh sunlight and constant movement required a very stripped-down, run-and-gun setup. Waterproofing and maintaining focus while balancing on a moving vessel were the biggest challenges.",
    video: "/shot2_web.mp4",
    poster: "/posters/default.jpg",
  },
  {
    id: 5,
    slug: "techfest-recap",
    name: "TechFest Recap",
    category: "Event · Reel",
    year: "2023",
    pattern: "repeating-linear-gradient(135deg, #161616 0 1px, transparent 1px 13px)",
    client: "TechFest 2023",
    role: "Videographer & Editor",
    gear: ["Sony A7 IV", "DJI Pocket 3", "DJI RS 3 Pro"],
    directorNotes:
      "High-energy event recap requiring extremely rapid turnaround. Shot the event during the day and edited overnight to deliver a 60-second social reel by 8 AM the next morning. The DJI Pocket 3 proved invaluable for getting smooth, stabilizing shots through crowded convention halls.",
    video: "/shot2_web.mp4",
    poster: "/posters/default.jpg",
  },
  {
    id: 6,
    slug: "still-life",
    name: "Still Life",
    category: "Short film · Grade",
    year: "2022",
    pattern: "repeating-linear-gradient(60deg, #161616 0 1px, transparent 1px 11px)",
    client: "Director: Sam Aris",
    role: "Colorist",
    gear: ["DaVinci Resolve Studio", "FSI DM240 Reference Monitor"],
    directorNotes:
      "An intimate, dialogue-free short film focusing on the minutiae of everyday life. The director wanted a heavily stylized, vintage film look. I built a custom film emulation node tree mimicking Kodak 2383 print film, adding halation and heavy grain to achieve the 16mm aesthetic.",
    video: "/shot2_web.mp4",
    poster: "/posters/default.jpg",
  },
];

export interface ReelData {
  id: number;
  name: string;
  category: string;
  pattern: string;
  video?: string;
  poster?: string;
}

export const REELS: ReelData[] = [
  {
    id: 1,
    name: "Fashion Week '25",
    category: "Social · 9:16",
    pattern: "repeating-linear-gradient(30deg, #161616 0 1px, transparent 1px 14px)",
    video: "/IMG_1315_web.mp4",
    poster: "/posters/IMG_1315.jpg",
  },
  {
    id: 2,
    name: "Nike Run Club",
    category: "Promo · 9:16",
    pattern: "repeating-linear-gradient(-30deg, #161616 0 1px, transparent 1px 14px)",
    video: "/IMG_1757_web.mp4",
    poster: "/posters/IMG_1757.jpg",
  },
  {
    id: 3,
    name: "Behind the Lens",
    category: "BTS · 9:16",
    pattern: "repeating-linear-gradient(15deg, #161616 0 1px, transparent 1px 14px)",
    video: "/IMG_1796_web.mp4",
    poster: "/posters/IMG_1796.jpg",
  },
  {
    id: 4,
    name: "Cafe Architecture",
    category: "Interior · 9:16",
    pattern: "repeating-linear-gradient(-15deg, #161616 0 1px, transparent 1px 14px)",
    video: "/IMG_4510_web.mp4",
    poster: "/posters/IMG_4510.jpg",
  },
];