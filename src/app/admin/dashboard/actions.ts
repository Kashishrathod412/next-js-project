'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteVideo(id: string) {
  const supabase = createClient()
  await supabase.from('videos').delete().eq('id', id)
  
  // Revalidate all pages to show the updated video lists
  revalidatePath('/admin/dashboard')
  revalidatePath('/')
  revalidatePath('/work')
}
