'use client'

import React, { useEffect, useState } from 'react'
import {
  TrendingUp, Users, Home, MessageSquare, DollarSign,
  Sparkles, ArrowRight, CheckCircle2, Clock, Building2, Mail,
} from 'lucide-react'
import MetricCard from '@/components/dashboard/MetricCard'
import ChartWidget from '@/components/dashboard/ChartWidget'

const activities = [
  {
    icon: CheckCircle2,
    iconBg: 'bg-emerald-100 text-emerald-600',
    title: 'New lead generated',
    description: 'Maria Santos submitted an inquiry for Makati Penthouse',
    time: '2 minutes ago',
  },
  {
    icon: Building2,
    iconBg: 'bg-indigo-100 text-indigo-600',
    title: 'Property listed',
    description: '3BR Condo in BGC, Taguig - ₱18.5M',
    time: '1 hour ago',
  },
  {
    icon: Mail,
    iconBg: 'bg-pink-100 text-pink-600',
    title: 'Campaign sent',
    description: 'Weekly newsletter delivered to 2,340 subscribers',
    time: '3 hours ago',
  },
  {
    icon: Users,
    iconBg: 'bg-amber-100 text-amber-600',
    title: 'Agent onboarded',
    description: 'Juan dela Cruz joined Makati branch team',
    time: '5 hours ago',
  },
]

const quickStats = [
  { label: 'New this week', value: '+234', color: 'text-emerald-600' },
  { label: 'Pending approval', value: '12', color: 'text-amber-600' },
  { label: 'Active sessions', value: '1,489', color: 'text-indigo-600' },
]

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    activeListings: 0,
    openLeads: 0,
    conversionRate: 0,
    monthlyRevenue: 0,
    avgResponseTime: 0,
  })

  useEffect(() => {
    setMetrics({
      activeListings: 842,
      openLeads: 156,
      conversionRate: 42.5,
      monthlyRevenue: 2450000,
      avgResponseTime: 2.3,
    })
  }, [])

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Hero / Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white shadow-xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl translate-y-1/2" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome back</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Good to see you, Admin 👋
            </h1>
            <p className="mt-2 text-indigo-100 max-w-xl">
              Here's what's happening with your platform today. You have <strong className="text-white">156 new leads</strong> and <strong className="text-white">24 pending tasks</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
              View Report
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-colors">
              + New Property
            </button>
          </div>
        </div>

        <div className="relative mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-white/15">
          {quickStats.map((stat) => (
            <div key={stat.label}>
              <p className="text-xs font-medium text-indigo-100">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <MetricCard
          title="Active Listings"
          value={metrics.activeListings.toLocaleString()}
          icon={<Home size={22} strokeWidth={2.5} />}
          trend="+12.5%"
          variant="primary"
        />
        <MetricCard
          title="Open Leads"
          value={metrics.openLeads.toLocaleString()}
          icon={<Users size={22} strokeWidth={2.5} />}
          trend="+8.2%"
          variant="secondary"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          icon={<TrendingUp size={22} strokeWidth={2.5} />}
          trend="+4.1%"
          variant="success"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`₱${(metrics.monthlyRevenue / 1000000).toFixed(1)}M`}
          icon={<DollarSign size={22} strokeWidth={2.5} />}
          trend="+25.3%"
          variant="accent"
        />
        <MetricCard
          title="Avg Response"
          value={`${metrics.avgResponseTime}s`}
          icon={<MessageSquare size={22} strokeWidth={2.5} />}
          trend="-15%"
          variant="warning"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWidget title="Lead Pipeline" type="funnel" subtitle="Conversion across stages" />
        <ChartWidget title="Conversion Trend" type="line" subtitle="Last 7 months" />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 shadow-card p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Activity</h3>
              <p className="text-xs text-slate-500 mt-0.5">Latest events across your platform</p>
            </div>
            <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">
              View all
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {activities.map((item, i) => {
              const Icon = item.icon
              return (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{item.title}</p>
                    <p className="text-xs text-slate-500 truncate">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    <span className="hidden sm:inline">{item.time}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions / AI Insights */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl animate-fade-in-up relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Insights</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight">
              3 leads are hot right now
            </h3>
            <p className="text-sm text-indigo-200 mt-2">
              Based on engagement patterns, these leads have a high probability of converting this week.
            </p>

            <div className="mt-5 space-y-2">
              {['Maria Santos · 94%', 'John Kim · 87%', 'Sarah Chen · 82%'].map((name, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-medium">{name}</span>
                  <ArrowRight className="w-4 h-4 text-indigo-300" />
                </div>
              ))}
            </div>

            <button className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors">
              Open AI Assistant
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
