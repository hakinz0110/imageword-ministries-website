'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase, type Leadership } from '@/lib/supabase'
import { Plus, Edit, Trash2, UserCircle } from 'lucide-react'

export default function LeadershipPage() {
  const router = useRouter()
  const [leaders, setLeaders] = useState<Leadership[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchLeaders()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/')
  }

  const fetchLeaders = async () => {
    try {
      const { data, error } = await supabase
        .from('leadership')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setLeaders(data || [])
    } catch (error) {
      console.error('Error fetching leaders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this leader?')) return

    try {
      const { error } = await supabase.from('leadership').delete().eq('id', id)
      if (error) throw error
      setLeaders(leaders.filter(l => l.id !== id))
    } catch (error) {
      console.error('Error deleting leader:', error)
      alert('Failed to delete leader')
    }
  }

  const toggleActive = async (leader: Leadership) => {
    try {
      const { error } = await supabase
        .from('leadership')
        .update({ is_active: !leader.is_active })
        .eq('id', leader.id)

      if (error) throw error
      setLeaders(leaders.map(l => 
        l.id === leader.id ? { ...l, is_active: !l.is_active } : l
      ))
    } catch (error) {
      console.error('Error updating leader:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leadership Team</h1>
          <p className="text-gray-600 mt-2">Manage pastors, elders, and staff</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/leadership/new')}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Leader
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : leaders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <UserCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No leaders yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first leader</p>
          <button
            onClick={() => router.push('/dashboard/leadership/new')}
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Leader
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaders.map((leader) => (
            <div key={leader.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
              {leader.image_url ? (
                <img
                  src={leader.image_url}
                  alt={leader.name}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <UserCircle className="w-24 h-24 text-gray-400" />
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{leader.name}</h3>
                    <p className="text-sm text-primary-600 font-medium">{leader.title}</p>
                  </div>
                  <button
                    onClick={() => toggleActive(leader)}
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      leader.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {leader.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>
                {leader.bio && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{leader.bio}</p>
                )}
                {leader.email && (
                  <p className="text-sm text-gray-500 mb-2">{leader.email}</p>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => router.push(`/dashboard/leadership/${leader.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(leader.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
