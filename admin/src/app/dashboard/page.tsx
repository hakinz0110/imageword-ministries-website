'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Calendar, Video, Users, MessageSquare, Heart, TrendingUp, CheckCircle2, Clock, UserCircle } from 'lucide-react'

type Stats = {
  events: number
  sermons: number
  ministries: number
  contacts: number
  prayers: number
  leadership: number
  members: number // Reused for unread contacts count
}

type UpcomingEvent = {
  id: string
  title: string
  date: string
  location: string
}

type Activity = {
  id: string
  type: string
  title: string
  time: string
  status: 'completed' | 'pending'
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    events: 0,
    sermons: 0,
    ministries: 0,
    contacts: 0,
    prayers: 0,
    leadership: 0,
    members: 0,
  })
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([])

  useEffect(() => {
    checkAuth()
    fetchStats()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/')
    }
  }

  const fetchStats = async () => {
    try {
      const [events, sermons, ministries, contacts, prayers, leadership, unreadContacts, eventsData] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('sermons').select('id', { count: 'exact', head: true }),
        supabase.from('ministries').select('id', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
        supabase.from('prayer_requests').select('id', { count: 'exact', head: true }),
        supabase.from('leadership').select('id', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('events').select('id, title, event_date, location').gte('event_date', new Date().toISOString()).order('event_date', { ascending: true }).limit(5),
      ])

      setStats({
        events: events.count || 0,
        sermons: sermons.count || 0,
        ministries: ministries.count || 0,
        contacts: contacts.count || 0,
        prayers: prayers.count || 0,
        leadership: leadership.count || 0,
        members: unreadContacts.count || 0,
      })

      if (eventsData.data) {
        setUpcomingEvents(eventsData.data.map(event => ({
          id: event.id,
          title: event.title,
          date: new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          location: event.location || 'TBA'
        })))
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { 
      label: 'Ministries', 
      value: stats.ministries, 
      icon: Users, 
      gradient: 'from-violet-500 to-violet-600',
      change: stats.ministries > 0 ? 'Active' : 'New',
      changeType: 'positive' as const
    },
    { 
      label: 'Events', 
      value: stats.events, 
      icon: Calendar, 
      gradient: 'from-emerald-500 to-emerald-600',
      change: stats.events > 0 ? 'Scheduled' : 'New',
      changeType: 'positive' as const
    },
    { 
      label: 'Sermons', 
      value: stats.sermons, 
      icon: Video, 
      gradient: 'from-purple-500 to-purple-600',
      change: stats.sermons > 0 ? 'Published' : 'New',
      changeType: 'positive' as const
    },
    { 
      label: 'Prayer Requests', 
      value: stats.prayers, 
      icon: Heart, 
      gradient: 'from-pink-500 to-pink-600',
      change: stats.prayers > 0 ? 'Received' : 'None',
      changeType: 'positive' as const
    },
    { 
      label: 'Leadership', 
      value: stats.leadership, 
      icon: UserCircle, 
      gradient: 'from-blue-500 to-blue-600',
      change: stats.leadership > 0 ? 'Active' : 'New',
      changeType: 'positive' as const
    },
    { 
      label: 'Messages', 
      value: stats.contacts, 
      icon: MessageSquare, 
      gradient: 'from-cyan-500 to-cyan-600',
      change: stats.contacts > 0 ? 'Received' : 'None',
      changeType: 'positive' as const
    },
    { 
      label: 'Pending Reviews', 
      value: stats.members, 
      icon: Clock, 
      gradient: 'from-orange-500 to-orange-600',
      change: stats.members > 0 ? 'Action needed' : 'All clear',
      changeType: stats.members > 0 ? 'neutral' as const : 'positive' as const
    },
  ]

  const recentActivity: Activity[] = [
    { id: '1', type: 'event', title: `${stats.events} events in database`, time: 'Current', status: 'completed' },
    { id: '2', type: 'sermon', title: `${stats.sermons} sermons published`, time: 'Current', status: 'completed' },
    { id: '3', type: 'prayer', title: `${stats.prayers} prayer requests`, time: 'Current', status: stats.prayers > 0 ? 'pending' : 'completed' },
    { id: '4', type: 'contact', title: `${stats.contacts} contact messages`, time: 'Current', status: stats.members > 0 ? 'pending' : 'completed' },
    { id: '5', type: 'ministry', title: `${stats.ministries} active ministries`, time: 'Current', status: 'completed' },
  ]

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight mb-1.5">Overview</h1>
        <p className="text-[14px] text-gray-500">Monitor your church management metrics and activities</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-[3px] border-gray-200"></div>
            <div className="w-10 h-10 rounded-full border-[3px] border-gray-900 border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => (
              <div 
                key={stat.label} 
                className="group relative bg-white rounded-[14px] p-5 border border-gray-200/60 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-[10px] bg-gradient-to-br ${stat.gradient}`}>
                    <stat.icon className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-full tracking-tight ${
                    stat.changeType === 'positive' ? 'bg-emerald-50 text-emerald-700' : 
                    stat.changeType === 'neutral' ? 'bg-orange-50 text-orange-700' : 
                    'bg-gray-50 text-gray-700'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-[32px] font-semibold text-gray-900 mb-1 tracking-tight leading-none">{stat.value}</p>
                  <p className="text-[13px] text-gray-500 font-medium tracking-tight">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Events and Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Events Timeline */}
            <div className="lg:col-span-2 bg-white rounded-[14px] p-6 border border-gray-200/60">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[16px] font-semibold text-gray-900 tracking-tight">Upcoming Events</h3>
                  <p className="text-[13px] text-gray-500 mt-0.5">Next scheduled church events</p>
                </div>
                <button
                  onClick={() => router.push('/dashboard/events')}
                  className="text-[13px] font-semibold text-gray-900 hover:text-gray-700 transition-colors tracking-tight"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-4 rounded-[12px] bg-gray-50 border border-gray-200/60 hover:border-gray-300 hover:bg-white transition-all group cursor-pointer">
                      <div className="flex-shrink-0 w-14 h-14 rounded-[10px] bg-gray-900 flex flex-col items-center justify-center text-white">
                        <span className="text-[10px] font-semibold uppercase tracking-wide">{event.date.split(' ')[0]}</span>
                        <span className="text-[18px] font-bold leading-none">{event.date.split(' ')[1]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[14px] text-gray-900 group-hover:text-gray-700 transition-colors truncate tracking-tight">
                          {event.title}
                        </h4>
                        <p className="text-[13px] text-gray-500 flex items-center gap-1.5 mt-1">
                          <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
                          {event.location}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 rounded-[10px] bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-gray-400" strokeWidth={2} />
                    </div>
                    <p className="text-gray-500 text-[13px] mb-4">No upcoming events scheduled</p>
                    <button
                      onClick={() => router.push('/dashboard/events/new')}
                      className="px-4 py-2 bg-gray-900 text-white rounded-[10px] text-[13px] font-medium hover:bg-gray-800 transition-colors"
                    >
                      Create Event
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-[14px] p-6 border border-gray-200/60">
              <h3 className="text-[16px] font-semibold text-gray-900 mb-5 tracking-tight">Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 group">
                    <div className={`mt-0.5 p-1.5 rounded-[8px] ${
                      activity.status === 'completed' ? 'bg-emerald-50' : 'bg-orange-50'
                    }`}>
                      {activity.status === 'completed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-orange-600" strokeWidth={2.5} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-900 group-hover:text-gray-700 transition-colors tracking-tight">
                        {activity.title}
                      </p>
                      <p className="text-[12px] text-gray-500 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
