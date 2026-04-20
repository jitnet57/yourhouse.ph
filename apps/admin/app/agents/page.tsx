'use client'

import React, { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus, MoreVertical, Settings, Power, Zap, Target, Clock, Phone } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

interface Agent {
  id: string
  name: string
  status: 'active' | 'inactive' | 'error'
  model: string
  response_time_ms: number
  accuracy_score: number
  calls_today: number
  last_activity: string
  configuration: {
    language_model: string
    temperature: number
    max_tokens: number
    system_prompt: string
  }
}

const STATUS_COLORS: Record<string, string> = {
  active: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  inactive: 'text-slate-600 bg-slate-100 border-slate-200',
  error: 'text-red-700 bg-red-50 border-red-200',
}

const METRICS_DATA = [
  { time: '08:00', accuracy: 92, response_time: 145, success_rate: 96 },
  { time: '10:00', accuracy: 93, response_time: 138, success_rate: 97 },
  { time: '12:00', accuracy: 91, response_time: 156, success_rate: 95 },
  { time: '14:00', accuracy: 94, response_time: 142, success_rate: 98 },
  { time: '16:00', accuracy: 93.5, response_time: 150, success_rate: 97 },
  { time: '18:00', accuracy: 92.8, response_time: 148, success_rate: 96 },
]

const MOCK_AGENTS: Agent[] = [
  { id: '1', name: 'Property Analyzer AI', status: 'active', model: 'gpt-4-turbo', response_time_ms: 145, accuracy_score: 94.2, calls_today: 1245, last_activity: '2 minutes ago', configuration: { language_model: 'gpt-4-turbo', temperature: 0.7, max_tokens: 2000, system_prompt: 'You are a real estate analysis expert...' } },
  { id: '2', name: 'Lead Qualification Bot', status: 'active', model: 'gpt-3.5-turbo', response_time_ms: 87, accuracy_score: 91.5, calls_today: 2341, last_activity: '30 seconds ago', configuration: { language_model: 'gpt-3.5-turbo', temperature: 0.5, max_tokens: 1000, system_prompt: 'You are a lead qualification specialist...' } },
  { id: '3', name: 'Document Processor', status: 'active', model: 'gpt-4-vision', response_time_ms: 234, accuracy_score: 87.8, calls_today: 567, last_activity: '5 minutes ago', configuration: { language_model: 'gpt-4-vision', temperature: 0.3, max_tokens: 3000, system_prompt: 'You are a document analysis expert...' } },
]

export default function AgentsPage() {
  const { t } = useLanguage()
  const a = t.agents

  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const onToggleStatus = (agentId: string) => {
    setAgents(agents.map((ag) =>
      ag.id === agentId ? { ...ag, status: ag.status === 'active' ? 'inactive' : 'active' } : ag
    ))
  }

  const metricCards = [
    { label: a.metrics.active, value: agents.filter((ag) => ag.status === 'active').length.toString(), icon: <Zap className="w-5 h-5" />, color: 'text-emerald-600 bg-emerald-50' },
    { label: a.metrics.avgResponse, value: '142ms', icon: <Clock className="w-5 h-5" />, color: 'text-indigo-600 bg-indigo-50' },
    { label: a.metrics.avgAccuracy, value: '91.8%', icon: <Target className="w-5 h-5" />, color: 'text-purple-600 bg-purple-50' },
    { label: a.metrics.todayCalls, value: '4.1K', icon: <Phone className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50' },
  ]

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{a.title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{a.subtitle}</p>
        </div>
        <button className="btn-primary self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          {a.newAgent}
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-slate-200/70 shadow-card p-5">
            <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
              {card.icon}
            </div>
            <p className="text-xs font-medium text-slate-500">{card.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-card p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">Accuracy Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={METRICS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[88, 96]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Line type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-card p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">Response Time (ms)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={METRICS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="response_time" fill="#a855f7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Deployed Agents</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{a.table.agent}</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{a.table.model}</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{a.table.status}</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{a.table.performance}</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{a.table.activity}</th>
              <th className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">{a.table.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{agent.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-mono font-medium">{agent.model}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[agent.status]}`}>
                    {a.status[agent.status as keyof typeof a.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${agent.accuracy_score}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{agent.accuracy_score}%</span>
                    </div>
                    <p className="text-xs text-slate-400">{agent.response_time_ms}ms · {agent.calls_today.toLocaleString()} calls</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">{agent.last_activity}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setSelectedAgent(agent)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(agent.id)}
                      className={`p-2 rounded-lg transition-colors ${agent.status === 'active' ? 'hover:bg-red-50 text-red-400 hover:text-red-600' : 'hover:bg-emerald-50 text-emerald-400 hover:text-emerald-600'}`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Config Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedAgent(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-fade-in-up p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Configure: {selectedAgent.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Model</label>
                <input type="text" value={selectedAgent.configuration.language_model} readOnly
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Temperature</label>
                  <input type="number" min="0" max="1" step="0.1" defaultValue={selectedAgent.configuration.temperature}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Max Tokens</label>
                  <input type="number" defaultValue={selectedAgent.configuration.max_tokens}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">System Prompt</label>
                <textarea defaultValue={selectedAgent.configuration.system_prompt} rows={4}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setSelectedAgent(null)} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={() => setSelectedAgent(null)} className="flex-1 btn-primary">Save Configuration</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
