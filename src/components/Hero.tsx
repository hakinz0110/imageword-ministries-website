'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Play, ChevronLeft, ChevronRight } from 'lucide-react'

const defaultImages = [
  'https://ljpvlhcxkpapihbudxqc.supabase.co/storage/v1/object/public/storage/project_image/church-christ-tree-natural-beautiful.jpg',
]

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [carouselImages, setCarouselImages] = useState<string[]>(defaultImages)
  const [heroContent, setHeroContent] = useState({
    title: "Experience God's Love and Grace",
    description: "Join us every Sunday at 9:00 AM & 11:00 AM for worship, fellowship, and spiritual growth. Everyone is welcome in God's house.",
    verse: '"For where two or three gather in my name, there am I with them." - Matthew 18:20',
    button1Text: "Join Us This Sunday",
    button2Text: "Watch Latest Sermon"
  })

  useEffect(() => {
    fetchCarouselImages()
    fetchHeroContent()
  }, [])

  const fetchCarouselImages = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .like('key', 'carousel_image_%')
        .order('key')

      if (!error && data && data.length > 0) {
        const images = data.map(item => item.value).filter(Boolean)
        if (images.length > 0) {
          setCarouselImages(images)
        }
      }
    } catch (error) {
      console.error('Error fetching carousel images:', error)
    }
  }

  const fetchHeroContent = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['hero_title', 'hero_description', 'hero_verse', 'hero_button1_text', 'hero_button2_text'])

      if (!error && data) {
        const content: any = {}
        data.forEach(item => {
          if (item.key === 'hero_title' && item.value) content.title = item.value
          if (item.key === 'hero_description' && item.value) content.description = item.value
          if (item.key === 'hero_verse' && item.value) content.verse = item.value
          if (item.key === 'hero_button1_text' && item.value) content.button1Text = item.value
          if (item.key === 'hero_button2_text' && item.value) content.button2Text = item.value
        })
        if (Object.keys(content).length > 0) {
          setHeroContent(prev => ({ ...prev, ...content }))
        }
      }
    } catch (error) {
      console.error('Error fetching hero content:', error)
    }
  }

  useEffect(() => {
    // Only auto-play if there are multiple images
    if (carouselImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [carouselImages.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image Carousel with Enhanced Parallax */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 p-4 sm:p-0"
        >
          <div className="relative w-full h-full rounded-lg sm:rounded-none overflow-hidden">
            <Image
              src={carouselImages[currentIndex]}
              alt="Church background"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Carousel Navigation Arrows - Only show if multiple images */}
      {carouselImages.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Carousel Indicators - Only show if multiple images */}
      {carouselImages.length > 1 && (
        <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Content with Staggered Animations */}
      <motion.div 
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto space-y-6 pt-28 md:pt-32"
      >
        {/* Main Heading - Fade In Up */}
        <motion.h1
          key={heroContent.title}
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1.2, 
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1] 
          }}
          className="text-4xl md:text-6xl font-bold leading-tight bg-black/50 px-6 py-4 rounded-lg inline-block"
        >
          {heroContent.title}
        </motion.h1>
        
        {/* Description - Slide In from Left */}
        <motion.p
          key={heroContent.description}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 1, 
            delay: 0.5, 
            ease: [0.22, 1, 0.36, 1] 
          }}
          className="text-lg md:text-xl text-white font-light max-w-3xl mx-auto bg-black/50 px-6 py-4 rounded-lg"
        >
          {heroContent.description}
        </motion.p>
        
        {/* Bible Verse - Floating Effect */}
        <motion.div
          key={heroContent.verse}
          initial={{ opacity: 0, y: 50 }}
          animate={{ 
            opacity: 1, 
            y: 0,
          }}
          transition={{ 
            duration: 1, 
            delay: 0.8,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="inline-block"
        >
          <motion.p
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 0.5, 0, -0.5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1]
            }}
            className="text-base md:text-lg text-yellow-400 font-normal italic bg-black/50 px-6 py-4 rounded-lg"
          >
            {heroContent.verse}
          </motion.p>
        </motion.div>

        {/* CTA Buttons - Staggered with Enhanced Hover */}
        <motion.div
          key={`${heroContent.button1Text}-${heroContent.button2Text}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 1.1, 
            ease: [0.22, 1, 0.36, 1] 
          }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            whileHover={{ 
              scale: 1.08, 
              y: -5,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/events" 
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-[0_20px_50px_rgba(249,115,22,0.5)]"
            >
              <Calendar size={20} />
              {heroContent.button1Text}
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            whileHover={{ 
              scale: 1.08, 
              y: -5,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/sermons" 
              className="inline-flex items-center gap-2 bg-gray-700/80 hover:bg-gray-600/80 text-white font-medium px-8 py-3.5 rounded-lg transition-all duration-300 border border-gray-500 hover:shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
            >
              <Play size={20} />
              {heroContent.button2Text}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
        >
          <motion.div 
            className="w-1.5 h-1.5 bg-white rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
