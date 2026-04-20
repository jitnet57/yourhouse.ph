'use client'

import React, { useState } from 'react'
import { Plus, Search, Filter, MoreVertical, Mail, Phone, User } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  status: string
  property: string
  agent: string
  interactions: number
}

const STATUS_COLORS: Record<string, string> = {
  new: 'text-blue-700 bg-blue-50 border-blue-200',
  contacted: 'text-amber-700 bg-amber-50 border-amber-200',
  interested: 'text-purple-700 bg-purple-50 border-purple-200',
  negotiating: 'text-orange-700 bg-orange-50 border-orange-200',
  closed: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  lost: 'text-slate-700 bg-slate-100 border-slate-200',
}

export default function LeadsPage() {
  const { t } = useLanguage()
  const l = t.leads

  const [leads] = useState<Lead[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+63 917 123 4567', status: 'interested', property: 'Luxury Condo in BGC', agent: 'Maria Santos', interactions: 5 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+63 918 765 4321', status: 'negotiating', property: 'House & Lot in Cavite', agent: 'Carlos Reyes', interactions: 8 },
    { id: '3', name: 'Park Ji-won', email: 'jiwon@example.com', phone: '+82 10 1234 5678', status: 'new', property: 'Studio Unit Makati', agent: 'Maria Santos', interactions: 1 },
    { id: '4', name: 'Chen Wei', email: 'chen@example.com', phone: '+86 138 0013 8000', status: 'contacted', property: 'Townhouse Alabang', agent: 'Ana Cruz', interactions: 3 },
  ])
  const [search, setSearch] = useState('')

  const filtered = leads.filter(
    (lead) => lead.name.toLowerCase().includes(search.toLowerCase()) || lead.email.toLowerCase().includes(search.toLowerCase())
  )

  const statusBadge = (status: string) => (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[status] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {l.status[status as keyof typeof l.status] ?? status}
    </span>
  )

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{l.title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{leads.length} total leads</p>
        </div>
        <button className="btn-primary self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          {l.addLead}
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder={l.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          />
        </div>
        <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition">
          <Filter className="w-4 h-4" /> {l.viewPipeline}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{l.table.name}</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{l.table.contact}</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{l.table.property}</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{l.table.agent}</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{l.table.status}</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{l.table.interactions}</th>
              <th className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">{l.table.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {lead.name.charAt(0)}
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{lead.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-0.5">
                    <p className="text-xs text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</p>
                    {lead.phone && <p className="text-xs text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</p>}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700 max-w-[180px] truncate">{lead.property}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-400" />{lead.agent}
                  </div>
                </td>
                <td className="px-6 py-4">{statusBadge(lead.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-14 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${Math.min(lead.interactions * 10, 100)}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{lead.interactions}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-slate-400">
                  <User className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">{l.noResults}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
