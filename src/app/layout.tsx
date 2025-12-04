import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext'

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ImageWord Ministries - Reconcile, Disciple, Empower',
  description: 'Rise Up - Embrace Purpose, Live Out Your Full Potential In God! Youth and young adults seeking purpose, spiritual growth, and empowerment through the gospel of Jesus Christ.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={poppins.className}>
        <SiteSettingsProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SiteSettingsProvider>
      </body>
    </html>
  )
}
