'use client'

import React, { useState } from 'react'
import { Plus, Edit, Trash2, Shield, Mail, Phone, Calendar, X } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'manager' | 'agent' | 'viewer'
  is_active: boolean
  created_at: string
  last_login: string
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'text-red-700 bg-red-50 border-red-200',
  manager: 'text-blue-700 bg-blue-50 border-blue-200',
  agent: 'text-purple-700 bg-purple-50 border-purple-200',
  viewer: 'text-slate-600 bg-slate-100 border-slate-200',
}

const ROLE_GRADIENT: Record<string, string> = {
  admin: 'from-red-400 to-red-600',
  manager: 'from-blue-400 to-blue-600',
  agent: 'from-purple-400 to-purple-600',
  viewer: 'from-slate-400 to-slate-500',
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'John Administrator', email: 'john.admin@yourhouse.ph', phone: '+63 917 123 4567', role: 'admin', is_active: true, created_at: '2026-01-15', last_login: '2026-04-17' },
  { id: '2', name: 'Maria Manager', email: 'maria.manager@yourhouse.ph', phone: '+63 918 765 4321', role: 'manager', is_active: true, created_at: '2026-02-01', last_login: '2026-04-17' },
  { id: '3', name: 'Alex Agent', email: 'alex.agent@yourhouse.ph', phone: '+63 916 987 6543', role: 'agent', is_active: true, created_at: '2026-02-15', last_login: '2026-04-16' },
  { id: '4', name: 'Sarah Viewer', email: 'sarah.viewer@yourhouse.ph', phone: '+63 915 555 5555', role: 'viewer', is_active: false, created_at: '2026-03-01', last_login: '2026-04-15' },
]

export default function UsersPage() {
  const { t } = useLanguage()
  const u = t.users

  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'agent' as User['role'] })

  const filtered = users.filter(
    (user) => user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditingUser(null)
    setFormData({ name: '', email: '', phone: '', role: 'agent' })
    setShowForm(true)
  }

  const openEdit = (user: User) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email, phone: user.phone, role: user.role })
    setShowForm(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.email) return
    if (editingUser) {
      setUsers(users.map((usr) => usr.id === editingUser.id ? { ...usr, ...formData } : usr))
    } else {
      setUsers([...users, { id: Date.now().toString(), ...formData, is_active: true, created_at: new Date().toISOString().split('T')[0], last_login: '-' }])
    }
    setShowForm(false)
  }

  const handleDelete = (userId: string) => {
    if (confirm('Delete this user?')) setUsers(users.filter((usr) => usr.id !== userId))
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{u.title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{users.length} team members</p>
        </div>
        <button onClick={openAdd} className="btn-primary self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          {u.addUser}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(['admin', 'manager', 'agent', 'viewer'] as const).map((role) => (
          <div key={role} className="bg-white rounded-2xl border border-slate-200/70 shadow-card p-4">
            <p className="text-xs font-medium text-slate-500 mb-1">{u.roles[role]}</p>
            <p className="text-2xl font-bold text-slate-900">{users.filter((usr) => usr.role === role).length}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder={u.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{u.table.user}</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{u.table.role}</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{u.table.status}</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{u.table.lastLogin}</th>
              <th className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">{u.table.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ROLE_GRADIENT[user.role]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Mail className="w-3 h-3" />{user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${ROLE_COLORS[user.role]}`}>
                    {u.roles[user.role as keyof typeof u.roles]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${user.is_active ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-slate-600 bg-slate-100 border-slate-200'}`}>
                    {user.is_active ? u.status.active : u.status.inactive}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />{user.last_login}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(user)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-slate-400">
                  <Shield className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">{u.noResults}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md animate-fade-in-up p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">{editingUser ? `Edit ${editingUser.name}` : u.addUser}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Smith"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+63 917 123 4567"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{u.table.role}</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition">
                  {(Object.keys(u.roles) as Array<keyof typeof u.roles>).map((role) => (
                    <option key={role} value={role}>{u.roles[role]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={handleSave} className="flex-1 btn-primary">{editingUser ? 'Update' : u.addUser}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
