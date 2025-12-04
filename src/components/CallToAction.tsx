'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="py-20 bg-primary-600 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
            Living Victoriously in Christ
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            At IMAGEWORD MINISTRIES, we are a family—a place where everyone is welcome, valued, and loved as we grow together in Christ.
          </p>
          <div className="flex justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
