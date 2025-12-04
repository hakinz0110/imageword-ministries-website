'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSiteSettings } from '@/hooks/useSiteSettings'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/sermons', label: 'Sermons' },
  { href: '/ministries', label: 'Ministries' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const { settings } = useSiteSettings()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Use a consistent logo URL to prevent size changes
  const logoUrl = settings?.logo_url || process.env.NEXT_PUBLIC_LOGO_URL || "https://ljpvlhcxkpapihbudxqc.supabase.co/storage/v1/object/public/storage/project_logo/2.png"
  
  // Get logo filter from settings (default to invert for dark backgrounds)
  const logoFilter = settings?.logo_filter || 'invert'
  const getLogoFilterClass = () => {
    switch (logoFilter) {
      case 'invert': return 'brightness-0 invert'
      case 'grayscale': return 'grayscale brightness-0 invert'
      case 'sepia': return 'sepia brightness-0 invert'
      case 'none': return ''
      default: return 'brightness-0 invert'
    }
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-primary-500 shadow-lg' : 'bg-primary-500/95'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20 md:h-24">
          <Link href="/" className="flex-shrink-0">
            <Image
              src={logoUrl}
              alt={settings?.church_name || process.env.NEXT_PUBLIC_SITE_NAME || "ImageWord Ministries"}
              width={400}
              height={120}
              className={`h-16 md:h-20 w-auto ${getLogoFilterClass()}`}
              priority
              unoptimized
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-primary-400 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/donate" className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-300">
              Give
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-primary-400 p-1.5"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-white hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/donate"
                  onClick={() => setIsOpen(false)}
                  className="block bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-300 text-center mt-4"
                >
                  Give
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
