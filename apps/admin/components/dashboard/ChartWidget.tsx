/**
 * Chart Component - Dashboard
 */
'use client'

import React from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChartWidgetProps {
  title: string
  type: 'line' | 'bar' | 'pie' | 'funnel'
}

const chartData = [
  { name: 'Jan', value: 400, conversion: 24 },
  { name: 'Feb', value: 300, conversion: 13 },
  { name: 'Mar', value: 200, conversion: 9 },
  { name: 'Apr', value: 278, conversion: 39 },
  { name: 'May', value: 189, conversion: 22 },
  { name: 'Jun', value: 239, conversion: 29 },
]

const COLORS = ['#001F3F', '#0074D9', '#FFD700', '#2ECC40']

export default function ChartWidget({ title, type }: ChartWidgetProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      {type === 'line' && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="conversion" stroke="#0074D9" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}

      {type === 'bar' && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#0074D9" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {type === 'pie' && (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label dataKey="value">
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}

      {type === 'funnel' && (
        <div className="space-y-4">
          {[
            { label: 'Leads', value: 1000 },
            { label: 'Contacted', value: 650 },
            { label: 'Interested', value: 420 },
            { label: 'Negotiating', value: 200 },
            { label: 'Closed', value: 85 },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-900">{item.label}</span>
                <span className="text-sm text-gray-600">{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-secondary h-2 rounded-full"
                  style={{ width: `${(item.value / 1000) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
