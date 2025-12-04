'use client'

import { motion } from 'framer-motion'
import Hero from '@/components/Hero'
import UpcomingEvents from '@/components/UpcomingEvents'
import LatestSermons from '@/components/LatestSermons'
import CallToAction from '@/components/CallToAction'

export default function Home() {
  return (
    <>
      <Hero />
      <UpcomingEvents />
      <LatestSermons />
      <CallToAction />
    </>
  )
}
