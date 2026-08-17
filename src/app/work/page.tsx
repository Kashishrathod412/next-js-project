import Navigation from "@/components/Navigation";
import WorkSection from "@/components/WorkSection";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function WorkPage() {
  const supabase = createClient();
  
  // Fetch videos for the Work Page
  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .in('placement', ['work_page', 'both'])
    .order('created_at', { ascending: false });

  const safeVideos = videos || [];

  // Dynamically group projects by category
  const groupedVideos = safeVideos.reduce((acc: any, video: any) => {
    const category = video.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(video);
    return acc;
  }, {});

  const categories = Object.keys(groupedVideos).sort();

  return (
    <main className="min-h-screen text-text pt-20 sm:pt-24 pb-32 relative overflow-hidden">
      
      {/* Background ambient gradient */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
      </div>

      <Navigation />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 mt-12 md:mt-20">
          <div>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-medium tracking-tight mb-4">Selected <span className="text-muted">Works.</span></h1>
            <p className="text-muted max-w-md text-sm md:text-base leading-relaxed">
              A curated collection of my favorite projects, ranging from high-end fashion campaigns to cinematic automotive pieces.
            </p>
          </div>
          
          <div className="flex gap-12 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted mb-2">Total Projects</div>
              <div className="text-2xl font-medium">{safeVideos.length < 10 ? `0${safeVideos.length}` : safeVideos.length}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted mb-2">Categories</div>
              <div className="text-2xl font-medium">{categories.length < 10 ? `0${categories.length}` : categories.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Render sections dynamically */}
      <div className="flex flex-col gap-12 md:gap-24 relative z-10">
        {categories.map((category, index) => (
          <WorkSection 
            key={category}
            title={category} 
            projects={groupedVideos[category] as any} 
            sceneNumber={`SCENE 0${index + 1}`} 
          />
        ))}
      </div>
    </main>
  );
}
