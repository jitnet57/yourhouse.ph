/**
 * Leads Management Page
 */
'use client'

import React, { useState } from 'react'
import { Plus, Search, Filter } from 'lucide-react'

export default function LeadsPage() {
  const [leads] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'interested',
      property: 'Luxury Condo in BGC',
      agent: 'Maria Santos',
      interactions: 5,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'negotiating',
      property: 'House & Lot in Cavite',
      agent: 'Carlos Reyes',
      interactions: 8,
    },
  ])

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    interested: 'bg-purple-100 text-purple-800',
    negotiating: 'bg-orange-100 text-orange-800',
    closed: 'bg-green-100 text-green-800',
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <button className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} /> Add Lead
        </button>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
          />
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2">
          <Filter size={20} /> View: Pipeline
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Property</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Agent</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Interactions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{lead.name}</p>
                  <p className="text-sm text-gray-600">{lead.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-900">{lead.property}</td>
                <td className="px-6 py-4 text-gray-900">{lead.agent}</td>
                <td className="px-6 py-4 text-gray-900">{lead.interactions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
