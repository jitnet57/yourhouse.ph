'use client'

import React, { useState } from 'react'
import { Download, Plus, Filter, MoreVertical, FileText, X, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

interface Report {
  id: string
  name: string
  description: string
  report_type: 'leads' | 'properties' | 'agents' | 'revenue' | 'performance'
  created_by: string
  created_at: string
  frequency: 'once' | 'daily' | 'weekly' | 'monthly'
  next_run?: string
  format: 'pdf' | 'excel' | 'csv'
  status: 'scheduled' | 'completed' | 'running'
}

const TYPE_COLORS: Record<string, string> = {
  leads: 'text-blue-700 bg-blue-50 border-blue-200',
  properties: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  agents: 'text-purple-700 bg-purple-50 border-purple-200',
  revenue: 'text-amber-700 bg-amber-50 border-amber-200',
  performance: 'text-red-700 bg-red-50 border-red-200',
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  running: 'text-amber-700 bg-amber-50 border-amber-200',
  completed: 'text-emerald-700 bg-emerald-50 border-emerald-200',
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  scheduled: <Clock className="w-3 h-3" />,
  running: <Loader2 className="w-3 h-3 animate-spin" />,
  completed: <CheckCircle2 className="w-3 h-3" />,
}

const REPORT_TYPE_LABELS: Record<string, string> = {
  leads: 'Leads Performance', properties: 'Properties Inventory',
  agents: 'Agent Performance', revenue: 'Revenue & Conversion', performance: 'Platform Performance',
}

const MOCK_REPORTS: Report[] = [
  { id: '1', name: 'Weekly Lead Summary', description: 'Overview of leads generated this week', report_type: 'leads', created_by: 'John Admin', created_at: '2026-04-15', frequency: 'weekly', next_run: '2026-04-21', format: 'pdf', status: 'scheduled' },
  { id: '2', name: 'Monthly Revenue Report', description: 'Total revenue and conversion metrics', report_type: 'revenue', created_by: 'Maria Manager', created_at: '2026-04-01', frequency: 'monthly', next_run: '2026-05-01', format: 'excel', status: 'completed' },
  { id: '3', name: 'Agent Performance Analysis', description: 'Individual and team performance metrics', report_type: 'agents', created_by: 'John Admin', created_at: '2026-04-10', frequency: 'weekly', next_run: '2026-04-24', format: 'pdf', status: 'scheduled' },
]

export default function ReportsPage() {
  const { t } = useLanguage()
  const r = t.reports

  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS)
  const [showBuilder, setShowBuilder] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterFreq, setFilterFreq] = useState('')
  const [formData, setFormData] = useState({ name: '', description: '', reportType: 'leads', frequency: 'weekly', format: 'pdf' })

  const filtered = reports.filter((rep) => {
    if (filterStatus && rep.status !== filterStatus) return false
    if (filterFreq && rep.frequency !== filterFreq) return false
    return true
  })

  const handleCreate = () => {
    if (!formData.name) { alert('Report name is required'); return }
    const newReport: Report = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      report_type: formData.reportType as Report['report_type'],
      created_by: 'Admin',
      created_at: new Date().toISOString().split('T')[0],
      frequency: formData.frequency as Report['frequency'],
      format: formData.format as Report['format'],
      status: 'scheduled',
    }
    setReports([newReport, ...reports])
    setFormData({ name: '', description: '', reportType: 'leads', frequency: 'weekly', format: 'pdf' })
    setShowBuilder(false)
  }

  const stats = [
    { label: 'Total', value: reports.length },
    { label: r.status.scheduled, value: reports.filter((rep) => rep.status === 'scheduled').length },
    { label: r.status.completed, value: reports.filter((rep) => rep.status === 'completed').length },
    { label: 'This Month', value: reports.filter((rep) => rep.created_at.startsWith('2026-04')).length },
  ]

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{r.title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">Generate, schedule, and export business reports</p>
        </div>
        <button onClick={() => setShowBuilder(true)} className="btn-primary self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          {r.newReport}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-200/70 shadow-card p-4">
            <p className="text-xs font-medium text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-card p-4 flex items-center gap-3 flex-wrap">
        <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <option value="">All Status</option>
          {(Object.keys(r.status) as Array<keyof typeof r.status>).map((s) => (
            <option key={s} value={s}>{r.status[s]}</option>
          ))}
        </select>
        <select value={filterFreq} onChange={(e) => setFilterFreq(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <option value="">All Frequencies</option>
          {(Object.keys(r.frequency) as Array<keyof typeof r.frequency>).map((f) => (
            <option key={f} value={f}>{r.frequency[f]}</option>
          ))}
        </select>
        {(filterStatus || filterFreq) && (
          <button onClick={() => { setFilterStatus(''); setFilterFreq('') }}
            className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Clear
          </button>
        )}
      </div>

      {/* Report Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-card p-16 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">{r.noResults}</p>
          </div>
        ) : filtered.map((report) => (
          <div key={report.id} className="bg-white rounded-2xl border border-slate-200/70 shadow-card p-6 hover:shadow-card-hover transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h3 className="text-base font-bold text-slate-900">{report.name}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${TYPE_COLORS[report.report_type]}`}>
                    {REPORT_TYPE_LABELS[report.report_type]}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${STATUS_COLORS[report.status]}`}>
                    {STATUS_ICONS[report.status]}
                    {r.status[report.status as keyof typeof r.status]}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-3">{report.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-slate-400 mb-0.5">Created By</p>
                    <p className="font-semibold text-slate-700">{report.created_by}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-0.5">Frequency</p>
                    <p className="font-semibold text-slate-700">{r.frequency[report.frequency as keyof typeof r.frequency]}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-0.5">Format</p>
                    <p className="font-semibold text-slate-700">{report.format.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-0.5">Created</p>
                    <p className="font-semibold text-slate-700">{report.created_at}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                <button className="p-2 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Builder Modal */}
      {showBuilder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowBuilder(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-fade-in-up">
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">{r.newReport}</h2>
              <button onClick={() => setShowBuilder(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-8 py-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Report Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Weekly Lead Summary"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}
                  placeholder="Describe what this report contains..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Report Type</label>
                  <select value={formData.reportType} onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition">
                    {Object.entries(REPORT_TYPE_LABELS).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Format</label>
                  <select value={formData.format} onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition">
                    <option value="pdf">PDF Document</option>
                    <option value="excel">Excel Spreadsheet</option>
                    <option value="csv">CSV File</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Frequency</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(r.frequency) as Array<keyof typeof r.frequency>).map((freq) => (
                    <button key={freq} type="button" onClick={() => setFormData({ ...formData, frequency: freq })}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all
                        ${formData.frequency === freq ? 'text-indigo-700 bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                      {r.frequency[freq]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-8 py-6 border-t border-slate-100">
              <button onClick={() => setShowBuilder(false)} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={handleCreate} className="flex-1 btn-primary">Create Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
