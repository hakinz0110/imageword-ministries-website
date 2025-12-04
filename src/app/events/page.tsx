'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Download } from 'lucide-react'
import { supabase, type Event } from '@/lib/supabase'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('event_date', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string, endDateString?: string | null) => {
    const start = new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
    if (endDateString) {
      const end = new Date(endDateString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      })
      return `${start} - ${end}`
    }
    return start
  }

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Upcoming Events</h1>
            <p className="text-xl text-gray-600">
              Join us for worship, fellowship, and community events throughout the year.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {event.image_url && (
                    <div 
                      className="h-64 md:h-auto bg-cover bg-center"
                      style={{ backgroundImage: `url(${event.image_url})` }}
                    />
                  )}
                  <div className={`${event.image_url ? 'md:col-span-2' : 'md:col-span-3'} p-6 md:p-8`}>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                      {event.is_recurring && (
                        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                          Recurring
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-6">{event.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-700">
                        <Calendar size={20} className="mr-3 text-primary-600" />
                        <span className="font-medium">
                          {event.is_recurring && event.recurring_schedule 
                            ? event.recurring_schedule 
                            : formatDate(event.event_date)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock size={20} className="mr-3 text-primary-600" />
                        <span>{formatTime(event.event_date, event.end_date)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center text-gray-700">
                          <MapPin size={20} className="mr-3 text-primary-600" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {event.registration_link && (
                        <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="btn-primary">
                          Register Now
                        </a>
                      )}
                      {event.flyer_url && (
                        <a href={event.flyer_url} target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center">
                          <Download size={18} className="mr-2" />
                          Download Flyer
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">Stay Connected</h2>
            <p className="text-xl mb-8 text-primary-100">
              Subscribe to our newsletter to receive updates about upcoming events and church news.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-primary-600 hover:bg-gray-100 font-medium px-6 py-3 rounded-lg transition-all duration-300">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
