'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext'

export default function Footer() {
  const { settings } = useSiteSettingsContext()
  
  const logoUrl = settings?.logo_url || process.env.NEXT_PUBLIC_LOGO_URL || "https://ljpvlhcxkpapihbudxqc.supabase.co/storage/v1/object/public/storage/project_logo/2.png"
  
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

  const quickLinks = [
    { name: 'About', href: '/about' },
    { name: 'Ministries', href: '/ministries' },
    { name: 'Sermons', href: '/sermons' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/contact' },
    { name: 'Give', href: '/donate' },
  ]
  
  return (
    <footer className="bg-gradient-to-b from-secondary-800 to-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-10 md:py-12">
        <motion.div 
          className="flex flex-row items-start gap-6 lg:gap-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Left Side - Logo and Social (vertical on mobile) */}
          <div className="flex flex-col items-center gap-4 flex-shrink-0">
            <Link href="/" className="inline-block">
              <Image
                src={logoUrl}
                alt={settings?.church_name || "ImageWord Ministries"}
                width={200}
                height={60}
                className={`h-12 sm:h-14 md:h-16 w-auto ${getLogoFilterClass()}`}
                unoptimized
              />
            </Link>
            
            {/* Social Icons - Vertical on mobile, horizontal on desktop */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              {settings?.facebook_url && (
                <motion.a 
                  href={settings.facebook_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-700/50 flex items-center justify-center hover:bg-primary-600 transition-all duration-300" 
                  aria-label="Facebook"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Facebook size={14} className="sm:w-4 sm:h-4" />
                </motion.a>
              )}
              {settings?.instagram_url && (
                <motion.a 
                  href={settings.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-700/50 flex items-center justify-center hover:bg-primary-600 transition-all duration-300" 
                  aria-label="Instagram"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Instagram size={14} className="sm:w-4 sm:h-4" />
                </motion.a>
              )}
              {settings?.youtube_url && (
                <motion.a 
                  href={settings.youtube_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-700/50 flex items-center justify-center hover:bg-primary-600 transition-all duration-300" 
                  aria-label="YouTube"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Youtube size={14} className="sm:w-4 sm:h-4" />
                </motion.a>
              )}
            </div>
          </div>

          {/* Right Side - Three Sections (always horizontal) */}
          <div className="flex-1 grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-white text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2 sm:mb-4">Links</h3>
              <ul className="space-y-1 sm:space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service Times */}
            <div>
              <h3 className="text-white text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2 sm:mb-4">Services</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                {settings?.service_time_1 && (
                  <li className="flex items-center gap-1 sm:gap-2">
                    <Clock size={12} className="text-primary-500 sm:w-3.5 sm:h-3.5" />
                    <span className="truncate">{settings.service_time_1}</span>
                  </li>
                )}
                {settings?.service_time_2 && (
                  <li className="flex items-center gap-1 sm:gap-2">
                    <Clock size={12} className="text-primary-500 sm:w-3.5 sm:h-3.5" />
                    <span className="truncate">{settings.service_time_2}</span>
                  </li>
                )}
                {settings?.service_time_3 && (
                  <li className="flex items-center gap-1 sm:gap-2">
                    <Clock size={12} className="text-primary-500 sm:w-3.5 sm:h-3.5" />
                    <span className="truncate">{settings.service_time_3}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2 sm:mb-4">Contact</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li className="flex items-start gap-1 sm:gap-2">
                  <MapPin size={12} className="text-primary-500 mt-0.5 flex-shrink-0 sm:w-3.5 sm:h-3.5" />
                  <span className="leading-tight">
                    {settings?.city || 'Your City'}, {settings?.state || 'State'}
                  </span>
                </li>
                <li>
                  <a 
                    href={`tel:${settings?.contact_phone || '(123) 456-7890'}`} 
                    className="flex items-center gap-1 sm:gap-2 hover:text-white transition-colors"
                  >
                    <Phone size={12} className="text-primary-500 sm:w-3.5 sm:h-3.5" />
                    <span className="truncate">{settings?.contact_phone || '(123) 456-7890'}</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={`mailto:${settings?.contact_email || 'info@church.com'}`} 
                    className="flex items-center gap-1 sm:gap-2 hover:text-white transition-colors"
                  >
                    <Mail size={12} className="text-primary-500 sm:w-3.5 sm:h-3.5" />
                    <span className="truncate">{settings?.contact_email || 'info@church.com'}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col items-center gap-2 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} {settings?.church_name || 'ImageWord Ministries'}. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <span className="text-gray-700">|</span>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
