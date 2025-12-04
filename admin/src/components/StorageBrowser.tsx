'use client'

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Folder, 
  File, 
  Image as ImageIcon, 
  Video, 
  Music, 
  FileText,
  Download,
  Trash2,
  Upload,
  X,
  Check,
  ChevronRight,
  Home,
  Search,
  RefreshCw
} from 'lucide-react'

type StorageFile = {
  name: string
  id: string | null
  updated_at: string | null
  created_at: string | null
  last_accessed_at: string | null
  metadata: Record<string, any> | null
}

type StorageBrowserProps = {
  bucket: string
  onSelectFile?: (url: string, file: StorageFile) => void
  selectionMode?: boolean
  selectedUrl?: string
}

const StorageBrowser = forwardRef(function StorageBrowser({ 
  bucket, 
  onSelectFile,
  selectionMode = false,
  selectedUrl = ''
}: StorageBrowserProps, ref) {
  const [files, setFiles] = useState<StorageFile[]>([])
  const [folders, setFolders] = useState<string[]>([])
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [showNewFolderInput, setShowNewFolderInput] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadFiles()
  }, [bucket, currentPath])

  const loadFiles = async () => {
    setLoading(true)
    try {
      const path = currentPath.join('/')
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path || undefined, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        })

      if (error) throw error

      if (data) {
        const filesList = data.filter(item => item.id !== null) as StorageFile[]
        const foldersList = data
          .filter(item => item.id === null)
          .map(item => item.name)
        
        setFiles(filesList)
        setFolders(foldersList)
      }
    } catch (error) {
      console.error('Error loading files:', error)
    } finally {
      setLoading(false)
    }
  }

  const navigateToFolder = (folderName: string) => {
    setCurrentPath([...currentPath, folderName])
  }

  const navigateUp = () => {
    setCurrentPath(currentPath.slice(0, -1))
  }

  const navigateToRoot = () => {
    setCurrentPath([])
  }

  const navigateToBreadcrumb = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1))
  }

  const getFileUrl = (fileName: string) => {
    const path = [...currentPath, fileName].join('/')
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  const handleFileSelect = (file: StorageFile) => {
    const url = getFileUrl(file.name)
    if (onSelectFile) {
      onSelectFile(url, file)
    }
  }

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Delete ${fileName}?`)) return

    try {
      const path = [...currentPath, fileName].join('/')
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) throw error
      loadFiles()
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Failed to delete file')
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const path = currentPath.length > 0 
        ? `${currentPath.join('/')}/${file.name}`
        : file.name

      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error
      loadFiles()
    } catch (error: any) {
      console.error('Error uploading:', error)
      alert(error.message || 'Failed to upload file')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    try {
      // Create a placeholder file in the folder to make it exist
      const folderPath = currentPath.length > 0 
        ? `${currentPath.join('/')}/${newFolderName}/.placeholder`
        : `${newFolderName}/.placeholder`

      const { error } = await supabase.storage
        .from(bucket)
        .upload(folderPath, new Blob([''], { type: 'text/plain' }), {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error
      setNewFolderName('')
      setShowNewFolderInput(false)
      loadFiles()
    } catch (error: any) {
      console.error('Error creating folder:', error)
      alert(error.message || 'Failed to create folder')
    }
  }

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    triggerUpload: () => fileInputRef.current?.click(),
    createFolder: () => setShowNewFolderInput(true),
    refresh: () => loadFiles()
  }))

  const getFileIcon = (mimetype?: string) => {
    if (!mimetype) return <File className="w-5 h-5" strokeWidth={2} />
    if (mimetype.startsWith('image/')) return <ImageIcon className="w-5 h-5" strokeWidth={2} />
    if (mimetype.startsWith('video/')) return <Video className="w-5 h-5" strokeWidth={2} />
    if (mimetype.startsWith('audio/')) return <Music className="w-5 h-5" strokeWidth={2} />
    if (mimetype.includes('pdf') || mimetype.includes('document')) return <FileText className="w-5 h-5" strokeWidth={2} />
    return <File className="w-5 h-5" strokeWidth={2} />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredFolders = folders.filter(folder =>
    folder.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-[calc(100vh-20rem)] md:h-[calc(100vh-16rem)] bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
      />

      {/* Breadcrumb Navigation with Back Button */}
      {currentPath.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50">
          <button
            onClick={navigateUp}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
          >
            <ChevronRight className="w-4 h-4 rotate-180" strokeWidth={2} />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1">
            <button
              onClick={navigateToRoot}
              className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all flex-shrink-0"
            >
              <Home className="w-4 h-4" strokeWidth={2} />
            </button>
            {currentPath.map((folder, index) => (
              <div key={index} className="flex items-center gap-1 flex-shrink-0">
                <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={2} />
                <button
                  onClick={() => navigateToBreadcrumb(index)}
                  className="px-2 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-white rounded-lg transition-all font-medium max-w-[120px] truncate"
                >
                  {folder}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-3 sm:px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="p-3">
            {/* New Folder Input */}
            {showNewFolderInput && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <Folder className="w-5 h-5 text-gray-600 flex-shrink-0" strokeWidth={2} />
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateFolder()
                      if (e.key === 'Escape') {
                        setShowNewFolderInput(false)
                        setNewFolderName('')
                      }
                    }}
                    placeholder="Folder name..."
                    autoFocus
                    className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <button
                    onClick={handleCreateFolder}
                    disabled={!newFolderName.trim()}
                    className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowNewFolderInput(false)
                      setNewFolderName('')
                    }}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}

            {/* Folders */}
            {filteredFolders.length > 0 && (
              <div className="mb-2">
                {filteredFolders.map((folder) => (
                  <button
                    key={folder}
                    onClick={() => navigateToFolder(folder)}
                    className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-all group"
                  >
                    <Folder className="w-5 h-5 text-gray-600 flex-shrink-0" strokeWidth={2} />
                    <span className="flex-1 text-left text-sm font-medium text-gray-900 truncate">{folder}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-all flex-shrink-0" strokeWidth={2} />
                  </button>
                ))}
              </div>
            )}

            {/* Files */}
            {filteredFiles.length > 0 ? (
              <div>
                {filteredFiles.map((file) => {
                  const fileUrl = getFileUrl(file.name)
                  const isSelected = selectionMode && selectedUrl === fileUrl
                  const isImage = file.metadata?.mimetype?.startsWith('image/')
                  
                  return (
                    <div
                      key={file.id}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
                        isSelected 
                          ? 'bg-gray-900 text-white' 
                          : 'hover:bg-gray-50 active:bg-gray-100'
                      }`}
                    >
                      {/* Preview/Icon */}
                      <div className="flex-shrink-0">
                        {isImage ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <img
                              src={fileUrl}
                              alt={file.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-white/20' : 'bg-gray-100'
                          }`}>
                            {getFileIcon(file.metadata?.mimetype)}
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isSelected ? 'text-white' : 'text-gray-900'
                        }`}>
                          {file.name}
                        </p>
                        <p className={`text-xs truncate ${
                          isSelected ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {file.metadata?.size ? formatFileSize(file.metadata.size) : 'Unknown'}
                          <span className="hidden sm:inline"> • {file.updated_at ? formatDate(file.updated_at) : 'Unknown'}</span>
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {selectionMode ? (
                          <button
                            onClick={() => handleFileSelect(file)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                              isSelected
                                ? 'bg-white text-gray-900'
                                : 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-4 h-4" strokeWidth={2} />
                                <span className="hidden sm:inline">Selected</span>
                              </>
                            ) : (
                              <>
                                <span className="hidden sm:inline">Select</span>
                                <span className="sm:hidden">+</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <>
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100"
                              title="Download"
                            >
                              <Download className="w-4 h-4" strokeWidth={2} />
                            </a>
                            <button
                              onClick={() => handleDelete(file.name)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" strokeWidth={2} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16 text-gray-500 px-4">
                <File className="w-12 h-12 mx-auto mb-3 text-gray-300" strokeWidth={1.5} />
                <p className="text-sm font-medium">No files found</p>
                <p className="text-xs mt-1">Upload files to get started</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
})

export default StorageBrowser
