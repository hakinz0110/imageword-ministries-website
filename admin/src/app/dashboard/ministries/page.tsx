'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase, type Ministry } from '@/lib/supabase'
import { Plus, Edit, Trash2, Users } from 'lucide-react'

export default function MinistriesPage() {
  const router = useRouter()
  const [ministries, setMinistries] = useState<Ministry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchMinistries()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/')
  }

  const fetchMinistries = async () => {
    try {
      const { data, error } = await supabase
        .from('ministries')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setMinistries(data || [])
    } catch (error) {
      console.error('Error fetching ministries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ministry?')) return

    try {
      const { error } = await supabase.from('ministries').delete().eq('id', id)
      if (error) throw error
      setMinistries(ministries.filter(m => m.id !== id))
    } catch (error) {
      console.error('Error deleting ministry:', error)
      alert('Failed to delete ministry')
    }
  }

  const toggleActive = async (ministry: Ministry) => {
    try {
      const { error } = await supabase
        .from('ministries')
        .update({ is_active: !ministry.is_active })
        .eq('id', ministry.id)

      if (error) throw error
      setMinistries(ministries.map(m => 
        m.id === ministry.id ? { ...m, is_active: !m.is_active } : m
      ))
    } catch (error) {
      console.error('Error updating ministry:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ministries</h1>
          <p className="text-gray-600 mt-2">Manage church ministries and programs</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/ministries/new')}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Ministry
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : ministries.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No ministries yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first ministry</p>
          <button
            onClick={() => router.push('/dashboard/ministries/new')}
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Ministry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ministries.map((ministry) => (
            <div key={ministry.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
              {ministry.image_url && (
                <img
                  src={ministry.image_url}
                  alt={ministry.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{ministry.name}</h3>
                  <button
                    onClick={() => toggleActive(ministry)}
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      ministry.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {ministry.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ministry.description}</p>
                {ministry.leader_name && (
                  <p className="text-sm text-gray-500 mb-4">
                    <span className="font-medium">Leader:</span> {ministry.leader_name}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/dashboard/ministries/${ministry.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ministry.id)}
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
