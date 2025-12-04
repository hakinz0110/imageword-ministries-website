'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase, type SiteSetting } from '@/lib/supabase'
import FileUpload from '@/components/FileUpload'
import { Save, Settings as SettingsIcon, Image as ImageIcon, Trash2, Plus } from 'lucide-react'

type CarouselImage = {
  id: string
  url: string
  order: number
}

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([])

  useEffect(() => {
    checkAuth()
    fetchSettings()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/')
  }

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key')

      if (error) throw error

      const settingsObj: Record<string, string> = {}
      const carouselData: CarouselImage[] = []

      data?.forEach(item => {
        if (item.key.startsWith('carousel_image_')) {
          carouselData.push({
            id: item.key,
            url: item.value || '',
            order: parseInt(item.key.replace('carousel_image_', ''))
          })
        } else {
          settingsObj[item.key] = item.value || ''
        }
      })

      setSettings(settingsObj)
      setCarouselImages(carouselData.sort((a, b) => a.order - b.order))
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleAddCarouselImage = () => {
    const newOrder = carouselImages.length
    setCarouselImages([...carouselImages, {
      id: `carousel_image_${newOrder}`,
      url: '',
      order: newOrder
    }])
  }

  const handleUpdateCarouselImage = (index: number, url: string) => {
    const updated = [...carouselImages]
    updated[index].url = url
    setCarouselImages(updated)
  }

  const handleRemoveCarouselImage = (index: number) => {
    const updated = carouselImages.filter((_, i) => i !== index)
    setCarouselImages(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Update regular settings
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
      }))

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(
            { key: update.key, value: update.value },
            { onConflict: 'key' }
          )

        if (error) throw error
      }

      // Delete all existing carousel images
      await supabase
        .from('site_settings')
        .delete()
        .like('key', 'carousel_image_%')

      // Insert new carousel images
      const carouselInserts = carouselImages
        .filter(img => img.url)
        .map((img, index) => ({
          key: `carousel_image_${index}`,
          value: img.url,
          description: `Carousel image ${index + 1}`
        }))

      if (carouselInserts.length > 0) {
        const { error } = await supabase
          .from('site_settings')
          .insert(carouselInserts)

        if (error) throw error
      }

      alert('Settings updated successfully!')
      fetchSettings()
    } catch (error) {
      console.error('Error updating settings:', error)
      alert('Failed to update settings')
    } finally {
      setSaving(false)
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-gray-600 mt-2">Manage church information and configuration</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Hero Section Content</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Title
              </label>
              <input
                type="text"
                value={settings.hero_title || ''}
                onChange={(e) => handleChange('hero_title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Experience God's Love and Grace"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Description
              </label>
              <textarea
                value={settings.hero_description || ''}
                onChange={(e) => handleChange('hero_description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Join us every Sunday..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bible Verse
              </label>
              <input
                type="text"
                value={settings.hero_verse || ''}
                onChange={(e) => handleChange('hero_verse', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder='"For where two or three gather..." - Matthew 18:20'
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button 1 Text
                </label>
                <input
                  type="text"
                  value={settings.hero_button1_text || ''}
                  onChange={(e) => handleChange('hero_button1_text', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Join Us This Sunday"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button 2 Text
                </label>
                <input
                  type="text"
                  value={settings.hero_button2_text || ''}
                  onChange={(e) => handleChange('hero_button2_text', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Watch Latest Sermon"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Church Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Church Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Church Name
              </label>
              <input
                type="text"
                value={settings.church_name || ''}
                onChange={(e) => handleChange('church_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mission Statement
              </label>
              <textarea
                value={settings.mission_statement || ''}
                onChange={(e) => handleChange('mission_statement', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Church Logo
              </label>
              <FileUpload
                bucket="project_logo"
                onUploadComplete={(url) => handleChange('logo_url', url)}
                currentUrl={settings.logo_url || ''}
                type="image"
              />
              <p className="text-xs text-gray-500 mt-2">Recommended: 400x200px, PNG with transparent background</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Filter Effect
              </label>
              <select
                value={settings.logo_filter || 'invert'}
                onChange={(e) => handleChange('logo_filter', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="none">None (Original Colors)</option>
                <option value="invert">Invert (White on Dark Background)</option>
                <option value="grayscale">Grayscale</option>
                <option value="sepia">Sepia</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">Choose how the logo appears in the navbar and footer (both have dark backgrounds)</p>
              
              {/* Logo Preview */}
              {settings.logo_url && (
                <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                  <p className="text-xs text-gray-400 mb-2">Preview on dark background:</p>
                  <img
                    src={settings.logo_url}
                    alt="Logo Preview"
                    className={`h-16 w-auto ${
                      settings.logo_filter === 'invert' ? 'brightness-0 invert' :
                      settings.logo_filter === 'grayscale' ? 'grayscale brightness-0 invert' :
                      settings.logo_filter === 'sepia' ? 'sepia brightness-0 invert' :
                      ''
                    }`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={settings.contact_phone || ''}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1
              </label>
              <input
                type="text"
                value={settings.address_line1 || ''}
                onChange={(e) => handleChange('address_line1', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                value={settings.address_line2 || ''}
                onChange={(e) => handleChange('address_line2', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={settings.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={settings.state || ''}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={settings.zip || ''}
                onChange={(e) => handleChange('zip', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={settings.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Service Times */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Service Times</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Time 1
              </label>
              <input
                type="text"
                value={settings.service_time_1 || ''}
                onChange={(e) => handleChange('service_time_1', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Sunday 9:00 AM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Time 2
              </label>
              <input
                type="text"
                value={settings.service_time_2 || ''}
                onChange={(e) => handleChange('service_time_2', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Sunday 11:00 AM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Time 3
              </label>
              <input
                type="text"
                value={settings.service_time_3 || ''}
                onChange={(e) => handleChange('service_time_3', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Wednesday 7:00 PM"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.facebook_url || ''}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                value={settings.youtube_url || ''}
                onChange={(e) => handleChange('youtube_url', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter URL
              </label>
              <input
                type="url"
                value={settings.twitter_url || ''}
                onChange={(e) => handleChange('twitter_url', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Hero Carousel Images */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Hero Carousel Images
              </h2>
              <p className="text-sm text-gray-600 mt-1">Images displayed in the homepage hero section</p>
            </div>
            <button
              type="button"
              onClick={handleAddCarouselImage}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              Add Image
            </button>
          </div>

          {carouselImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {carouselImages.map((image, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-700">Image {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCarouselImage(index)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                  <FileUpload
                    bucket="project_image"
                    onUploadComplete={(url) => handleUpdateCarouselImage(index, url)}
                    currentUrl={image.url}
                    type="image"
                    maxSizeMB={5}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
              <p className="font-medium">No carousel images yet</p>
              <p className="text-sm mt-1">Click "Add Image" to get started</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  )
}
