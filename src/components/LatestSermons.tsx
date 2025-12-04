'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Video as VideoIcon } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

type Sermon = {
  id: string
  title: string
  pastor: string
  sermon_date: string
  thumbnail_url: string | null
  video_url: string | null
}

export default function LatestSermons() {
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSermons()
  }, [])

  const fetchSermons = async () => {
    try {
      const { data, error } = await supabase
        .from('sermons')
        .select('id, title, pastor, sermon_date, thumbnail_url, video_url')
        .eq('is_published', true)
        .order('sermon_date', { ascending: false })
        .limit(3)

      if (error) throw error
      setSermons(data || [])
    } catch (error) {
      console.error('Error fetching sermons:', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header - Slide In from Right */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="section-title"
          >
            Latest Sermons
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="section-subtitle"
          >
            Watch our recent messages and be inspired
          </motion.p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : sermons.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-12 text-gray-600"
          >
            <VideoIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>No sermons available yet. Check back soon!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sermons.map((sermon, index) => (
              <motion.div
                key={sermon.id}
                initial={{ opacity: 0, y: 60, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.7, 
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="group cursor-pointer"
                onClick={() => sermon.video_url && window.open(sermon.video_url, '_blank')}
              >
                <motion.div 
                  className="relative overflow-hidden rounded-xl mb-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {sermon.thumbnail_url ? (
                    <motion.div 
                      className="h-56 bg-cover bg-center"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.5 }}
                      style={{ backgroundImage: `url(${sermon.thumbnail_url})` }}
                    />
                  ) : (
                    <div className="h-56 bg-gray-200 flex items-center justify-center">
                      <VideoIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center"
                  >
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
                    >
                      <Play size={28} className="text-primary-600 ml-1" />
                    </motion.div>
                  </motion.div>
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.3 }}
                  className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors"
                >
                  {sermon.title}
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.4 }}
                  className="text-gray-600 text-sm mb-1"
                >
                  {sermon.pastor}
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.5 }}
                  className="text-gray-500 text-sm"
                >
                  {format(new Date(sermon.sermon_date), 'MMMM dd, yyyy')}
                </motion.p>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/sermons" className="btn-primary">
              View All Sermons
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
