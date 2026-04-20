'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, MoreVertical, Settings, Power } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  model: string;
  response_time_ms: number;
  accuracy_score: number;
  calls_today: number;
  last_activity: string;
  configuration: {
    language_model: string;
    temperature: number;
    max_tokens: number;
    system_prompt: string;
  };
}

interface PerformanceData {
  time: string;
  accuracy: number;
  response_time: number;
  success_rate: number;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [metrics, setMetrics] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showConfigForm, setShowConfigForm] = useState(false);

  useEffect(() => {
    fetchAgents();
    fetchMetrics();
  }, []);

  const fetchAgents = async () => {
    try {
      // Mock data - replace with actual API call when endpoint is ready
      const mockAgents: Agent[] = [
        {
          id: '1',
          name: 'Property Analyzer AI',
          status: 'active',
          model: 'gpt-4-turbo',
          response_time_ms: 145,
          accuracy_score: 94.2,
          calls_today: 1245,
          last_activity: '2 minutes ago',
          configuration: {
            language_model: 'gpt-4-turbo',
            temperature: 0.7,
            max_tokens: 2000,
            system_prompt: 'You are a real estate analysis expert...'
          }
        },
        {
          id: '2',
          name: 'Lead Qualification Bot',
          status: 'active',
          model: 'gpt-3.5-turbo',
          response_time_ms: 87,
          accuracy_score: 91.5,
          calls_today: 2341,
          last_activity: '30 seconds ago',
          configuration: {
            language_model: 'gpt-3.5-turbo',
            temperature: 0.5,
            max_tokens: 1000,
            system_prompt: 'You are a lead qualification specialist...'
          }
        },
        {
          id: '3',
          name: 'Document Processor',
          status: 'active',
          model: 'gpt-4-vision',
          response_time_ms: 234,
          accuracy_score: 87.8,
          calls_today: 567,
          last_activity: '5 minutes ago',
          configuration: {
            language_model: 'gpt-4-vision',
            temperature: 0.3,
            max_tokens: 3000,
            system_prompt: 'You are a document analysis expert...'
          }
        }
      ];
      setAgents(mockAgents);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    const mockMetrics: PerformanceData[] = [
      { time: '08:00', accuracy: 92, response_time: 145, success_rate: 96 },
      { time: '10:00', accuracy: 93, response_time: 138, success_rate: 97 },
      { time: '12:00', accuracy: 91, response_time: 156, success_rate: 95 },
      { time: '14:00', accuracy: 94, response_time: 142, success_rate: 98 },
      { time: '16:00', accuracy: 93.5, response_time: 150, success_rate: 97 },
      { time: '18:00', accuracy: 92.8, response_time: 148, success_rate: 96 }
    ];
    setMetrics(mockMetrics);
  };

  const onAgentStatusChange = async (agentId: string, newStatus: 'active' | 'inactive') => {
    setAgents(agents.map(a => 
      a.id === agentId ? { ...a, status: newStatus } : a
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading agents...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Agent Control Center</h1>
          <p className="text-gray-600 mt-1">Monitor and manage AI agents in real-time</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          New Agent
        </button>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Active Agents</p>
          <p className="text-2xl font-bold text-gray-900">{agents.filter(a => a.status === 'active').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Avg Response Time</p>
          <p className="text-2xl font-bold text-gray-900">142ms</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Avg Accuracy</p>
          <p className="text-2xl font-bold text-gray-900">91.8%</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Today Calls</p>
          <p className="text-2xl font-bold text-gray-900">4.1K</p>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Accuracy Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" stroke="#0074D9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Response Time Analytics</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="response_time" fill="#FFD700" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agents List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Deployed Agents</h2>
        </div>
        <div className="divide-y">
          {agents.map(agent => (
            <div key={agent.id} className="p-6 hover:bg-gray-50 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(agent.status)}`}>
                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Model</p>
                    <p className="font-medium">{agent.model}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Response Time</p>
                    <p className="font-medium">{agent.response_time_ms}ms</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Accuracy</p>
                    <p className="font-medium text-green-600">{agent.accuracy_score}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Calls Today</p>
                    <p className="font-medium">{agent.calls_today.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Last activity: {agent.last_activity}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedAgent(agent)}
                  className="p-2 hover:bg-gray-100 rounded"
                  title="Configure"
                >
                  <Settings size={20} className="text-gray-600" />
                </button>
                <button
                  onClick={() => onAgentStatusChange(agent.id, agent.status === 'active' ? 'inactive' : 'active')}
                  className={`p-2 rounded ${agent.status === 'active' ? 'hover:bg-red-100' : 'hover:bg-green-100'}`}
                  title="Toggle status"
                >
                  <Power size={20} className={agent.status === 'active' ? 'text-red-600' : 'text-green-600'} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Config Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Configure {selectedAgent.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input
                  type="text"
                  value={selectedAgent.configuration.language_model}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue={selectedAgent.configuration.temperature}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
                  <input
                    type="number"
                    defaultValue={selectedAgent.configuration.max_tokens}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
                <textarea
                  defaultValue={selectedAgent.configuration.system_prompt}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
