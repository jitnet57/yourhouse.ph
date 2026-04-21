'use client'

import React from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart,
} from 'recharts'
import { MoreHorizontal } from 'lucide-react'

interface ChartWidgetProps {
  title: string
  type: 'line' | 'bar' | 'pie' | 'funnel'
  subtitle?: string
}

const chartData = [
  { name: 'Jan', value: 400, conversion: 24 },
  { name: 'Feb', value: 300, conversion: 13 },
  { name: 'Mar', value: 200, conversion: 39 },
  { name: 'Apr', value: 278, conversion: 48 },
  { name: 'May', value: 189, conversion: 38 },
  { name: 'Jun', value: 239, conversion: 43 },
  { name: 'Jul', value: 349, conversion: 58 },
]

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981']

const funnelStages = [
  { label: 'Leads', value: 1000, color: 'from-indigo-500 to-indigo-600' },
  { label: 'Contacted', value: 650, color: 'from-purple-500 to-purple-600' },
  { label: 'Interested', value: 420, color: 'from-pink-500 to-pink-600' },
  { label: 'Negotiating', value: 200, color: 'from-amber-500 to-amber-600' },
  { label: 'Closed', value: 85, color: 'from-emerald-500 to-emerald-600' },
]

export default function ChartWidget({ title, type, subtitle }: ChartWidgetProps) {
  return (
    <div className="relative bg-white rounded-2xl border border-slate-200/70 shadow-card p-6 animate-fade-in-up">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {type === 'line' && (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorConversion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15)',
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="conversion"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#colorConversion)"
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {type === 'bar' && (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {type === 'pie' && (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}

      {type === 'funnel' && (
        <div className="space-y-4">
          {funnelStages.map((item, i) => {
            const percent = (item.value / funnelStages[0].value) * 100
            return (
              <div key={i}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                  <span className="text-sm font-bold text-slate-900">
                    {item.value.toLocaleString()}
                    <span className="ml-2 text-xs font-medium text-slate-400">
                      {percent.toFixed(0)}%
                    </span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
