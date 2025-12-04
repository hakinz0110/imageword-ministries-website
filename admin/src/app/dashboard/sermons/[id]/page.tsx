'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase, type Sermon } from '@/lib/supabase'
import FileUpload from '@/components/FileUpload'
import { ArrowLeft, Save } from 'lucide-react'

export default function EditSermonPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Sermon>>({})

  useEffect(() => {
    if (params.id) {
      fetchSermon(params.id as string)
    }
  }, [params.id])

  const fetchSermon = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setFormData(data)
    } catch (error) {
      console.error('Error fetching sermon:', error)
      alert('Failed to load sermon')
      router.push('/dashboard/sermons')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('sermons')
        .update(formData)
        .eq('id', params.id as string)

      if (error) throw error

      alert('Sermon updated successfully!')
      router.push('/dashboard/sermons')
    } catch (error) {
      console.error('Error updating sermon:', error)
      alert('Failed to update sermon')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Sermons
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Sermon</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-3xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sermon Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pastor/Speaker *
              </label>
              <input
                type="text"
                name="pastor"
                value={formData.pastor || ''}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sermon Date *
              </label>
              <input
                type="date"
                name="sermon_date"
                value={formData.sermon_date || ''}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Series Name
              </label>
              <input
                type="text"
                name="series_name"
                value={formData.series_name || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scripture Reference
              </label>
              <input
                type="text"
                name="scripture_reference"
                value={formData.scripture_reference || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video (URL or Upload)
            </label>
            <FileUpload
              bucket="sermon_videos"
              onUploadComplete={(url) => setFormData(prev => ({ ...prev, video_url: url }))}
              currentUrl={formData.video_url || ''}
              type="video"
              accept="video/*"
            />
            <p className="text-xs text-gray-500 mt-2">Or paste YouTube/Vimeo URL above</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Audio (URL or Upload)
            </label>
            <FileUpload
              bucket="sermon_audio"
              onUploadComplete={(url) => setFormData(prev => ({ ...prev, audio_url: url }))}
              currentUrl={formData.audio_url || ''}
              type="audio"
              accept="audio/*"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail Image
            </label>
            <FileUpload
              bucket="project_image"
              onUploadComplete={(url) => setFormData(prev => ({ ...prev, thumbnail_url: url }))}
              currentUrl={formData.thumbnail_url || ''}
              type="image"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured || false}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Feature this sermon on homepage
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_published"
              checked={formData.is_published || false}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Published
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  )
}
