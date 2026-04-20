'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Shield, Mail, Phone, Calendar } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'agent' | 'viewer';
  is_active: boolean;
  created_at: string;
  last_login: string;
  avatar_url?: string;
}

interface RolePermission {
  role: string;
  canManageUsers: boolean;
  canManageProperties: boolean;
  canManageLeads: boolean;
  canAccessReports: boolean;
  canConfigureAgents: boolean;
  canViewAnalytics: boolean;
}

const ROLE_PERMISSIONS: RolePermission[] = [
  {
    role: 'admin',
    canManageUsers: true,
    canManageProperties: true,
    canManageLeads: true,
    canAccessReports: true,
    canConfigureAgents: true,
    canViewAnalytics: true
  },
  {
    role: 'manager',
    canManageUsers: false,
    canManageProperties: true,
    canManageLeads: true,
    canAccessReports: true,
    canConfigureAgents: false,
    canViewAnalytics: true
  },
  {
    role: 'agent',
    canManageUsers: false,
    canManageProperties: false,
    canManageLeads: true,
    canAccessReports: false,
    canConfigureAgents: false,
    canViewAnalytics: false
  },
  {
    role: 'viewer',
    canManageUsers: false,
    canManageProperties: false,
    canManageLeads: false,
    canAccessReports: true,
    canConfigureAgents: false,
    canViewAnalytics: true
  }
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('admin');
  const [formData, setFormData] = useState<{ name: string; email: string; phone: string; role: 'admin' | 'manager' | 'agent' | 'viewer' }>({
    name: '',
    email: '',
    phone: '',
    role: 'agent'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Mock data - replace with actual API call when endpoint is ready
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Administrator',
          email: 'john.admin@yourhouse.ph',
          phone: '+63 9171234567',
          role: 'admin',
          is_active: true,
          created_at: '2026-01-15',
          last_login: '2026-04-17'
        },
        {
          id: '2',
          name: 'Maria Manager',
          email: 'maria.manager@yourhouse.ph',
          phone: '+63 9187654321',
          role: 'manager',
          is_active: true,
          created_at: '2026-02-01',
          last_login: '2026-04-17'
        },
        {
          id: '3',
          name: 'Alex Agent',
          email: 'alex.agent@yourhouse.ph',
          phone: '+63 9169876543',
          role: 'agent',
          is_active: true,
          created_at: '2026-02-15',
          last_login: '2026-04-16'
        },
        {
          id: '4',
          name: 'Sarah Viewer',
          email: 'sarah.viewer@yourhouse.ph',
          phone: '+63 9155555555',
          role: 'viewer',
          is_active: true,
          created_at: '2026-03-01',
          last_login: '2026-04-15'
        }
      ];
      setUsers(mockUsers);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in required fields');
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      is_active: true,
      created_at: new Date().toISOString().split('T')[0],
      last_login: new Date().toISOString().split('T')[0]
    };

    setUsers([...users, newUser]);
    setFormData({ name: '', email: '', phone: '', role: 'agent' });
    setShowForm(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
    setShowForm(true);
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      setUsers(users.map(u =>
        u.id === editingUser.id
          ? { ...u, ...formData }
          : u
      ));
      setEditingUser(null);
      setFormData({ name: '', email: '', phone: '', role: 'agent' });
      setShowForm(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'agent': return 'bg-purple-100 text-purple-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading users...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User & Role Management</h1>
          <p className="text-gray-600 mt-1">Manage team members and their permissions</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({ name: '', email: '', phone: '', role: 'agent' });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Admins</p>
          <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Active Users</p>
          <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.is_active).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Inactive</p>
          <p className="text-2xl font-bold text-gray-900">{users.filter(u => !u.is_active).length}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Last Login</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                  <Mail size={16} />
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                  <Phone size={16} />
                  {user.phone}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${getRoleColor(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                  <Calendar size={16} />
                  {user.last_login}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedRole(user.role);
                        setShowPermissions(true);
                      }}
                      className="p-2 hover:bg-blue-100 rounded text-blue-600"
                      title="View permissions"
                    >
                      <Shield size={18} />
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="p-2 hover:bg-gray-100 rounded text-gray-600"
                      title="Edit user"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 hover:bg-red-100 rounded text-red-600"
                      title="Delete user"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permission Matrix */}
      {showPermissions && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Role Permissions Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-semibold">Permission</th>
                  {['admin', 'manager', 'agent', 'viewer'].map(role => (
                    <th key={role} className="text-center py-2 px-4 font-semibold">
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Manage Users</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✗</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Manage Properties</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✗</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Manage Leads</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✗</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Access Reports</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Configure Agents</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✗</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4">View Analytics</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingUser ? `Edit ${editingUser.name}` : 'Add New User'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Smith"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+63 9171234567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="agent">Agent</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingUser ? handleUpdateUser : handleAddUser}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingUser ? 'Update User' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
