'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import FileUpload from '@/components/FileUpload'
import { supabase, type Event } from '@/lib/supabase'
import { ArrowLeft, Save, Eye, Calendar, MapPin, Users, Link as LinkIcon, Image as ImageIcon, FileText, Trash2 } from 'lucide-react'

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    end_date: '',
    location: '',
    image_url: '',
    flyer_url: '',
    category: 'Worship',
    is_recurring: false,
    recurring_schedule: '',
    registration_link: '',
    max_attendees: '',
    is_published: false,
  })

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single()

      if (error) throw error

      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          event_date: data.event_date ? new Date(data.event_date).toISOString().slice(0, 16) : '',
          end_date: data.end_date ? new Date(data.end_date).toISOString().slice(0, 16) : '',
          location: data.location || '',
          image_url: data.image_url || '',
          flyer_url: data.flyer_url || '',
          category: data.category || 'Worship',
          is_recurring: data.is_recurring || false,
          recurring_schedule: data.recurring_schedule || '',
          registration_link: data.registration_link || '',
          max_attendees: data.max_attendees?.toString() || '',
          is_published: data.is_published || false,
        })
      }
    } catch (error: any) {
      console.error('Error fetching event:', error)
      alert('Failed to load event')
      router.push('/dashboard/events')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, publish?: boolean) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('events')
        .update({
          ...formData,
          is_published: publish !== undefined ? publish : formData.is_published,
          max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        })
        .eq('id', eventId)

      if (error) throw error

      alert('Event updated successfully!')
      router.push('/dashboard/events')
    } catch (error: any) {
      console.error('Error updating event:', error)
      alert('Failed to update event: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      alert('Event deleted successfully!')
      router.push('/dashboard/events')
    } catch (error: any) {
      console.error('Error deleting event:', error)
      alert('Failed to delete event: ' + error.message)
      setDeleting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
            <span className="text-sm font-medium">Back to Events</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Event</h1>
              <p className="text-gray-600 mt-2">Update event details and media</p>
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 border border-red-200/60 rounded-xl hover:bg-red-100 transition-all font-medium disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2} />
              Delete Event
            </button>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
          {/* Main Content Card */}
          <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
            <div className="p-8 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400"
                  placeholder="e.g., Sunday Worship Service"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400 resize-none"
                  placeholder="Describe your event..."
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <Calendar className="w-4 h-4" strokeWidth={2} />
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <Calendar className="w-4 h-4" strokeWidth={2} />
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Location & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <MapPin className="w-4 h-4" strokeWidth={2} />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400"
                    placeholder="e.g., Main Sanctuary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  >
                    <option value="Worship">Worship</option>
                    <option value="Youth">Youth</option>
                    <option value="Outreach">Outreach</option>
                    <option value="Prayer">Prayer</option>
                    <option value="Conference">Conference</option>
                    <option value="Community">Community</option>
                  </select>
                </div>
              </div>

              {/* Registration & Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <LinkIcon className="w-4 h-4" strokeWidth={2} />
                    Registration Link
                  </label>
                  <input
                    type="url"
                    name="registration_link"
                    value={formData.registration_link}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <Users className="w-4 h-4" strokeWidth={2} />
                    Max Attendees
                  </label>
                  <input
                    type="number"
                    name="max_attendees"
                    value={formData.max_attendees}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400"
                    placeholder="Leave empty for unlimited"
                  />
                </div>
              </div>

              {/* Recurring Event */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200/60">
                <input
                  type="checkbox"
                  name="is_recurring"
                  checked={formData.is_recurring}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">
                    Recurring Event
                  </label>
                  <p className="text-xs text-gray-600 mb-3">This event repeats on a regular schedule</p>
                  {formData.is_recurring && (
                    <input
                      type="text"
                      name="recurring_schedule"
                      value={formData.recurring_schedule}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400"
                      placeholder="e.g., Every Sunday at 9:00 AM"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Media Upload Card */}
          <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200/60">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" strokeWidth={2} />
                Event Media
              </h2>
              <p className="text-sm text-gray-600 mt-1">Upload images and documents for your event</p>
            </div>
            <div className="p-8 space-y-8">
              {/* Event Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Event Image
                </label>
                <FileUpload
                  bucket="project_image"
                  folder="events"
                  type="image"
                  accept="image/*"
                  maxSizeMB={5}
                  currentUrl={formData.image_url}
                  onUploadComplete={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                />
              </div>

              {/* Event Flyer */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                  <FileText className="w-4 h-4" strokeWidth={2} />
                  Event Flyer (PDF)
                </label>
                <FileUpload
                  bucket="documents"
                  folder="flyers"
                  type="document"
                  accept="application/pdf,image/*"
                  maxSizeMB={10}
                  currentUrl={formData.flyer_url}
                  onUploadComplete={(url) => setFormData(prev => ({ ...prev, flyer_url: url }))}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 bg-white rounded-2xl border border-gray-200/60 shadow-sm p-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-200/60 rounded-xl hover:bg-gray-50 transition-all font-medium"
            >
              Cancel
            </button>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-200/60 rounded-xl hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
              >
                <Save className="w-4 h-4" strokeWidth={2} />
                Save Changes
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, !formData.is_published)}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all font-medium shadow-lg shadow-gray-900/10 disabled:opacity-50"
              >
                <Eye className="w-4 h-4" strokeWidth={2} />
                {formData.is_published ? 'Unpublish' : 'Publish'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
