'use client'

import { useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, X, Image as ImageIcon, Video, Music, File, Check, AlertCircle, FolderOpen } from 'lucide-react'
import StorageBrowser from './StorageBrowser'

type FileUploadProps = {
  bucket: string
  onUploadComplete: (url: string) => void
  currentUrl?: string
  accept?: string
  type?: 'image' | 'video' | 'audio' | 'document' | 'any'
  maxSizeMB?: number
  folder?: string
}

export default function FileUpload({ 
  bucket, 
  onUploadComplete, 
  currentUrl, 
  accept = 'image/*',
  type = 'image',
  maxSizeMB = 5,
  folder = ''
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [showStorageBrowser, setShowStorageBrowser] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file size
    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > maxSizeMB) {
      return `File size must be less than ${maxSizeMB}MB`
    }

    // Check file type
    const fileType = file.type
    if (accept !== '*' && !fileType.match(accept.replace('*', '.*'))) {
      return 'Invalid file type'
    }

    return null
  }

  const handleFileSelect = async (file: File) => {
    setError(null)
    setSuccess(false)

    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    // Show preview for images
    if (type === 'image' && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }

    // Upload to Supabase
    setUploading(true)
    setProgress(0)
    
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = folder ? `${folder}/${fileName}` : fileName

      // Simulate progress (Supabase doesn't provide real progress)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      clearInterval(progressInterval)
      setProgress(100)

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      onUploadComplete(data.publicUrl)
      setPreview(data.publicUrl)
      setSuccess(true)
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      console.error('Error uploading file:', error)
      setError(error.message || 'Failed to upload file')
      setPreview(currentUrl || null)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }, [])

  const handleRemove = () => {
    setPreview(null)
    setError(null)
    setSuccess(false)
    onUploadComplete('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getIcon = () => {
    const iconClass = "w-10 h-10 transition-all duration-300"
    switch (type) {
      case 'video': return <Video className={iconClass} strokeWidth={1.5} />
      case 'audio': return <Music className={iconClass} strokeWidth={1.5} />
      case 'document': return <File className={iconClass} strokeWidth={1.5} />
      default: return <ImageIcon className={iconClass} strokeWidth={1.5} />
    }
  }

  const getFileTypeText = () => {
    switch (type) {
      case 'video': return 'Video'
      case 'audio': return 'Audio'
      case 'document': return 'Document'
      default: return 'Image'
    }
  }

  return (
    <div className="space-y-3">
      {/* Storage Browser Modal */}
      {showStorageBrowser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/60">
              <h2 className="text-xl font-bold text-gray-900">Browse Storage</h2>
              <button
                onClick={() => setShowStorageBrowser(false)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <StorageBrowser
                bucket={bucket}
                selectionMode={true}
                selectedUrl={preview || ''}
                onSelectFile={(url) => {
                  setPreview(url)
                  onUploadComplete(url)
                  setShowStorageBrowser(false)
                  setError(null)
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Preview Section */}
      {preview && type === 'image' ? (
        <div className="space-y-3">
          <div className="relative group">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200/60 bg-gradient-to-br from-gray-50 to-white shadow-sm">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              
              {/* Remove button */}
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-gray-700 rounded-xl p-2 hover:bg-red-500 hover:text-white transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>

              {/* Success indicator */}
              {success && (
                <div className="absolute top-3 left-3 bg-emerald-500 text-white rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                  <span className="text-xs font-medium">Uploaded</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Browse Storage Button - Always visible */}
          <button
            type="button"
            onClick={() => setShowStorageBrowser(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200/60 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all group"
          >
            <FolderOpen className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" strokeWidth={2} />
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              Change from Storage
            </span>
          </button>
        </div>
      ) : preview && (type === 'video' || type === 'audio' || type === 'document') ? (
        <div className="relative group">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200/60 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white shadow-md">
                {type === 'video' ? <Video className="w-7 h-7" strokeWidth={2} /> : 
                 type === 'audio' ? <Music className="w-7 h-7" strokeWidth={2} /> : 
                 <File className="w-7 h-7" strokeWidth={2} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{preview.split('/').pop()}</p>
                <p className="text-xs text-gray-500 mt-0.5">File uploaded successfully</p>
              </div>
            </div>
            
            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-3 right-3 bg-white text-gray-700 rounded-xl p-2 hover:bg-red-500 hover:text-white transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group ${
            isDragging
              ? 'border-gray-900 bg-gray-50 scale-[1.02]'
              : uploading
              ? 'border-gray-300 bg-gray-50'
              : 'border-gray-200/60 bg-gradient-to-br from-gray-50/50 to-white hover:border-gray-900 hover:shadow-lg hover:shadow-gray-900/5'
          }`}
        >
          <div className="p-8 flex flex-col items-center justify-center min-h-[240px]">
            {uploading ? (
              <>
                {/* Upload Progress */}
                <div className="relative w-20 h-20 mb-4">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                      className="text-gray-900 transition-all duration-300"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-900">{progress}%</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">Uploading...</p>
                <p className="text-xs text-gray-500 mt-1">Please wait</p>
              </>
            ) : (
              <>
                {/* Upload Icon */}
                <div className={`relative mb-4 transition-all duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-105'}`}>
                  <div className="absolute inset-0 bg-gray-900 rounded-2xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                    {getIcon()}
                  </div>
                </div>

                {/* Text */}
                <div className="text-center space-y-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {isDragging ? 'Drop file here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getFileTypeText()} • Max {maxSizeMB}MB
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-gray-900/5 to-transparent rounded-full blur-2xl" />
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tr from-gray-900/5 to-transparent rounded-full blur-2xl" />
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={onFileInputChange}
        className="hidden"
        disabled={uploading}
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200/60 rounded-xl animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" strokeWidth={2} />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Browse Storage & URL Input (when no preview) */}
      {!preview && !uploading && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200/60" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-500 font-medium">Or</span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => setShowStorageBrowser(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200/60 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all group"
          >
            <FolderOpen className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" strokeWidth={2} />
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              Browse Storage
            </span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200/60" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-500 font-medium">Or enter URL</span>
            </div>
          </div>
          
          <input
            type="url"
            value={currentUrl || ''}
            onChange={(e) => {
              setPreview(e.target.value)
              onUploadComplete(e.target.value)
              setError(null)
            }}
            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400"
            placeholder="https://example.com/image.jpg"
          />
        </>
      )}
    </div>
  )
}
