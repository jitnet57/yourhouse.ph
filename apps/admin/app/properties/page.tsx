/**
 * Properties List Page
 */
'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Search, Filter, MoreVertical } from 'lucide-react'
import { apiClient } from '@/lib/api'

export default function PropertiesPage() {
  const [properties, setProperties] = useState<{ id: string; title: string; address: string; price: number; status: string; aiScore: number; views: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      // TODO: Fetch from API
      setProperties([
        {
          id: '1',
          title: 'Luxury Condo in BGC',
          address: 'Fort Bonifacio, Taguig',
          price: 5500000,
          status: 'active',
          aiScore: 98,
          views: 342,
        },
        {
          id: '2',
          title: 'House & Lot in Cavite',
          address: 'Kawit, Cavite',
          price: 2800000,
          status: 'active',
          aiScore: 92,
          views: 215,
        },
      ])
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
        <button className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} /> Add Property
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
          />
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
          <Filter size={20} /> Filter
        </button>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Address</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">AI Score</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Views</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {properties.map((prop) => (
              <tr key={prop.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{prop.title}</p>
                    <p className="text-sm text-gray-600">{prop.address}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-900">₱{prop.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    prop.status === 'active' ? 'bg-success/20 text-success' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {prop.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full"
                        style={{ width: `${prop.aiScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold">{prop.aiScore}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-900">{prop.views}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-gray-200 rounded">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
