'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'

type ContactInfo = {
  address: string
  phone: string
  email: string
  serviceTimes: string
  mapEmbed: string
}

// Extract URL from iframe HTML or return cleaned URL
const extractMapUrl = (input: string): string => {
  if (!input) return ''
  
  const trimmed = input.trim()
  
  // If it contains <iframe, extract the src attribute
  if (trimmed.includes('<iframe') || trimmed.includes('src=')) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/)
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1]
    }
  }
  
  // If it's already a valid Google Maps embed URL, return as-is
  if (trimmed.startsWith('https://www.google.com/maps/embed') || 
      trimmed.startsWith('https://maps.google.com/maps')) {
    return trimmed
  }
  
  // If it's a Google Maps share link, convert to embed format
  if (trimmed.includes('google.com/maps') && trimmed.includes('@')) {
    // Extract coordinates from URL like https://www.google.com/maps/@7.2571,5.2058,17z
    const coordMatch = trimmed.match(/@([-\d.]+),([-\d.]+)/)
    if (coordMatch) {
      return `https://www.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed`
    }
  }
  
  // Return as-is if it looks like a URL
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return trimmed
  }
  
  return ''
}

// Generate map URL from address
const getMapUrlFromAddress = (address: string): string => {
  if (!address) return ''
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
}

export default function ContactInfoPage() {
  const [info, setInfo] = useState<ContactInfo>({
    address: '',
    phone: '',
    email: '',
    serviceTimes: '',
    mapEmbed: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    fetchInfo()
  }, [])

  const fetchInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['contact_address', 'contact_phone', 'contact_email', 'service_times', 'contact_map_embed', 'address_line1', 'city', 'state', 'country'])

      if (error) throw error

      const newInfo: ContactInfo = {
        address: '',
        phone: '',
        email: '',
        serviceTimes: '',
        mapEmbed: ''
      }

      let addressLine1 = ''
      let city = ''
      let state = ''
      let country = ''

      data?.forEach(item => {
        if (item.key === 'contact_address') newInfo.address = item.value
        if (item.key === 'contact_phone') newInfo.phone = item.value
        if (item.key === 'contact_email') newInfo.email = item.value
        if (item.key === 'service_times') newInfo.serviceTimes = item.value
        if (item.key === 'contact_map_embed') newInfo.mapEmbed = item.value
        if (item.key === 'address_line1') addressLine1 = item.value
        if (item.key === 'city') city = item.value
        if (item.key === 'state') state = item.value
        if (item.key === 'country') country = item.value
      })

      // Use address_line1 if contact_address is placeholder or empty
      if (!newInfo.address || newInfo.address.includes('123 Church Street')) {
        newInfo.address = [addressLine1, city, state, country].filter(Boolean).join(', ').trim()
      }

      setInfo(newInfo)
    } catch (error) {
      console.error('Error fetching info:', error)
      alert('Failed to load contact information')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Extract clean URL from embed code before saving
      const cleanMapUrl = extractMapUrl(info.mapEmbed)
      
      const updates = [
        { key: 'contact_address', value: info.address, description: 'Church physical address' },
        { key: 'contact_phone', value: info.phone, description: 'Church phone number' },
        { key: 'contact_email', value: info.email, description: 'Church email address' },
        { key: 'service_times', value: info.serviceTimes, description: 'Service times schedule' },
        { key: 'contact_map_embed', value: cleanMapUrl, description: 'Google Maps embed URL' }
      ]

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(update, { onConflict: 'key' })

        if (error) throw error
      }

      // Update local state with cleaned URL
      if (cleanMapUrl !== info.mapEmbed) {
        setInfo(prev => ({ ...prev, mapEmbed: cleanMapUrl }))
      }

      alert('Contact information saved successfully!')
    } catch (error) {
      console.error('Error saving info:', error)
      alert('Failed to save contact information')
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
        <h1 className="text-3xl font-bold text-gray-900">Contact Information</h1>
        <p className="text-gray-600 mt-2">Manage the contact details displayed on the Contact page</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Church Address
          </label>
          <input
            type="text"
            value={info.address}
            onChange={(e) => setInfo({ ...info, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="123 Church Street, City, State 12345"
          />
        </div>

        {/* Phone & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={info.phone}
              onChange={(e) => setInfo({ ...info, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="(123) 456-7890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={info.email}
              onChange={(e) => setInfo({ ...info, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="info@church.com"
            />
          </div>
        </div>

        {/* Service Times */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Times
          </label>
          <textarea
            value={info.serviceTimes}
            onChange={(e) => setInfo({ ...info, serviceTimes: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Sunday: 9:00 AM & 11:00 AM&#10;Wednesday: 7:00 PM"
          />
          <p className="text-sm text-gray-500 mt-1">Use line breaks for multiple service times</p>
        </div>

        {/* Map Embed URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Maps Embed Code or URL (Optional)
          </label>
          <textarea
            value={info.mapEmbed}
            onChange={(e) => {
              setMapError(false)
              setInfo({ ...info, mapEmbed: e.target.value })
            }}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder='Paste the entire <iframe> code OR just the URL from Google Maps'
          />
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-1">How to get the embed code:</p>
            <ol className="text-xs text-blue-700 list-decimal list-inside space-y-1">
              <li>Go to Google Maps and search for your church location</li>
              <li>Click "Share" button</li>
              <li>Click "Embed a map" tab</li>
              <li>Click "Copy HTML" and paste the entire code here</li>
            </ol>
            <p className="text-xs text-blue-600 mt-2">
              <strong>Note:</strong> If left empty, the map will use the address field above.
            </p>
          </div>
          
          {/* Map Preview */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">
                Map Preview {extractMapUrl(info.mapEmbed) ? '(using embed code)' : '(using address)'}:
              </p>
              {mapError && (
                <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                  Map failed to load - check your embed code
                </span>
              )}
            </div>
            <div className="rounded-lg overflow-hidden h-72 bg-gray-100 border border-gray-200">
              {(() => {
                const embedUrl = extractMapUrl(info.mapEmbed)
                const addressUrl = getMapUrlFromAddress(info.address)
                const finalUrl = embedUrl || addressUrl
                
                if (finalUrl) {
                  return (
                    <iframe
                      key={finalUrl}
                      src={finalUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                      title="Map Preview"
                      onError={() => setMapError(true)}
                      onLoad={() => setMapError(false)}
                    />
                  )
                }
                
                return (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Enter an address or paste embed code to see map preview
                  </div>
                )
              })()}
            </div>
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
