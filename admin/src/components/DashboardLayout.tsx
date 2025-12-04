'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  LayoutDashboard,
  Calendar,
  Video,
  Users,
  UserCircle,
  MessageSquare,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  Image as ImageIcon,
  Bell,
  Search,
  FolderOpen,
  Database,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Events', href: '/dashboard/events', icon: Calendar },
  { name: 'Sermons', href: '/dashboard/sermons', icon: Video },
  { name: 'Ministries', href: '/dashboard/ministries', icon: Users },
  { name: 'Leadership', href: '/dashboard/leadership', icon: UserCircle },
  { name: 'About Content', href: '/dashboard/about-content', icon: ImageIcon },
  { name: 'Contact Info', href: '/dashboard/contact-info', icon: MessageSquare },
  { name: 'Storage', href: '/dashboard/storage', icon: Database },
  { name: 'Messages', href: '/dashboard/contacts', icon: Bell },
  { name: 'Prayers', href: '/dashboard/prayers', icon: Heart },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isActive = (href: string) => pathname === href

  return (
    <div className="h-screen flex overflow-hidden bg-[#fafafa]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-[240px] bg-white border-r border-gray-200/60 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-[72px] px-5 border-b border-gray-200/60 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-[15px] tracking-tight">IW</span>
              </div>
              <div>
                <h1 className="text-[15px] font-semibold text-gray-900 tracking-tight leading-none">
                  ImageWord
                </h1>
                <p className="text-[11px] text-gray-500 font-medium tracking-wide uppercase">Admin</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-[10px] transition-all duration-200 group relative ${
                    active
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`w-[18px] h-[18px] mr-3 transition-transform ${active ? 'scale-105' : 'group-hover:scale-105'}`} strokeWidth={active ? 2.5 : 2} />
                  <span className="font-medium text-[13.5px] tracking-tight">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-gray-200/60 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 text-red-600 rounded-[10px] hover:bg-red-50 transition-all duration-200 group"
            >
              <LogOut className="w-[18px] h-[18px] mr-3 group-hover:scale-105 transition-transform" strokeWidth={2} />
              <span className="font-medium text-[13.5px] tracking-tight">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:pl-[240px]">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200/60 flex-shrink-0">
          <div className="flex items-center justify-between h-[72px] px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors p-2 -ml-2"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200/60 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-[10px] transition-all">
                <Bell className="w-5 h-5" strokeWidth={2} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-gray-50 rounded-[10px] border border-gray-200/60">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-[13px] font-medium text-gray-700 tracking-tight">ImageWord Ministries</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
