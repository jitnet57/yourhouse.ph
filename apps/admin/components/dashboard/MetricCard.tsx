/**
 * Metric Card Component - Dashboard
 */
'use client'

import React from 'react'
import { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: string
}

export default function MetricCard({
  title,
  value,
  icon,
  trend,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className="text-success text-sm font-semibold mt-2">{trend}</p>
          )}
        </div>
        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  )
}
