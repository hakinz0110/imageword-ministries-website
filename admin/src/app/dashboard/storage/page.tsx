'use client'

import { useState, useRef } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import StorageBrowser from '@/components/StorageBrowser'
import { Database, ChevronDown, Upload, FolderPlus, RefreshCw } from 'lucide-react'

const BUCKETS = [
  { name: 'project_image', label: 'Images', icon: '🖼️' },
  { name: 'project_logo', label: 'Logos', icon: '🎨' },
  { name: 'documents', label: 'Documents', icon: '📄' },
  { name: 'sermon_videos', label: 'Videos', icon: '🎥' },
  { name: 'sermon_audio', label: 'Audio', icon: '🎵' },
]

export default function StoragePage() {
  const [selectedBucket, setSelectedBucket] = useState(BUCKETS[0].name)
  const [showBucketMenu, setShowBucketMenu] = useState(false)
  const currentBucket = BUCKETS.find(b => b.name === selectedBucket)
  const browserRef = useRef<any>(null)

  const handleUploadClick = () => {
    browserRef.current?.triggerUpload()
  }

  const handleNewFolderClick = () => {
    browserRef.current?.createFolder()
  }

  return (
    <DashboardLayout>
      {/* Header with Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white">
            <Database className="w-5 h-5" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Storage</h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => browserRef.current?.refresh()}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 rounded-lg transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={2} />
          </button>
          <button
            onClick={handleNewFolderClick}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
          >
            <FolderPlus className="w-4 h-4" strokeWidth={2} />
            <span className="hidden sm:inline text-sm font-medium">New Folder</span>
          </button>
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
          >
            <Upload className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm font-medium">Upload</span>
          </button>
        </div>
      </div>

      {/* Bucket Selector */}
      <div className="mb-4 relative">
        {/* Mobile Dropdown */}
        <button
          onClick={() => setShowBucketMenu(!showBucketMenu)}
          className="md:hidden w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentBucket?.icon}</span>
            <span className="font-medium text-gray-900">{currentBucket?.label}</span>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showBucketMenu ? 'rotate-180' : ''}`} strokeWidth={2} />
        </button>

        {/* Mobile Dropdown Menu */}
        {showBucketMenu && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
            {BUCKETS.map((bucket) => (
              <button
                key={bucket.name}
                onClick={() => {
                  setSelectedBucket(bucket.name)
                  setShowBucketMenu(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                  selectedBucket === bucket.name
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{bucket.icon}</span>
                <span className="font-medium">{bucket.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Desktop Tabs */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          {BUCKETS.map((bucket) => (
            <button
              key={bucket.name}
              onClick={() => setSelectedBucket(bucket.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedBucket === bucket.name
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{bucket.icon}</span>
              <span>{bucket.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Storage Browser */}
      <StorageBrowser 
        ref={browserRef}
        bucket={selectedBucket}
        selectionMode={false}
      />
    </DashboardLayout>
  )
}
