'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'
import { Heart, Mail, Calendar, Trash2 } from 'lucide-react'

type Prayer = {
  id: string
  name: string
  email: string
  prayer_request: string
  created_at: string
}

export default function PrayersPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrayers()
  }, [])

  const fetchPrayers = async () => {
    try {
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPrayers(data || [])
    } catch (error) {
      console.error('Error fetching prayers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this prayer request?')) return

    try {
      const { error } = await supabase
        .from('prayer_requests')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchPrayers()
    } catch (error) {
      console.error('Error deleting prayer:', error)
      alert('Failed to delete prayer request')
    }
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

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white shadow-lg">
            <Heart className="w-6 h-6" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Prayer Requests</h1>
            <p className="text-gray-600 mt-1">View and manage prayer requests from your community</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : prayers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-12 text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Prayer Requests</h3>
          <p className="text-gray-600">Prayer requests will appear here when submitted</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {prayers.map((prayer) => (
            <div
              key={prayer.id}
              className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-6 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                      <Heart className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">{prayer.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" strokeWidth={2} />
                          {prayer.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" strokeWidth={2} />
                          {formatDate(prayer.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/60">
                    <p className="text-gray-700 whitespace-pre-wrap">{prayer.prayer_request}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(prayer.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
