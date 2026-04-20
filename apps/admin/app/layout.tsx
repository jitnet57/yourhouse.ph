'use client'

import './globals.css'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu, X, LayoutDashboard, Home, Users, Bot, User, BarChart3, Settings,
  Bell, Search, Sparkles, LogOut
} from 'lucide-react'

type Language = 'en' | 'ko' | 'ja' | 'zh'

const translations = {
  en: {
    title: 'K-IREA',
    tagline: 'Real Estate Intelligence',
    adminDashboard: 'Admin Dashboard',
    subtitle: "Monitor integrations, manage assets, and review analytics.",
    secureAdmin: 'Secure',
    adminUser: 'Admin User',
    signedIn: 'Administrator',
    search: 'Search anything...',
    mainMenu: 'Main Menu',
    menuItems: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Properties', href: '/properties', icon: Home },
      { name: 'Leads', href: '/leads', icon: Users },
      { name: 'Agents', href: '/agents', icon: Bot },
      { name: 'Users', href: '/users', icon: User },
      { name: 'Reports', href: '/reports', icon: BarChart3 },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
  ko: {
    title: 'K-IREA',
    tagline: '부동산 인텔리전스',
    adminDashboard: '관리자 대시보드',
    subtitle: '통합을 모니터링하고 자산을 관리하며 분석을 검토하세요.',
    secureAdmin: '보안',
    adminUser: '관리자',
    signedIn: '관리자 계정',
    search: '무엇이든 검색...',
    mainMenu: '메인 메뉴',
    menuItems: [
      { name: '대시보드', href: '/dashboard', icon: LayoutDashboard },
      { name: '부동산', href: '/properties', icon: Home },
      { name: '리드', href: '/leads', icon: Users },
      { name: '에이전트', href: '/agents', icon: Bot },
      { name: '사용자', href: '/users', icon: User },
      { name: '보고서', href: '/reports', icon: BarChart3 },
      { name: '설정', href: '/settings', icon: Settings },
    ],
  },
  ja: {
    title: 'K-IREA',
    tagline: '不動産インテリジェンス',
    adminDashboard: '管理者ダッシュボード',
    subtitle: '統合を監視し、資産を管理し、分析をレビューします。',
    secureAdmin: 'セキュア',
    adminUser: '管理者',
    signedIn: '管理者アカウント',
    search: '検索...',
    mainMenu: 'メインメニュー',
    menuItems: [
      { name: 'ダッシュボード', href: '/dashboard', icon: LayoutDashboard },
      { name: 'プロパティ', href: '/properties', icon: Home },
      { name: 'リード', href: '/leads', icon: Users },
      { name: 'エージェント', href: '/agents', icon: Bot },
      { name: 'ユーザー', href: '/users', icon: User },
      { name: 'レポート', href: '/reports', icon: BarChart3 },
      { name: '設定', href: '/settings', icon: Settings },
    ],
  },
  zh: {
    title: 'K-IREA',
    tagline: '房地产智能',
    adminDashboard: '管理员仪表盘',
    subtitle: '监视集成、管理资产并查看分析。',
    secureAdmin: '安全',
    adminUser: '管理员',
    signedIn: '管理员账户',
    search: '搜索...',
    mainMenu: '主菜单',
    menuItems: [
      { name: '仪表盘', href: '/dashboard', icon: LayoutDashboard },
      { name: '房源', href: '/properties', icon: Home },
      { name: '线索', href: '/leads', icon: Users },
      { name: '代理', href: '/agents', icon: Bot },
      { name: '用户', href: '/users', icon: User },
      { name: '报告', href: '/reports', icon: BarChart3 },
      { name: '设置', href: '/settings', icon: Settings },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [language, setLanguage] = useState<Language>('en')
  const t = translations[language]

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
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside
            className={`${sidebarOpen ? 'w-72' : 'w-20'}
              bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950
              border-r border-white/5 transition-all duration-300 flex flex-col
              sticky top-0 h-screen z-20`}
          >
            <div className="p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/50 flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                {sidebarOpen && (
                  <div className="overflow-hidden">
                    <h1 className="font-bold text-lg text-white leading-tight">{t.title}</h1>
                    <p className="text-[11px] text-slate-400 leading-tight">{t.tagline}</p>
                  </div>
                )}
              </div>
            </div>

            <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
              {sidebarOpen && (
                <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  {t.mainMenu}
                </p>
              )}
              {t.menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname?.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`sidebar-link group ${
                      isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
                    } ${sidebarOpen ? '' : 'justify-center px-0'}`}
                    title={sidebarOpen ? '' : item.name}
                  >
                    {isActive && sidebarOpen && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                    )}
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    {sidebarOpen && <span>{item.name}</span>}
                  </Link>
                )
              })}
            </nav>

            <div className="p-3 border-t border-white/10 space-y-2">
              {sidebarOpen && (
                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/5">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                    A
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{t.adminUser}</p>
                    <p className="text-xs text-slate-400 truncate">{t.signedIn}</p>
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
                {sidebarOpen && <span className="text-xs font-medium">Collapse</span>}
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 px-6 py-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.adminDashboard}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{t.subtitle}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative hidden lg:block">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder={t.search}
                      className="pl-9 pr-4 py-2 w-64 bg-slate-100 border border-transparent focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-xl text-sm outline-none transition-all"
                    />
                  </div>

                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
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

                  <button className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
                    <Bell className="w-4 h-4 text-slate-700" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full ring-2 ring-white"></span>
                  </button>

                  <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-semibold text-emerald-700">{t.secureAdmin}</span>
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 p-6 lg:p-8 animate-fade-in">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
