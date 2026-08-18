'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Upload, X, Film, CheckCircle2, AlertCircle } from 'lucide-react'

const DEFAULT_CATEGORIES = [
  'Fashion', 
  'Food', 
  'Cars', 
  'Commercial', 
  'Social', 
  'Promo', 
  'BTS', 
  'Interior', 
  'Other'
]

export default function VideoUploadForm({ existingCategories = [] }: { existingCategories?: string[] }) {
  const ALL_CATEGORIES = Array.from(new Set([...DEFAULT_CATEGORIES, ...existingCategories]))
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [category, setCategory] = useState(ALL_CATEGORIES[0])
  const [isCustomCategory, setIsCustomCategory] = useState(false)
  const [caption, setCaption] = useState('')
  const [orientation, setOrientation] = useState('landscape')
  const [placement, setPlacement] = useState('work_page')
  
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const xhrRef = useRef<XMLHttpRequest | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const cancelUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort()
      xhrRef.current = null
    }
    setUploading(false)
    setUploadProgress(0)
    setMessage('Upload cancelled by user.')
    setIsError(true)
  }

  // Cleanup preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(URL.createObjectURL(selectedFile))
      setMessage('')
      setIsError(false)
      setUploadProgress(0)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreviewUrl(null)
    setUploadProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      setMessage('Please select a video file.')
      setIsError(true)
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setIsError(false)

    try {
      // 1. Upload video to Cloudinary with Progress Tracking
      setMessage('Uploading video...')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'dhruvil portfolio')

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'mj8jirbq'
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`

      const publicUrl = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhrRef.current = xhr
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100)
            setUploadProgress(percentComplete)
            setMessage(`Uploading video... ${percentComplete}%`)
          }
        }

        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText)
            setMessage('Processing video on server...')
            resolve(response.secure_url)
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText)
              reject(new Error(errorData.error?.message || 'Failed to upload to Cloudinary'))
            } catch {
              reject(new Error(`Failed with status: ${xhr.status}`))
            }
          }
        }

        xhr.onerror = () => reject(new Error('Network error during upload. Please check your internet connection.'))

        xhr.open('POST', cloudinaryUrl, true)
        xhr.send(formData)
      })

      // 2. Save metadata to Supabase database
      const { error: dbError } = await supabase
        .from('videos')
        .insert([
          {
            video_url: publicUrl,
            caption,
            category,
            orientation,
            placement,
          }
        ])

      if (dbError) throw dbError

      setMessage('Video uploaded successfully!')
      setIsError(false)
      
      // Reset form
      clearFile()
      setCaption('')
      setCategory(ALL_CATEGORIES[0])
      
      router.refresh()
      
    } catch (err) {
      const error = err as Error
      console.error("Upload error:", error)
      const errorText = error?.message || (typeof error === 'string' ? error : JSON.stringify(error))
      setMessage(`Upload failed: ${errorText}`)
      setIsError(true)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col bg-surface/50 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
        
        {/* Decorative gradient orb */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <Upload className="w-5 h-5 text-gray-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Upload Media</h2>
            <p className="text-xs text-gray-400 mt-0.5">Publish new content to your portfolio</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-6 relative z-10">
          
          {/* File Upload Area */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Video File</label>
            
            {!file ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-white/10 rounded-xl bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-white/30 hover:bg-white/10 transition-all duration-300 group/drop"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover/drop:scale-110 transition-transform">
                  <Film className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-300 font-medium">Click to select video</p>
                <p className="text-xs text-gray-500 mt-1">MP4, WebM, MOV</p>
              </div>
            ) : (
              <div className="relative w-full rounded-xl overflow-hidden bg-black border border-white/10 group/preview">
                <video 
                  src={previewUrl!} 
                  className="w-full h-48 object-cover opacity-80" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <p className="text-sm font-medium truncate text-white max-w-[80%]">{file.name}</p>
                </div>
                <button 
                  type="button"
                  onClick={clearFile}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500/80 transition-colors border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <input 
              type="file" 
              accept="video/*" 
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>

          {/* Placement, Category & Orientation Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Placement</label>
              <div className="relative">
                <select 
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value)}
                  className="w-full appearance-none rounded-lg px-3 py-3 bg-white/5 border border-white/10 text-white text-sm font-medium focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all cursor-pointer"
                >
                  <option value="work_page" className="bg-[#111]">Work Page (Gallery)</option>
                  <option value="home_page" className="bg-[#111]">Home Page (3D Stack)</option>
                  <option value="both" className="bg-[#111]">Both (Home & Work)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="10" height="6" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Category</label>
              <div className="relative">
                {!isCustomCategory ? (
                  <>
                    <select 
                      value={category}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setIsCustomCategory(true);
                          setCategory('');
                        } else {
                          setCategory(e.target.value);
                        }
                      }}
                      className="w-full appearance-none rounded-lg px-3 py-3 bg-white/5 border border-white/10 text-white text-sm font-medium focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all cursor-pointer"
                    >
                      {ALL_CATEGORIES.map(cat => (
                        <option key={cat} value={cat} className="bg-[#111]">{cat}</option>
                      ))}
                      <option value="custom" className="bg-[#111] italic text-purple-400">Custom...</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="10" height="6" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400" />
                      </svg>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Enter custom category"
                      className="w-full rounded-lg px-3 py-3 bg-white/5 border border-white/10 text-white text-sm font-medium focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all"
                      autoFocus
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(false);
                        setCategory(ALL_CATEGORIES[0]);
                      }}
                      className="text-gray-400 hover:text-white transition-colors"
                      title="Back to dropdown"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Aspect</label>
              <div className="flex gap-2 h-[46px] p-1 rounded-lg bg-white/5 border border-white/10">
                <button
                  type="button"
                  onClick={() => setOrientation('landscape')}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all ${orientation === 'landscape' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  <div className="w-3.5 h-2.5 border-2 border-current rounded-[2px]" />
                  4:3
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation('vertical')}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all ${orientation === 'vertical' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  <div className="w-2.5 h-3.5 border-2 border-current rounded-[2px]" />
                  9:16
                </button>
              </div>
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Caption / Notes</label>
            <textarea 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add context about this project..."
              className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-gray-500 h-28 resize-none focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all"
            />
          </div>

          {/* Status Message */}
          {(message || uploading) && (
            <div className="flex flex-col gap-3">
              {message && (
                <div className={`flex items-center gap-2 p-4 rounded-lg border text-sm ${isError ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'}`}>
                  {isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  <p>{message}</p>
                </div>
              )}
              
              {/* Dynamic Progress Bar */}
              {uploading && !isError && (
                <div className="w-full flex flex-col gap-1.5">
                  <div className="flex justify-between text-[10px] uppercase font-semibold text-gray-400">
                    <span>Uploading to Cloudinary</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                    <div 
                      className="absolute left-0 top-0 h-full transition-all duration-300 ease-out bg-emerald-500"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={uploading || !file}
            className="mt-2 relative w-full h-12 bg-white text-black font-bold rounded-lg overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 group/btn"
          >
            <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${uploading ? '-translate-y-full' : 'translate-y-0'}`}>
              Upload to Portfolio
            </span>
            <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-300 ${uploading ? 'translate-y-0' : 'translate-y-full'}`}>
              <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Processing...
            </span>
          </button>

          {/* Cancel Button */}
          {uploading && (
            <button
              type="button"
              onClick={cancelUpload}
              className="mt-3 w-full h-10 rounded-lg border border-red-500/30 text-red-400 font-medium hover:bg-red-500/10 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" /> Cancel Upload
            </button>
          )}

        </div>
      </form>
    </>
  )
}
