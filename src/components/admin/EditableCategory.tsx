'use client'

import { useState, useTransition } from 'react'
import { Pencil, Check, X, Loader2 } from 'lucide-react'
import { updateVideoCategory } from '@/app/admin/dashboard/actions'
import { useRouter } from 'next/navigation'

export default function EditableCategory({ id, initialCategory, categories }: { id: string, initialCategory: string, categories: string[] }) {
  const [isEditing, setIsEditing] = useState(false)
  const [category, setCategory] = useState(initialCategory)
  const [isCustom, setIsCustom] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSave = () => {
    const finalCategory = category.trim()
    if (!finalCategory || finalCategory === initialCategory) {
      setIsEditing(false)
      setCategory(initialCategory)
      setIsCustom(false)
      return
    }

    startTransition(async () => {
      try {
        const result = await updateVideoCategory(id, finalCategory)
        if (result && !result.success) {
          alert(`Failed to update category: ${result.error}`)
        } else {
          setIsEditing(false)
          setIsCustom(false)
          router.refresh()
        }
      } catch (error) {
        console.error('Failed to update category:', error)
        alert('Failed to update category. Please check the console.')
      }
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setCategory(initialCategory)
      setIsCustom(false)
    }
  }

  if (isEditing) {
    return (
      <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md rounded-md border border-white/20 p-1 flex items-center gap-2 shadow-xl z-20">
        {!isCustom ? (
          <select
            value={category}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setIsCustom(true)
                setCategory('')
              } else {
                setCategory(e.target.value)
              }
            }}
            className="text-[10px] font-semibold tracking-wider uppercase text-white/90 bg-transparent border-none outline-none cursor-pointer pr-2"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-[#111]">{cat}</option>
            ))}
            <option value="custom" className="bg-[#111] italic text-purple-400">Custom...</option>
          </select>
        ) : (
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-24 text-[10px] font-semibold tracking-wider uppercase text-white/90 bg-white/10 border border-white/20 rounded px-1 py-0.5 outline-none focus:border-white/50"
            placeholder="Category..."
          />
        )}
        
        <div className="flex items-center border-l border-white/20 pl-1">
          <button
            onClick={() => {
              setIsEditing(false)
              setCategory(initialCategory)
              setIsCustom(false)
            }}
            disabled={isPending}
            className="p-1 rounded-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            title="Cancel"
          >
            <X className="w-3 h-3" />
          </button>
          <button
            onClick={handleSave}
            disabled={isPending || (!category.trim() && isCustom)}
            className="p-1 rounded-sm text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50"
            title="Save"
          >
            {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute top-3 left-3 group/category z-20">
      <div className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-semibold tracking-wider uppercase text-white/90 border border-white/10 shadow-xl flex items-center gap-2 cursor-pointer hover:bg-black/80 hover:border-white/20 transition-all" onClick={() => setIsEditing(true)}>
        <span>{initialCategory}</span>
        <Pencil className="w-3 h-3 opacity-0 group-hover/category:opacity-100 transition-opacity text-gray-400" />
      </div>
    </div>
  )
}
