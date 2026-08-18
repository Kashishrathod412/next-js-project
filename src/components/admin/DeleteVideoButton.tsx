'use client'

import { useTransition } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteVideo } from '@/app/admin/dashboard/actions'
import { useRouter } from 'next/navigation'

export default function DeleteVideoButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this video?')) {
      startTransition(async () => {
        try {
          const result = await deleteVideo(id)
          if (result && !result.success) {
            console.error('Delete failed:', result.error)
            alert(`Failed to delete: ${result.error}`)
          } else {
            router.refresh()
          }
        } catch (error) {
          console.error('Failed to delete video:', error)
          alert('Failed to delete video. Please check the console.')
        }
      })
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
      title="Delete video"
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  )
}
