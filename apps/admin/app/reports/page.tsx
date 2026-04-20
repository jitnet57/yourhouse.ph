'use client';

import React, { useState } from 'react';
import { Download, Plus, Filter, Calendar, MoreVertical, TrendingUp } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  description: string;
  report_type: 'leads' | 'properties' | 'agents' | 'revenue' | 'performance';
  created_by: string;
  created_at: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  next_run?: string;
  format: 'pdf' | 'excel' | 'csv';
  status: 'scheduled' | 'completed' | 'running';
}

interface ReportFilter {
  dateRange: 'today' | 'week' | 'month' | 'custom';
  reportType: string;
  frequency: string;
  status: string;
}

const REPORT_TYPES = [
  { value: 'leads', label: 'Leads Performance Report' },
  { value: 'properties', label: 'Properties Inventory Report' },
  { value: 'agents', label: 'Agent Performance Report' },
  { value: 'revenue', label: 'Revenue & Conversion Report' },
  { value: 'performance', label: 'Platform Performance Report' }
];

const EXPORT_FORMATS = [
  { value: 'pdf', label: 'PDF Document', icon: '📄' },
  { value: 'excel', label: 'Excel Spreadsheet', icon: '📊' },
  { value: 'csv', label: 'CSV File', icon: '📋' }
];

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      name: 'Weekly Lead Summary',
      description: 'Overview of leads generated this week',
      report_type: 'leads',
      created_by: 'John Admin',
      created_at: '2026-04-15',
      frequency: 'weekly',
      next_run: '2026-04-21',
      format: 'pdf',
      status: 'scheduled'
    },
    {
      id: '2',
      name: 'Monthly Revenue Report',
      description: 'Total revenue and conversion metrics',
      report_type: 'revenue',
      created_by: 'Maria Manager',
      created_at: '2026-04-01',
      frequency: 'monthly',
      next_run: '2026-05-01',
      format: 'excel',
      status: 'completed'
    },
    {
      id: '3',
      name: 'Agent Performance Analysis',
      description: 'Individual and team performance metrics',
      report_type: 'agents',
      created_by: 'John Admin',
      created_at: '2026-04-10',
      frequency: 'weekly',
      next_run: '2026-04-24',
      format: 'pdf',
      status: 'scheduled'
    }
  ]);

  const [showBuilder, setShowBuilder] = useState(false);
  const [filters, setFilters] = useState<ReportFilter>({
    dateRange: 'month',
    reportType: '',
    frequency: '',
    status: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    reportType: 'leads',
    frequency: 'weekly',
    format: 'pdf',
    scheduled: false
  });

  const handleCreateReport = () => {
    if (!formData.name) {
      alert('Report name is required');
      return;
    }

    const newReport: Report = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      description: formData.description,
      report_type: formData.reportType as any,
      created_by: 'Current User',
      created_at: new Date().toISOString().split('T')[0],
      frequency: formData.frequency as any,
      format: formData.format as any,
      status: 'scheduled'
    };

    setReports([newReport, ...reports]);
    setFormData({
      name: '',
      description: '',
      reportType: 'leads',
      frequency: 'weekly',
      format: 'pdf',
      scheduled: false
    });
    setShowBuilder(false);
  };

  const handleExportReport = (reportId: string, format: string) => {
    console.log(`Exporting report ${reportId} as ${format}`);
    alert(`Report exported as ${format.toUpperCase()}`);
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'leads': return 'bg-blue-100 text-blue-800';
      case 'properties': return 'bg-green-100 text-green-800';
      case 'agents': return 'bg-purple-100 text-purple-800';
      case 'revenue': return 'bg-yellow-100 text-yellow-800';
      case 'performance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'running': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = reports.filter(report => {
    if (filters.reportType && report.report_type !== filters.reportType) return false;
    if (filters.status && report.status !== filters.status) return false;
    if (filters.frequency && report.frequency !== filters.frequency) return false;
    return true;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Export</h1>
          <p className="text-gray-600 mt-1">Generate, schedule, and export business reports</p>
        </div>
        <button
          onClick={() => setShowBuilder(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          New Report
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Total Reports</p>
          <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Scheduled</p>
          <p className="text-2xl font-bold text-gray-900">{reports.filter(r => r.status === 'scheduled').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-2xl font-bold text-gray-900">{reports.filter(r => r.status === 'completed').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">This Month</p>
          <p className="text-2xl font-bold text-gray-900">{reports.filter(r => r.created_at.startsWith('2026-04')).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4 flex-wrap">
          <Filter size={20} className="text-gray-600" />
          <select
            value={filters.reportType}
            onChange={e => setFilters({ ...filters, reportType: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Report Types</option>
            {REPORT_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filters.frequency}
            onChange={e => setFilters({ ...filters, frequency: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Frequencies</option>
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button
            onClick={() => setFilters({ dateRange: 'month', reportType: '', frequency: '', status: '' })}
            className="px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-600">No reports match your filters</p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div key={report.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{report.name}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getReportTypeColor(report.report_type)}`}>
                      {REPORT_TYPES.find(t => t.value === report.report_type)?.label}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{report.description}</p>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Created By</p>
                      <p className="font-medium">{report.created_by}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Frequency</p>
                      <p className="font-medium">{report.frequency}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Format</p>
                      <p className="font-medium">{report.format.toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Created Date</p>
                      <p className="font-medium">{report.created_at}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleExportReport(report.id, report.format)}
                    className="p-2 hover:bg-blue-100 rounded text-blue-600"
                    title="Export"
                  >
                    <Download size={20} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded text-gray-600">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Builder Modal */}
      {showBuilder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-6">Create New Report</h2>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Report Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Weekly Lead Summary"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this report contains..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Report Configuration */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Configuration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                    <select
                      value={formData.reportType}
                      onChange={e => setFormData({ ...formData, reportType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {REPORT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
                    <select
                      value={formData.format}
                      onChange={e => setFormData({ ...formData, format: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {EXPORT_FORMATS.map(fmt => (
                        <option key={fmt.value} value={fmt.value}>{fmt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Scheduling */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Scheduling</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Generate</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.frequency === 'once'}
                        onChange={() => setFormData({ ...formData, frequency: 'once' })}
                      />
                      <span className="text-sm">Once right now</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.frequency === 'daily'}
                        onChange={() => setFormData({ ...formData, frequency: 'daily' })}
                      />
                      <span className="text-sm">Daily</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.frequency === 'weekly'}
                        onChange={() => setFormData({ ...formData, frequency: 'weekly' })}
                      />
                      <span className="text-sm">Weekly</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.frequency === 'monthly'}
                        onChange={() => setFormData({ ...formData, frequency: 'monthly' })}
                      />
                      <span className="text-sm">Monthly</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBuilder(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
