'use client'

import React, { ReactNode } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: string
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning'
}

const variants: Record<
  NonNullable<MetricCardProps['variant']>,
  { iconBg: string; iconColor: string; glow: string; ring: string }
> = {
  primary: {
    iconBg: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    iconColor: 'text-white',
    glow: 'shadow-indigo-500/30',
    ring: 'before:from-indigo-400 before:to-purple-500',
  },
  secondary: {
    iconBg: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
    iconColor: 'text-white',
    glow: 'shadow-purple-500/30',
    ring: 'before:from-purple-400 before:to-pink-500',
  },
  accent: {
    iconBg: 'bg-gradient-to-br from-pink-500 to-rose-500',
    iconColor: 'text-white',
    glow: 'shadow-pink-500/30',
    ring: 'before:from-pink-400 before:to-rose-500',
  },
  success: {
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    iconColor: 'text-white',
    glow: 'shadow-emerald-500/30',
    ring: 'before:from-emerald-400 before:to-teal-500',
  },
  warning: {
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    iconColor: 'text-white',
    glow: 'shadow-amber-500/30',
    ring: 'before:from-amber-400 before:to-orange-500',
  },
}

export default function MetricCard({
  title,
  value,
  icon,
  trend,
  variant = 'primary',
}: MetricCardProps) {
  const v = variants[variant]
  const isTrendPositive = trend && !trend.startsWith('-')
  const TrendIcon = isTrendPositive ? ArrowUpRight : ArrowDownRight

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white border border-slate-200/70 p-6
        shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300
        animate-fade-in-up`}
    >
      {/* Decorative gradient glow */}
      <div
        className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20
          ${v.iconBg} group-hover:opacity-30 transition-opacity`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 mt-3 tracking-tight">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1.5 mt-3">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
                  ${
                    isTrendPositive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
              >
                <TrendIcon className="w-3 h-3" strokeWidth={2.5} />
                {trend}
              </span>
              <span className="text-xs text-slate-400">vs last period</span>
            </div>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-xl ${v.iconBg} shadow-lg ${v.glow}
            flex items-center justify-center flex-shrink-0 ${v.iconColor}
            group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}
