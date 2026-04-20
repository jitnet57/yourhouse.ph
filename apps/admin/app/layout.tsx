'use client'

import './globals.css'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu, X, LayoutDashboard, Home, Users, Bot, User, BarChart3, Settings,
  Bell, Search, Sparkles, LogOut
} from 'lucide-react'
import { LanguageProvider, useLanguage, Lang } from '@/lib/i18n'

const MENU_ICONS = {
  dashboard: LayoutDashboard,
  properties: Home,
  leads: Users,
  agents: Bot,
  users: User,
  reports: BarChart3,
  settings: Settings,
} as const

const MENU_HREFS: Record<string, string> = {
  dashboard: '/dashboard',
  properties: '/properties',
  leads: '/leads',
  agents: '/agents',
  users: '/users',
  reports: '/reports',
  settings: '/settings',
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { lang, setLang, t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  const menuKeys = Object.keys(MENU_HREFS) as (keyof typeof MENU_HREFS)[]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-72' : 'w-20'}
          bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950
          border-r border-white/5 transition-all duration-300 flex flex-col
          sticky top-0 h-screen z-20`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/50 flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-lg text-white leading-tight">{t.layout.title}</h1>
                <p className="text-[11px] text-slate-400 leading-tight">{t.layout.tagline}</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {sidebarOpen && (
            <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              {t.layout.mainMenu}
            </p>
          )}
          {menuKeys.map((key) => {
            const Icon = MENU_ICONS[key as keyof typeof MENU_ICONS]
            const href = MENU_HREFS[key]
            const name = t.layout.menu[key as keyof typeof t.layout.menu]
            const isActive = pathname?.startsWith(href)
            return (
              <Link
                key={key}
                href={href}
                className={`sidebar-link group ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'} ${sidebarOpen ? '' : 'justify-center px-0'}`}
                title={sidebarOpen ? '' : name}
              >
                {isActive && sidebarOpen && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                )}
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                {sidebarOpen && <span>{name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User + collapse */}
        <div className="p-3 border-t border-white/10 space-y-2">
          {sidebarOpen && (
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{t.layout.adminUser}</p>
                <p className="text-xs text-slate-400 truncate">{t.layout.signedIn}</p>
              </div>
              <button className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            {sidebarOpen && <span className="text-xs font-medium">{t.layout.collapse}</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.layout.adminDashboard}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{t.layout.subtitle}</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden lg:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder={t.layout.search}
                  className="pl-9 pr-4 py-2 w-64 bg-slate-100 border border-transparent focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-xl text-sm outline-none transition-all"
                />
              </div>

              {/* Language selector */}
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="appearance-none rounded-xl bg-slate-100 hover:bg-slate-200 border border-transparent px-3 py-2 pr-8 text-xs font-semibold text-slate-700 cursor-pointer transition-colors bg-no-repeat"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                  backgroundPosition: 'right 0.5rem center',
                }}
              >
                <option value="en">English</option>
                <option value="ko">한국어</option>
                <option value="ja">日本語</option>
                <option value="zh">中文</option>
              </select>

              {/* Bell */}
              <button className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
                <Bell className="w-4 h-4 text-slate-700" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full ring-2 ring-white" />
              </button>

              {/* Secure badge */}
              <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-700">{t.layout.secureAdmin}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <AdminShell>{children}</AdminShell>
        </LanguageProvider>
      </body>
    </html>
  )
}
