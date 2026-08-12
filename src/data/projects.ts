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
  // Fashion
  {
    id: 1,
    slug: "summer-collection",
    name: "Summer Collection '24",
    category: "Fashion · 4K",
    year: "2024",
    pattern: "repeating-linear-gradient(45deg, #161616 0 1px, transparent 1px 14px)",
    client: "Vogue India",
    role: "Director of Photography",
    gear: ["Sony FX3", "Sony 24-70mm f/2.8", "DJI RS 3 Pro"],
    directorNotes: "A high-fashion editorial shoot focusing on natural light and flowy fabrics. Shot mostly during golden hour.",
    video: "/IMG_1315_web.mp4",
    poster: "/posters/IMG_1315.jpg",
  },
  {
    id: 2,
    slug: "streetwear-drop",
    name: "Urban Streetwear Drop",
    category: "Fashion · Reel",
    year: "2023",
    pattern: "repeating-linear-gradient(-45deg, #161616 0 1px, transparent 1px 12px)",
    client: "HypeBeast",
    role: "Videographer & Editor",
    gear: ["Sony A7 IV", "Sigma 18-35mm f/1.8"],
    directorNotes: "Fast-paced, gritty streetwear promo shot in the streets of Mumbai.",
    video: "/IMG_1796_web.mp4",
    poster: "/posters/IMG_1796.jpg",
  },
  // Food
  {
    id: 3,
    slug: "michelin-star",
    name: "Michelin Star Experience",
    category: "Food · Macro",
    year: "2024",
    pattern: "repeating-linear-gradient(90deg, #161616 0 1px, transparent 1px 16px)",
    client: "Le Bernardin",
    role: "Cinematographer",
    gear: ["Sony FX3", "90mm Macro f/2.8"],
    directorNotes: "Capturing the intricate details of fine dining. Heavy use of macro lenses and controlled studio lighting.",
    video: "/IMG_4510_web.mp4",
    poster: "/posters/IMG_4510.jpg",
  },
  {
    id: 4,
    slug: "street-food-diaries",
    name: "Street Food Diaries",
    category: "Food · Documentary",
    year: "2023",
    pattern: "repeating-linear-gradient(0deg, #161616 0 1px, transparent 1px 10px)",
    client: "Netflix India",
    role: "Camera Operator",
    gear: ["Sony A7S III", "DJI Pocket 3"],
    directorNotes: "Raw and authentic capture of street food culture. Run-and-gun setup to capture genuine moments.",
    video: "/IMG_1757_web.mp4",
    poster: "/posters/IMG_1757.jpg",
  },
  // Cars
  {
    id: 5,
    slug: "porsche-911",
    name: "Porsche 911 GT3",
    category: "Cars · Track",
    year: "2024",
    pattern: "repeating-linear-gradient(135deg, #161616 0 1px, transparent 1px 13px)",
    client: "Porsche",
    role: "Lead Cinematographer",
    gear: ["RED Komodo", "DJI Inspire 3"],
    directorNotes: "High-speed tracking shots on a closed circuit. Required precise coordination with precision drivers.",
    video: "/IMG_1315_web.mp4",
    poster: "/posters/IMG_1315.jpg",
  },
  {
    id: 6,
    slug: "vintage-classics",
    name: "Vintage Classics",
    category: "Cars · Editorial",
    year: "2023",
    pattern: "repeating-linear-gradient(60deg, #161616 0 1px, transparent 1px 11px)",
    client: "Classic Car Club",
    role: "Director of Photography",
    gear: ["Sony FX3", "Vintage Leica R Lenses"],
    directorNotes: "Showcasing restored vintage cars using vintage lenses to give a timeless, filmic look.",
    video: "/IMG_1796_web.mp4",
    poster: "/posters/IMG_1796.jpg",
  },
  // Commercial
  {
    id: 7,
    slug: "arch-studio",
    name: "Arch Studio",
    category: "Commercial · Colour",
    year: "2024",
    pattern: "repeating-linear-gradient(-45deg, #161616 0 1px, transparent 1px 12px)",
    client: "Arch Architectural Studio",
    role: "Colorist & Second Cam",
    gear: ["DaVinci Resolve Studio", "Sony A7 IV", "Sigma 18-35mm f/1.8"],
    directorNotes: "A fast-paced commercial project designed to showcase brutalist concrete architecture. The color grade was built from scratch to emphasize the cold, imposing grays while keeping skin tones warm and natural.",
    video: "/IMG_4510_web.mp4",
    poster: "/posters/IMG_4510.jpg",
  },
  {
    id: 8,
    slug: "nike-run",
    name: "Nike Run Club",
    category: "Commercial · Promo",
    year: "2023",
    pattern: "repeating-linear-gradient(30deg, #161616 0 1px, transparent 1px 14px)",
    client: "Nike",
    role: "Director & Editor",
    gear: ["Sony FX3", "GoPro Hero 12"],
    directorNotes: "High energy promo focusing on movement and endurance.",
    video: "/IMG_1757_web.mp4",
    poster: "/posters/IMG_1757.jpg",
  }
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