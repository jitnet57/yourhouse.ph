// Dashboard - Home Page
'use client'

import React, { useEffect, useState } from 'react'
import { TrendingUp, Users, Home, MessageSquare, DollarSign } from 'lucide-react'
import MetricCard from '@/components/dashboard/MetricCard'
import ChartWidget from '@/components/dashboard/ChartWidget'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    activeListings: 0,
    openLeads: 0,
    conversionRate: 0,
    monthlyRevenue: 0,
    avgResponseTime: 0,
  })

  useEffect(() => {
    // TODO: Fetch from API
    setMetrics({
      activeListings: 842,
      openLeads: 156,
      conversionRate: 42.5,
      monthlyRevenue: 2450000,
      avgResponseTime: 2.3,
    })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your platform overview.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Active Listings"
          value={metrics.activeListings}
          icon={<Home className="text-secondary" size={24} />}
          trend="+12.5%"
        />
        <MetricCard
          title="Open Leads"
          value={metrics.openLeads}
          icon={<Users className="text-accent" size={24} />}
          trend="+8.2%"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          icon={<TrendingUp className="text-success" size={24} />}
          trend="+4.1%"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`₱${(metrics.monthlyRevenue / 1000000).toFixed(1)}M`}
          icon={<DollarSign className="text-warning" size={24} />}
          trend="+25.3%"
        />
        <MetricCard
          title="Avg Response Time"
          value={`${metrics.avgResponseTime}s`}
          icon={<MessageSquare className="text-primary" size={24} />}
          trend="-15%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWidget title="Lead Pipeline" type="funnel" />
        <ChartWidget title="Conversion Trend" type="line" />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                ✓
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">New lead generated</p>
                <p className="text-sm text-gray-600">2 minutes ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
