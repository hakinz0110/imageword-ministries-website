'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase, type Sermon } from '@/lib/supabase'
import { Plus, Edit, Trash2, Video, Eye } from 'lucide-react'
import { format } from 'date-fns'

export default function SermonsPage() {
  const router = useRouter()
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSermons, setSelectedSermons] = useState<string[]>([])

  useEffect(() => {
    checkAuth()
    fetchSermons()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/')
  }

  const fetchSermons = async () => {
    try {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .order('sermon_date', { ascending: false })

      if (error) throw error
      setSermons(data || [])
      setFilteredSermons(data || [])
    } catch (error) {
      console.error('Error fetching sermons:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (searchTerm) {
      setFilteredSermons(sermons.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.pastor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.series_name?.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    } else {
      setFilteredSermons(sermons)
    }
  }, [searchTerm, sermons])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sermon?')) return

    setDeleting(id)
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('You must be logged in to delete sermons')
        router.push('/')
        return
      }

      const { error, count } = await supabase
        .from('sermons')
        .delete()
        .eq('id', id)
        .select()

      if (error) {
        console.error('Delete error:', error)
        throw new Error(error.message || 'Failed to delete sermon')
      }

      // Update local state after successful deletion
      setSermons(prev => prev.filter(s => s.id !== id))
      setFilteredSermons(prev => prev.filter(s => s.id !== id))
      
    } catch (error: any) {
      console.error('Error deleting sermon:', error)
      alert(`Failed to delete sermon: ${error.message || 'Unknown error'}`)
    } finally {
      setDeleting(null)
    }
  }

  const togglePublish = async (sermon: Sermon) => {
    try {
      const { error } = await supabase
        .from('sermons')
        .update({ is_published: !sermon.is_published })
        .eq('id', sermon.id)

      if (error) throw error
      setSermons(sermons.map(s => 
        s.id === sermon.id ? { ...s, is_published: !s.is_published } : s
      ))
    } catch (error) {
      console.error('Error updating sermon:', error)
    }
  }

  const toggleFeatured = async (sermon: Sermon) => {
    try {
      const { error } = await supabase
        .from('sermons')
        .update({ is_featured: !sermon.is_featured })
        .eq('id', sermon.id)

      if (error) throw error
      setSermons(sermons.map(s => 
        s.id === sermon.id ? { ...s, is_featured: !s.is_featured } : s
      ))
    } catch (error) {
      console.error('Error updating sermon:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sermons</h1>
            <p className="text-gray-600 mt-2">Manage sermon recordings and messages</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/sermons/new')}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Sermon
          </button>
        </div>
        <input
          type="text"
          placeholder="Search sermons by title, pastor, or series..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {selectedSermons.length > 0 && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={async () => {
                await supabase.from('sermons').update({ is_published: true }).in('id', selectedSermons)
                fetchSermons()
                setSelectedSermons([])
              }}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              Publish ({selectedSermons.length})
            </button>
            <button
              onClick={async () => {
                if (confirm(`Delete ${selectedSermons.length} sermons?`)) {
                  try {
                    const { error } = await supabase.from('sermons').delete().in('id', selectedSermons)
                    if (error) {
                      console.error('Bulk delete error:', error)
                      alert(`Failed to delete sermons: ${error.message}`)
                      return
                    }
                    await fetchSermons()
                    setSelectedSermons([])
                  } catch (err: any) {
                    console.error('Error:', err)
                    alert(`Failed to delete sermons: ${err.message}`)
                  }
                }
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Delete ({selectedSermons.length})
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredSermons.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No sermons yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first sermon</p>
          <button
            onClick={() => router.push('/dashboard/sermons/new')}
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Sermon
          </button>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredSermons.map((sermon) => (
              <div key={sermon.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start gap-3 mb-3">
                  {sermon.thumbnail_url && (
                    <img src={sermon.thumbnail_url} alt={sermon.title} className="w-20 h-12 rounded object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{sermon.title}</h3>
                    <p className="text-sm text-gray-600">{sermon.pastor}</p>
                    <p className="text-xs text-gray-500">{format(new Date(sermon.sermon_date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${sermon.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {sermon.is_published ? 'Published' : 'Draft'}
                    </span>
                    {sermon.series_name && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">{sermon.series_name}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => router.push(`/dashboard/sermons/${sermon.id}`)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(sermon.id)} disabled={deleting === sermon.id} className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedSermons.length === filteredSermons.length && filteredSermons.length > 0}
                    onChange={(e) => setSelectedSermons(e.target.checked ? filteredSermons.map(s => s.id) : [])}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sermon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pastor & Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Series
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSermons.map((sermon) => (
                <tr key={sermon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedSermons.includes(sermon.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSermons([...selectedSermons, sermon.id])
                        } else {
                          setSelectedSermons(selectedSermons.filter(id => id !== sermon.id))
                        }
                      }}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {sermon.thumbnail_url && (
                        <img
                          src={sermon.thumbnail_url}
                          alt={sermon.title}
                          className="w-20 h-12 rounded object-cover mr-4"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{sermon.title}</div>
                        {sermon.scripture_reference && (
                          <div className="text-sm text-gray-500">{sermon.scripture_reference}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{sermon.pastor}</div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(sermon.sermon_date), 'MMM dd, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {sermon.series_name && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        {sermon.series_name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Eye className="w-4 h-4" />
                      {sermon.views}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => togglePublish(sermon)}
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          sermon.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {sermon.is_published ? 'Published' : 'Draft'}
                      </button>
                      {sermon.is_featured && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/dashboard/sermons/${sermon.id}`)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(sermon.id)}
                      disabled={deleting === sermon.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
