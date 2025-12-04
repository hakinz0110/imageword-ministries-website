'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Heart, Music, BookOpen, Baby, Globe } from 'lucide-react'
import { supabase, type Ministry } from '@/lib/supabase'

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMinistries()
  }, [])

  const fetchMinistries = async () => {
    try {
      const { data, error } = await supabase
        .from('ministries')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) throw error
      setMinistries(data || [])
    } catch (error) {
      console.error('Error fetching ministries:', error)
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Our Ministries</h1>
            <p className="text-xl text-gray-600">
              Find your place to serve, grow, and connect with others in our community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ministries Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministries.map((ministry, index) => (
                <motion.div
                  key={ministry.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  {ministry.image_url && (
                    <div 
                      className="h-48 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundImage: `url(${ministry.image_url})` }}
                    />
                  )}
                  <div className="p-6">

                    <h3 className="text-xl font-bold text-gray-900 mb-3">{ministry.name}</h3>
                    <p className="text-gray-600 mb-4">{ministry.description}</p>
                    <button className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                      Learn More →
                    </button>
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
            <h2 className="text-4xl font-bold mb-6">Get Involved</h2>
            <p className="text-xl mb-8 text-primary-100">
              Discover your gifts and find meaningful ways to serve in our community.
            </p>
            <button className="bg-white text-primary-600 hover:bg-gray-100 font-medium px-8 py-4 rounded-lg transition-all duration-300">
              Contact Us to Learn More
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
