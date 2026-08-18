'use client'

import { useState, useTransition } from 'react'
import { Pencil, Check, X, Loader2 } from 'lucide-react'
import { updateVideoCaption } from '@/app/admin/dashboard/actions'
import { useRouter } from 'next/navigation'

export default function EditableCaption({ id, initialCaption }: { id: string, initialCaption: string | null }) {
  const [isEditing, setIsEditing] = useState(false)
  const [caption, setCaption] = useState(initialCaption || '')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSave = () => {
    if (caption === initialCaption) {
      setIsEditing(false)
      return
    }

    startTransition(async () => {
      try {
        const result = await updateVideoCaption(id, caption)
        if (result && !result.success) {
          alert(`Failed to update caption: ${result.error}`)
        } else {
          setIsEditing(false)
          router.refresh()
        }
      } catch (error) {
        console.error('Failed to update caption:', error)
        alert('Failed to update caption. Please check the console.')
      }
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setCaption(initialCaption || '')
    }
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2">
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full text-sm bg-white/10 border border-white/20 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/50 resize-none h-20"
          placeholder="Enter caption..."
        />
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => {
              setIsEditing(false)
              setCaption(initialCaption || '')
            }}
            disabled={isPending}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="p-1 rounded-md text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 transition-colors disabled:opacity-50"
            title="Save"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="group/caption relative pr-8">
      {caption ? (
        <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
          {caption}
        </p>
      ) : (
        <p className="text-sm text-gray-600 italic">No caption provided.</p>
      )}
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-0 right-0 p-1 opacity-0 group-hover/caption:opacity-100 transition-opacity rounded-md text-gray-400 hover:text-white hover:bg-white/10"
        title="Edit caption"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
