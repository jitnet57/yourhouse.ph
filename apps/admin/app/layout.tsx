// Admin Dashboard Layout & Navigation
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

type Language = 'en' | 'ko' | 'ja' | 'zh'

const translations = {
  en: {
    title: 'K-IREA',
    adminDashboard: 'Admin Dashboard',
    subtitle: 'Monitor integrations, manage assets, and review analytics.',
    secureAdmin: 'Secure Admin',
    adminUser: 'Admin User',
    signedIn: 'Signed in',
    menuItems: [
      { name: 'Dashboard', href: '/dashboard', icon: '📊' },
      { name: 'Properties', href: '/properties', icon: '🏠' },
      { name: 'Leads', href: '/leads', icon: '👥' },
      { name: 'Agents', href: '/agents', icon: '🤖' },
      { name: 'Users', href: '/users', icon: '👤' },
      { name: 'Reports', href: '/reports', icon: '📈' },
      { name: 'Settings', href: '/settings', icon: '⚙️' },
    ],
  },
  ko: {
    title: 'K-IREA',
    adminDashboard: '관리자 대시보드',
    subtitle: '통합을 모니터링하고 자산을 관리하며 분석을 검토하세요.',
    secureAdmin: '보안 관리자',
    adminUser: '관리자 사용자',
    signedIn: '로그인됨',
    menuItems: [
      { name: '대시보드', href: '/dashboard', icon: '📊' },
      { name: '부동산', href: '/properties', icon: '🏠' },
      { name: '리드', href: '/leads', icon: '👥' },
      { name: '에이전트', href: '/agents', icon: '🤖' },
      { name: '사용자', href: '/users', icon: '👤' },
      { name: '보고서', href: '/reports', icon: '📈' },
      { name: '설정', href: '/settings', icon: '⚙️' },
    ],
  },
  ja: {
    title: 'K-IREA',
    adminDashboard: '管理者ダッシュボード',
    subtitle: '統合を監視し、資産を管理し、分析をレビューします。',
    secureAdmin: 'セキュア管理者',
    adminUser: '管理者ユーザー',
    signedIn: 'サインイン済み',
    menuItems: [
      { name: 'ダッシュボード', href: '/dashboard', icon: '📊' },
      { name: 'プロパティ', href: '/properties', icon: '🏠' },
      { name: 'リード', href: '/leads', icon: '👥' },
      { name: 'エージェント', href: '/agents', icon: '🤖' },
      { name: 'ユーザー', href: '/users', icon: '👤' },
      { name: 'レポート', href: '/reports', icon: '📈' },
      { name: '設定', href: '/settings', icon: '⚙️' },
    ],
  },
  zh: {
    title: 'K-IREA',
    adminDashboard: '管理员仪表盘',
    subtitle: '监视集成、管理资产并查看分析。',
    secureAdmin: '安全管理员',
    adminUser: '管理员用户',
    signedIn: '已登录',
    menuItems: [
      { name: '仪表盘', href: '/dashboard', icon: '📊' },
      { name: '房源', href: '/properties', icon: '🏠' },
      { name: '线索', href: '/leads', icon: '👥' },
      { name: '代理', href: '/agents', icon: '🤖' },
      { name: '用户', href: '/users', icon: '👤' },
      { name: '报告', href: '/reports', icon: '📈' },
      { name: '设置', href: '/settings', icon: '⚙️' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [language, setLanguage] = useState<Language>('en')
  const t = translations[language]

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-900">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-primary text-white transition-all duration-300 flex flex-col`}>
            <div className="p-4 border-b border-white/20">
              <h1 className={`font-bold ${sidebarOpen ? 'text-xl' : 'text-lg'}`}>
                {sidebarOpen ? `🏢 ${t.title}` : '🏢'}
              </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {t.menuItems.map((item) => {
                const isActive = pathname?.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-100 hover:bg-secondary/20 hover:text-white'}`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {sidebarOpen && <span className="text-sm">{item.name}</span>}
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-white/20">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-secondary/50"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{t.adminDashboard}</h2>
                <p className="text-sm text-slate-600">{t.subtitle}</p>
              </div>
              <div className="flex items-center gap-4">
                <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 cursor-pointer hover:bg-slate-200 transition">
                  <option value="en">English</option>
                  <option value="ko">한국어</option>
                  <option value="ja">日本語</option>
                  <option value="zh">中文</option>
                </select>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">{t.secureAdmin}</div>
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">A</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.adminUser}</p>
                    <p className="text-xs text-slate-500">{t.signedIn}</p>
                  </div>
                </div>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
