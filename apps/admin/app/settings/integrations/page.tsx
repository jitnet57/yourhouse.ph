'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Copy, Settings, Trash2, Plus } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Integration {
  id: string;
  name: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  description: string;
  logo_url?: string;
  connected_at?: string;
  last_used?: string;
  config?: Record<string, any>;
}

interface WebhookConfig {
  id: string;
  integration_id: string;
  event_type: string;
  url: string;
  is_active: boolean;
  created_at: string;
}

const AVAILABLE_INTEGRATIONS = [
  {
    id: 'twilio',
    name: 'Twilio',
    provider: 'twilio',
    description: 'SMS, voice calls, and messaging',
    features: ['SMS Sending', 'Voice Calls', 'WhatsApp Integration'],
    docs: 'https://docs.twilio.com',
    required_fields: ['phone_number'],
    optional_fields: ['api_secret'],
    requires_api_key: true
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    provider: 'elevenlabs',
    description: 'AI-powered voice generation',
    features: ['Text-to-Speech', 'Voice Cloning', 'Custom Voices'],
    docs: 'https://elevenlabs.io/app/agents/agents/agent_9901knvzexs9fpjbsa4t094gmtby/preview?branchId=agtbrch_7901knvzezshenrskdj0w0jt7az0&include_draft=true',
    required_fields: [],
    optional_fields: ['default_voice', 'api_secret'],
    requires_api_key: true
  },
  {
    id: 'cal-com',
    name: 'Cal.com',
    provider: 'cal-com',
    description: 'Scheduling and meeting booking',
    features: ['Appointment Booking', 'Calendar Sync', 'Reminders'],
    docs: 'https://docs.cal.com',
    required_fields: [],
    optional_fields: []
  },
  {
    id: 'supabase',
    name: 'Supabase',
    provider: 'supabase',
    description: 'PostgreSQL database & auth',
    features: ['Database', 'Authentication', 'Real-time Sync'],
    docs: 'https://docs.supabase.com',
    required_fields: [],
    optional_fields: [],
    requires_api_key: true
  },
  {
    id: 'stripe',
    name: 'Stripe',
    provider: 'stripe',
    description: 'Payment processing',
    features: ['Payments', 'Invoicing', 'Subscriptions'],
    docs: 'https://docs.stripe.com',
    required_fields: [],
    optional_fields: [],
    requires_api_key: true
  },
  {
    id: 'langgraph',
    name: 'LangGraph',
    provider: 'langgraph',
    description: 'AI orchestration engine for multi-step workflows',
    features: ['Lead Qualification', 'Property Agent Workflows', 'Stateful Chat'],
    docs: 'https://langgraph.dev',
    required_fields: [],
    optional_fields: [],
    requires_api_key: false
  }
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [availableIntegrations, setAvailableIntegrations] = useState<typeof AVAILABLE_INTEGRATIONS>(AVAILABLE_INTEGRATIONS);
  const [loadingIntegrations, setLoadingIntegrations] = useState(true);

  const [integrationStatus, setIntegrationStatus] = useState<Record<string, { configured: boolean }>>({});
  const [statusError, setStatusError] = useState<string | null>(null);
  const [runningHealthCheck, setRunningHealthCheck] = useState(false);
  const [healthCheckResult, setHealthCheckResult] = useState<Record<string, any> | null>(null);
  const [healthCheckError, setHealthCheckError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [testingIntegrationId, setTestingIntegrationId] = useState<string | null>(null);
  const [integrationTestResults, setIntegrationTestResults] = useState<Record<string, any>>({});

  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<typeof AVAILABLE_INTEGRATIONS[0] | null>(null);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookForm, setWebhookForm] = useState({
    integration_id: '',
    event_type: 'sms_received',
    url: ''
  });

  const [apiKeyForm, setApiKeyForm] = useState({
    api_key: '',
    api_secret: '',
    phone_number: '',
    default_voice: ''
  });

  const getStatusKey = (provider: string) => {
    if (provider === 'cal-com') return 'calcom';
    return provider;
  };

  const getConfiguredStatus = (provider: string) => {
    const key = getStatusKey(provider);
    const data = integrationStatus[key];
    return data?.configured ? 'connected' : 'disconnected';
  };

  const validateIntegrationForm = () => {
    if (!selectedIntegration) {
      setFormError('No integration selected');
      return false;
    }

    if (selectedIntegration.requires_api_key && !apiKeyForm.api_key) {
      setFormError('API key is required');
      return false;
    }

    if (selectedIntegration.provider === 'twilio' && !apiKeyForm.phone_number) {
      setFormError('Twilio phone number is required');
      return false;
    }

    return true;
  };

  const getIntegrationStatusEndpoint = (provider: string) => {
    switch (provider) {
      case 'twilio':
        return apiClient.getTwilioStatus()
      case 'elevenlabs':
        return apiClient.getElevenLabsStatus()
      case 'cal-com':
        return apiClient.getCalcomStatus()
      case 'langgraph':
        return apiClient.getLangGraphStatus()
      default:
        return Promise.reject(new Error('No provider-specific status endpoint'))
    }
  };

  const getProgressTasks = () => {
    const requiredIntegrations = ['twilio', 'elevenlabs', 'calcom', 'langgraph'];
    const tasks = requiredIntegrations.map(provider => ({
      id: provider,
      label: `Connect ${provider === 'calcom' ? 'Cal.com' : provider.charAt(0).toUpperCase() + provider.slice(1)}`,
      done: getConfiguredStatus(provider) === 'connected'
    }));

    tasks.push({
      id: 'health_check',
      label: 'Run health check',
      done: Boolean(healthCheckResult)
    });

    tasks.push({
      id: 'test_integrations',
      label: 'Test connected integrations',
      done: Object.keys(integrationTestResults).length > 0
    });

    return tasks;
  };

  const progressTasks = getProgressTasks();
  const completedTaskCount = progressTasks.filter(task => task.done).length;
  const progressPercent = Math.round((completedTaskCount / progressTasks.length) * 100);

  const updateIntegrationsFromStatus = (status: Record<string, { configured: boolean }>) => {
    const updated = AVAILABLE_INTEGRATIONS.map(integration => {
      const configured = status[getStatusKey(integration.provider)]?.configured || false;
      return {
        id: integration.id,
        name: integration.name,
        provider: integration.provider,
        description: integration.description,
        status: (configured ? 'connected' : 'disconnected') as 'connected' | 'disconnected' | 'error',
        connected_at: configured ? new Date().toISOString().split('T')[0] : '',
        last_used: configured ? new Date().toISOString().split('T')[0] : '',
        config: {}
      };
    });
    setIntegrations(updated);
  };

  const handleRunHealthCheck = async () => {
    setRunningHealthCheck(true);
    try {
      const result = await apiClient.testAllIntegrations();
      setHealthCheckResult(result.data);
    } catch (e) {
      setHealthCheckError('Health check failed');
    } finally {
      setRunningHealthCheck(false);
    }
  };

  const loadIntegrations = async () => {
    try {
      setLoadingIntegrations(true);
      const [statusRes, connectedRes, availableRes, webhooksRes] = await Promise.all([
        apiClient.getIntegrationOrchestrationStatus(),
        apiClient.getIntegrations(),
        apiClient.getAvailableIntegrations(),
        apiClient.getWebhooks()
      ]);

      const status = statusRes.data.integrations || {};
      setIntegrationStatus(status);
      updateIntegrationsFromStatus(status);

      setIntegrations(connectedRes.data || []);
      setAvailableIntegrations(availableRes.data || AVAILABLE_INTEGRATIONS);
      setWebhooks(webhooksRes.data || []);
    } catch (error) {
      setStatusError(String(error));
    } finally {
      setLoadingIntegrations(false);
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  const handleConnectIntegration = async () => {
    if (!selectedIntegration) return;
    setFormError(null);

    if (!validateIntegrationForm()) {
      return;
    }

    try {
      const config: Record<string, any> = {
        api_key: apiKeyForm.api_key,
        api_secret: apiKeyForm.api_secret || undefined
      };

      const additionalConfig: Record<string, any> = {};
      if (selectedIntegration.provider === 'twilio') {
        additionalConfig.phone_number = apiKeyForm.phone_number || undefined;
      }
      if (selectedIntegration.provider === 'elevenlabs') {
        additionalConfig.default_voice = apiKeyForm.default_voice || undefined;
      }

      if (Object.keys(additionalConfig).length > 0) {
        config.additional_config = additionalConfig;
      }

      const res = await apiClient.connectIntegration(selectedIntegration.provider, config);
      const newIntegration = res.data;
      setIntegrations(prev => [...prev.filter(i => i.provider !== selectedIntegration.provider), newIntegration]);
      setIntegrationStatus(prev => ({
        ...prev,
        [getStatusKey(selectedIntegration.provider)]: { configured: true }
      }));
      setShowConfigModal(false);
      setSelectedIntegration(null);
      setApiKeyForm({ api_key: '', api_secret: '', phone_number: '', default_voice: '' });
      await loadIntegrations();
    } catch (error) {
      setStatusError(String(error));
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    if (!confirm('Are you sure you want to disconnect this integration?')) {
      return;
    }

    try {
      await apiClient.disconnectIntegration(integrationId);
      setIntegrations(integrations.filter(i => i.id !== integrationId));
      setIntegrationStatus(prev => {
        const next = { ...prev };
        const integration = integrations.find(i => i.id === integrationId);
        if (integration) {
          delete next[getStatusKey(integration.provider)];
        }
        return next;
      });
      await loadIntegrations();
    } catch (error) {
      setStatusError(String(error));
    }
  };

  const handleTestIntegration = async (integrationId: string) => {
    setTestingIntegrationId(integrationId);

    try {
      const integration = integrations.find(i => i.id === integrationId);
      if (integration) {
        const provider = integration.provider;
        const res = await getIntegrationStatusEndpoint(provider);
        setIntegrationTestResults(prev => ({ ...prev, [integrationId]: { ...res.data, provider } }));
      } else {
        const res = await apiClient.testIntegration(integrationId);
        setIntegrationTestResults(prev => ({ ...prev, [integrationId]: res.data }));
      }
    } catch (error) {
      setIntegrationTestResults(prev => ({ ...prev, [integrationId]: { error: String(error) } }));
    } finally {
      setTestingIntegrationId(null);
    }
  };

  const handleAddWebhook = async () => {
    if (!webhookForm.url || !webhookForm.event_type) {
      alert('Please fill in all fields');
      return;
    }

    if (!webhookForm.integration_id) {
      alert('Please select an integration for this webhook.');
      return;
    }

    try {
      const res = await apiClient.createWebhook(webhookForm.integration_id, {
        event_type: webhookForm.event_type,
        url: webhookForm.url,
        is_active: true
      });

      setWebhooks(prev => [...prev, res.data]);
      setWebhookForm({ integration_id: '', event_type: 'sms_received', url: '' });
      setShowWebhookModal(false);
    } catch (error) {
      setStatusError(String(error));
    }
  };

  const handleDeleteWebhook = async (webhookId: string) => {
    if (!confirm('Delete this webhook?')) {
      return;
    }

    try {
      await apiClient.deleteWebhook(webhookId);
      setWebhooks(prev => prev.filter(w => w.id !== webhookId));
    } catch (error) {
      setStatusError(String(error));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const connectedProviders = integrations.map(i => i.provider);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Integration Hub</h1>
            <p className="text-slate-600 mt-1 max-w-2xl">Connect external services, automate workflows, and protect your integration pipeline with secure configuration controls.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm w-full max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Overall progress</p>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-slate-900 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-3 text-sm text-slate-600">{completedTaskCount} / {progressTasks.length} tasks complete ({progressPercent}%)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {progressTasks.map(task => (
            <div key={task.id} className={`rounded-3xl border px-5 py-4 text-sm shadow-sm ${task.done ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-900'}`}>
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{task.label}</p>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${task.done ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                  {task.done ? 'Done' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Setup checklist</h2>
          <div className="space-y-2">
            {progressTasks.map(task => (
              <div key={`todo-${task.id}`} className="flex items-start gap-3">
                <div className={`mt-1 h-4 w-4 rounded-full ${task.done ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <div>
                  <p className={`text-sm font-medium ${task.done ? 'text-slate-900' : 'text-slate-600'}`}>{task.label}</p>
                  <p className="text-xs text-slate-500">{task.done ? 'Completed' : 'Ready to complete this next.'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {statusError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p className="font-semibold">Integration Status Error</p>
          <p>{statusError}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Active Integrations</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={loadIntegrations}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            disabled={loadingIntegrations}
          >
            {loadingIntegrations ? 'Refreshing...' : 'Refresh status'}
          </button>
          <button
            onClick={handleRunHealthCheck}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            disabled={runningHealthCheck}
          >
            {runningHealthCheck ? 'Running health check...' : 'Run health check'}
          </button>
        </div>
      </div>

      {healthCheckResult && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Integration Health Check</h3>
              <p className="text-sm text-slate-600">Latest check at {new Date(healthCheckResult.timestamp).toLocaleString()}</p>
            </div>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${healthCheckResult.status === 'all_systems_checked' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {healthCheckResult.status.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(healthCheckResult.tests || {}).map(([key, test]: [string, any]) => (
              <div key={key} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{test.service || key}</p>
                    <p className="text-xs text-slate-500">{test.endpoint}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${test.configured ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {test.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-slate-500">
            <p>Use this summary to verify whether service credentials are configured and endpoints are reachable.</p>
          </div>
        </div>
      )}

      {healthCheckError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          <p className="font-semibold">Health Check Error</p>
          <p>{healthCheckError}</p>
        </div>
      )}

      {/* Connected Integrations */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Active Integrations</h2>
        {integrations.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
            <AlertCircle size={40} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">No integrations connected yet</p>
            <p className="text-gray-500 text-sm">Connect your first integration to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {integrations.map(integration => (
              <div key={integration.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="font-semibold text-slate-900">{integration.name}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(getConfiguredStatus(integration.provider))}`}>
                        {getConfiguredStatus(integration.provider) === 'connected' ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{integration.description}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Connected</p>
                        <p className="font-medium">{integration.connected_at}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Used</p>
                        <p className="font-medium">{integration.last_used || 'Never'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Provider</p>
                        <p className="font-medium capitalize">{integration.provider}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 ml-4">
                    <button
                      onClick={() => handleTestIntegration(integration.id)}
                      className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                      title="Test Integration"
                      disabled={testingIntegrationId === integration.id}
                    >
                      {testingIntegrationId === integration.id ? 'Testing…' : 'Test'}
                    </button>
                    <button
                      onClick={() => {
                        setFormError(null);
                        setSelectedIntegration(AVAILABLE_INTEGRATIONS.find(i => i.provider === integration.provider) || null);
                        setShowConfigModal(true);
                      }}
                      className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-blue-700 transition hover:bg-blue-100"
                      title="Configure"
                      aria-label={`Configure ${integration.name}`}
                    >
                      <Settings size={18} />
                    </button>
                    <button
                      onClick={() => handleDisconnect(integration.id)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-700 transition hover:bg-red-100"
                      title="Disconnect"
                      aria-label={`Disconnect ${integration.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                {integrationTestResults[integration.id] && (
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900 mb-2">Test Result</p>
                    <pre className="whitespace-pre-wrap break-words">{JSON.stringify(integrationTestResults[integration.id], null, 2)}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Integrations */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Available Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableIntegrations.filter(i => !connectedProviders.includes(i.provider)).map(integration => (
            <div key={integration.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <h3 className="font-semibold text-gray-900 mb-2">{integration.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{integration.description}</p>
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Features:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {integration.features.map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFormError(null);
                    setSelectedIntegration(integration);
                    setShowConfigModal(true);
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
                >
                  Connect
                </button>
                <a
                  href={integration.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 text-sm font-medium text-center"
                >
                  Docs
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhooks */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Webhooks</h2>
          <button
            onClick={() => setShowWebhookModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            <Plus size={16} />
            Add Webhook
          </button>
        </div>
        {webhooks.length === 0 ? (
          <p className="text-gray-600 text-sm">No webhooks configured</p>
        ) : (
          <div className="space-y-3">
            {webhooks.map(webhook => (
              <div key={webhook.id} className="flex flex-col gap-3 p-4 border border-gray-200 rounded">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{webhook.event_type}</p>
                    <p className="text-sm text-gray-600 font-mono">{webhook.url}</p>
                    <p className="text-xs text-slate-500 mt-1">Integration: {integrations.find(i => i.id === webhook.integration_id)?.name || webhook.integration_id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${webhook.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {webhook.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => handleDeleteWebhook(webhook.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Integration Config Modal */}
      {showConfigModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Connect {selectedIntegration.name}</h2>
            <div className="space-y-4 mb-6">
              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {formError}
                </div>
              )}
              {selectedIntegration.requires_api_key ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                    <input
                      type="password"
                      value={apiKeyForm.api_key}
                      onChange={e => setApiKeyForm({ ...apiKeyForm, api_key: e.target.value })}
                      placeholder="Enter API key"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Secret {selectedIntegration.provider === 'elevenlabs' ? '(Optional)' : ''}</label>
                    <input
                      type="password"
                      value={apiKeyForm.api_secret}
                      onChange={e => setApiKeyForm({ ...apiKeyForm, api_secret: e.target.value })}
                      placeholder="Enter API secret if required"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  No API credentials are required to connect LangGraph.
                </div>
              )}
              {selectedIntegration.provider === 'twilio' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twilio Phone Number</label>
                  <input
                    type="tel"
                    value={apiKeyForm.phone_number}
                    onChange={e => setApiKeyForm({ ...apiKeyForm, phone_number: e.target.value })}
                    placeholder="+1234567890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              )}
              {selectedIntegration.provider === 'elevenlabs' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Voice ID</label>
                  <input
                    type="text"
                    value={apiKeyForm.default_voice}
                    onChange={e => setApiKeyForm({ ...apiKeyForm, default_voice: e.target.value })}
                    placeholder="21m00Tcm4TlvDq8ikWAM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              )}
              <p className="text-xs text-gray-600 mb-1">
                Find your credentials in {selectedIntegration.name} dashboard → API Keys
              </p>
              {selectedIntegration.required_fields && selectedIntegration.required_fields.length > 0 && (
                <p className="text-xs text-amber-700">
                  Required: {selectedIntegration.required_fields.join(', ')}
                </p>
              )}
              {selectedIntegration.optional_fields && selectedIntegration.optional_fields.length > 0 && (
                <p className="text-xs text-slate-500">
                  Optional: {selectedIntegration.optional_fields.join(', ')}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfigModal(false);
                  setSelectedIntegration(null);
                  setApiKeyForm({ api_key: '', api_secret: '', phone_number: '', default_voice: '' });
                }}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConnectIntegration}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webhook Modal */}
      {showWebhookModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Add Webhook</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Associated Integration</label>
                <select
                  value={webhookForm.integration_id}
                  onChange={e => setWebhookForm({ ...webhookForm, integration_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select integration</option>
                  {integrations.map(integration => (
                    <option key={integration.id} value={integration.id}>
                      {integration.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <select
                  value={webhookForm.event_type}
                  onChange={e => setWebhookForm({ ...webhookForm, event_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="sms_received">SMS Received</option>
                  <option value="lead_created">Lead Created</option>
                  <option value="property_updated">Property Updated</option>
                  <option value="call_completed">Call Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                <input
                  type="url"
                  value={webhookForm.url}
                  onChange={e => setWebhookForm({ ...webhookForm, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWebhookModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWebhook}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Webhook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
