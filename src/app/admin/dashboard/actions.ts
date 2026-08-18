'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

function extractPublicId(url: string) {
  try {
    const parts = url.split('/upload/')
    if (parts.length !== 2) return null
    const afterUpload = parts[1]
    const pathParts = afterUpload.split('/')
    let startIdx = 0
    if (pathParts[0].match(/^v\d+$/)) {
      startIdx = 1
    }
    const publicIdWithExt = pathParts.slice(startIdx).join('/')
    const lastDot = publicIdWithExt.lastIndexOf('.')
    if (lastDot !== -1) {
      return publicIdWithExt.substring(0, lastDot)
    }
    return publicIdWithExt
  } catch (err) {
    console.error('Error parsing public_id:', err)
    return null
  }
}

export async function deleteVideo(id: string) {
  try {
    const supabase = createClient()
    
    // First, fetch the video to get its Cloudinary URL
    const { data: videoData, error: fetchError } = await supabase
      .from('videos')
      .select('video_url')
      .eq('id', id)
      .single()
      
    if (fetchError || !videoData) {
      return { success: false, error: 'Could not fetch video details from database.' }
    }

    // Delete the record from Supabase
    const { data, error } = await supabase.from('videos').delete().eq('id', id).select()
    
    if (error) {
      return { success: false, error: error.message }
    }

    if (!data || data.length === 0) {
      return { success: false, error: 'No video was deleted. This might be a database permissions (RLS) issue.' }
    }

    // Delete from Cloudinary if we have the credentials and URL
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET && videoData.video_url) {
      const publicId = extractPublicId(videoData.video_url)
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, { resource_type: 'video' })
          console.log(`Deleted ${publicId} from Cloudinary`)
        } catch (cloudinaryError) {
          console.error('Failed to delete from Cloudinary:', cloudinaryError)
          // We don't fail the whole action if Cloudinary fails, since DB row is already gone
        }
      }
    } else if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Cloudinary API credentials missing. Video was deleted from database but remains in Cloudinary storage.')
    }

    // Revalidate all pages to show the updated video lists
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    const err = error as Error
    console.error('Exception deleting video:', err)
    return { success: false, error: err.message || 'Unknown server error' }
  }
}

export async function updateVideoCaption(id: string, caption: string) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('videos')
      .update({ caption })
      .eq('id', id)
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    if (!data || data.length === 0) {
      return { success: false, error: 'No video was updated. This might be a database permissions (RLS) issue.' }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    const err = error as Error
    console.error('Exception updating video caption:', err)
    return { success: false, error: err.message || 'Unknown server error' }
  }
}
