import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = createClient();
  
  // Fetch all videos assigned to the Home Page for the Hero Reels
  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .in('placement', ['home_page', 'both'])
    .order('created_at', { ascending: false });

  const safeVideos = videos || [];

  return (
    <main>
      <Navigation />
      <HeroSection initialReels={safeVideos} />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
