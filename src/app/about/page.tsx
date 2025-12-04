'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Users, Target } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Leader = {
  id: string
  name: string
  title: string
  bio: string
  image_url: string | null
}

type AboutContent = {
  description: string
  mission: string
  vision: string
  targetAudience: string
  coreValues: string[]
}

export default function AboutPage() {
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [content, setContent] = useState<AboutContent>({
    description: '',
    mission: '',
    vision: '',
    targetAudience: '',
    coreValues: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAboutContent()
    fetchLeaders()
  }, [])

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .or('key.in.(about_description,about_mission,about_vision,about_target_audience),key.like.core_value_%')

      if (error) throw error

      const newContent: AboutContent = {
        description: '',
        mission: '',
        vision: '',
        targetAudience: '',
        coreValues: []
      }

      data?.forEach(item => {
        if (item.key === 'about_description') newContent.description = item.value
        if (item.key === 'about_mission') newContent.mission = item.value
        if (item.key === 'about_vision') newContent.vision = item.value
        if (item.key === 'about_target_audience') newContent.targetAudience = item.value
        if (item.key.startsWith('core_value_')) newContent.coreValues.push(item.value)
      })

      setContent(newContent)
    } catch (error) {
      console.error('Error fetching about content:', error)
    }
  }

  const fetchLeaders = async () => {
    try {
      const { data, error } = await supabase
        .from('leadership')
        .select('*')
        .eq('is_active', true)
        .order('display_order')

      if (error) throw error
      setLeaders(data || [])
    } catch (error) {
      console.error('Error fetching leaders:', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl font-display font-bold text-secondary-800 mb-6">About Us</h1>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {content.description || 'Loading...'}
                </p>
              </div>
              <div 
                className="h-96 bg-cover bg-center rounded-xl shadow-lg"
                style={{ backgroundImage: 'url(/assets/about-hero.jpg)' }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-primary-600 px-8 py-4">
                <h3 className="text-2xl font-display font-bold text-white">Mission</h3>
              </div>
              <div className="p-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {content.mission || 'Loading...'}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-primary-600 px-8 py-4">
                <h3 className="text-2xl font-display font-bold text-white">Vision</h3>
              </div>
              <div className="p-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {content.vision || 'Loading...'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values & Target Audience */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
                <div className="bg-primary-600 px-8 py-4">
                  <h3 className="text-2xl font-display font-bold text-white">Core Values</h3>
                </div>
                <div className="p-8">
                  <ul className="space-y-3 text-gray-700 text-lg">
                    {content.coreValues.map((value, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary-600 mr-3">•</span>
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
                <div className="bg-primary-600 px-8 py-4">
                  <h3 className="text-2xl font-display font-bold text-white">Target Audience</h3>
                </div>
                <div className="p-8">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {content.targetAudience || 'Loading...'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Our Leadership</h2>
            <p className="section-subtitle">
              Meet the dedicated leaders serving our church community
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {leaders.map((leader, index) => (
                <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  {leader.image_url ? (
                    <div 
                      className="w-48 h-48 mx-auto rounded-full bg-cover bg-center mb-4 shadow-lg"
                      style={{ backgroundImage: `url(${leader.image_url})` }}
                    />
                  ) : (
                    <div className="w-48 h-48 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-4 shadow-lg">
                      <Users className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{leader.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{leader.title}</p>
                  <p className="text-gray-600">{leader.bio}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
