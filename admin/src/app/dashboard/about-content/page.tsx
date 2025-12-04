'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'

type AboutContent = {
  description: string
  mission: string
  vision: string
  targetAudience: string
  coreValues: string[]
}

export default function AboutContentPage() {
  const [content, setContent] = useState<AboutContent>({
    description: '',
    mission: '',
    vision: '',
    targetAudience: '',
    coreValues: ['', '', '', '', '', '', '']
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .or('key.in.(about_description,about_mission,about_vision,about_target_audience),key.like.core_value_%')

      if (error) throw error

      const newContent: AboutContent = {
        description: '',
        mission: '',
        vision: '',
        targetAudience: '',
        coreValues: ['', '', '', '', '', '', '']
      }

      data?.forEach(item => {
        if (item.key === 'about_description') newContent.description = item.value
        if (item.key === 'about_mission') newContent.mission = item.value
        if (item.key === 'about_vision') newContent.vision = item.value
        if (item.key === 'about_target_audience') newContent.targetAudience = item.value
        if (item.key.startsWith('core_value_')) {
          const index = parseInt(item.key.replace('core_value_', '')) - 1
          if (index >= 0 && index < 7) newContent.coreValues[index] = item.value
        }
      })

      setContent(newContent)
    } catch (error) {
      console.error('Error fetching content:', error)
      alert('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates = [
        { key: 'about_description', value: content.description },
        { key: 'about_mission', value: content.mission },
        { key: 'about_vision', value: content.vision },
        { key: 'about_target_audience', value: content.targetAudience },
        ...content.coreValues.map((value, index) => ({
          key: `core_value_${index + 1}`,
          value: value
        }))
      ]

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ 
            key: update.key, 
            value: update.value,
            description: `About page - ${update.key}`
          }, { onConflict: 'key' })

        if (error) throw error
      }

      alert('About content saved successfully!')
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">About Page Content</h1>
        <p className="text-gray-600 mt-2">Manage the content displayed on the About page</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            About Description
          </label>
          <textarea
            value={content.description}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Main description about the ministry..."
          />
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mission Statement
            </label>
            <textarea
              value={content.mission}
              onChange={(e) => setContent({ ...content, mission: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Our mission..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vision Statement
            </label>
            <textarea
              value={content.vision}
              onChange={(e) => setContent({ ...content, vision: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Our vision..."
            />
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Audience
          </label>
          <textarea
            value={content.targetAudience}
            onChange={(e) => setContent({ ...content, targetAudience: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Who we serve..."
          />
        </div>

        {/* Core Values */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Core Values (7 values)
          </label>
          <div className="space-y-3">
            {content.coreValues.map((value, index) => (
              <input
                key={index}
                type="text"
                value={value}
                onChange={(e) => {
                  const newValues = [...content.coreValues]
                  newValues[index] = e.target.value
                  setContent({ ...content, coreValues: newValues })
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Core Value ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
