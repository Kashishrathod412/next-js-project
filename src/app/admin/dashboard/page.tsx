import { createClient } from '@/utils/supabase/server'
import VideoUploadForm from '@/components/admin/VideoUploadForm'
import { Film } from 'lucide-react'

import DeleteVideoButton from '@/components/admin/DeleteVideoButton'
import EditableCaption from '@/components/admin/EditableCaption'
import EditableCategory from '@/components/admin/EditableCategory'
import SignOutButton from '@/components/admin/SignOutButton'

// Disable caching for this route so uploaded videos appear immediately
export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = createClient()
  
  // Fetch existing videos
  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })

  const uniqueCategories = Array.from(new Set(videos?.map(v => v.category) || []))

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30 font-sans tracking-normal">


      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-12 md:py-24">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Creator Studio
            </h1>
            <p className="text-gray-400 text-sm">Manage your portfolio media and content.</p>
          </div>
          <SignOutButton />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* Left Column - Upload Form */}
          <div className="xl:col-span-4 flex flex-col gap-8">
            <VideoUploadForm existingCategories={uniqueCategories} />
            
            {/* Quick Stats Card */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Library Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-light">{videos?.length || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Total Videos</p>
                </div>
                <div>
                  <p className="text-3xl font-light">
                    {videos?.filter(v => v.orientation === 'landscape').length || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Landscape</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Media Library */}
          <div className="xl:col-span-8 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Film className="w-5 h-5 text-gray-400" />
                Media Library
              </h2>
            </div>

            {videos && videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                {videos.map((video) => (
                  <div key={video.id} className="group relative bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                    
                    {/* Media Container */}
                    <div className={`relative bg-black w-full overflow-hidden flex items-center justify-center ${video.orientation === 'vertical' ? 'aspect-[9/16] h-auto' : 'aspect-video'}`}>
                      <video 
                        src={video.video_url} 
                        className={`w-full h-full ${video.orientation === 'vertical' ? 'object-contain' : 'object-cover'} opacity-70 group-hover:opacity-100 transition-opacity`}
                        controls
                        controlsList="nodownload"
                      />
                      
                      {/* Category Badge */}
                      <EditableCategory id={video.id} initialCategory={video.category} categories={uniqueCategories} />
                      
                      {/* Placement Badge */}
                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-semibold tracking-wider uppercase text-white/90 border border-white/10 shadow-xl">
                        {video.placement === 'both' ? 'Both' : video.placement === 'home_page' ? 'Home' : 'Work'}
                      </div>
                    </div>
                    
                    {/* Info Container */}
                    <div className="p-4 flex flex-col justify-between flex-grow">
                      <EditableCaption id={video.id} initialCaption={video.caption} />
                      
                      <div className="mt-4 flex items-center justify-end pt-4 border-t border-white/5">
                        {/* Delete Button */}
                        <DeleteVideoButton id={video.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 px-4 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Film className="w-6 h-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No media yet</h3>
                <p className="text-sm text-gray-400 text-center max-w-sm">
                  Upload your first video using the form to start building your portfolio library.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
