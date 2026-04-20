/**
 * API Client Setup
 */
import axios, { AxiosInstance } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Handle responses
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Redirect to login
          window.location.href = '/auth/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.client.post('/api/auth/login', { email, password })
  }

  async register(email: string, password: string, name: string) {
    return this.client.post('/api/auth/register', { email, password, name })
  }

  async refreshToken() {
    return this.client.post('/api/auth/refresh')
  }

  async getCurrentUser() {
    return this.client.get('/api/auth/me')
  }

  // Properties endpoints
  async getProperties(page = 1, limit = 10) {
    return this.client.get('/api/properties', { params: { page, limit } })
  }

  async getProperty(id: string) {
    return this.client.get(`/api/properties/${id}`)
  }

  async createProperty(data: any) {
    return this.client.post('/api/properties', data)
  }

  async updateProperty(id: string, data: any) {
    return this.client.put(`/api/properties/${id}`, data)
  }

  // Leads endpoints
  async getLeads(page = 1, limit = 10) {
    return this.client.get('/api/leads', { params: { page, limit } })
  }

  async getLead(id: string) {
    return this.client.get(`/api/leads/${id}`)
  }

  async updateLead(id: string, data: any) {
    return this.client.put(`/api/leads/${id}`, data)
  }

  // Agents endpoints
  async getAgents(skip = 0, limit = 10) {
    return this.client.get('/api/agents', { params: { skip, limit } })
  }

  async getAgent(id: string) {
    return this.client.get(`/api/agents/${id}`)
  }

  async createAgent(data: any) {
    return this.client.post('/api/agents', data)
  }

  async updateAgent(id: string, data: any) {
    return this.client.put(`/api/agents/${id}`, data)
  }

  async toggleAgentStatus(id: string, status: string) {
    return this.client.post(`/api/agents/${id}/toggle-status`, { status })
  }

  async getAgentMetrics(id: string) {
    return this.client.get(`/api/agents/${id}/metrics`)
  }

  async testAgent(id: string, message: string) {
    return this.client.post(`/api/agents/${id}/test`, { message })
  }

  // Users endpoints
  async getUsers(skip = 0, limit = 10) {
    return this.client.get('/api/users', { params: { skip, limit } })
  }

  async getUser(id: string) {
    return this.client.get(`/api/users/${id}`)
  }

  async createUser(data: any) {
    return this.client.post('/api/users', data)
  }

  async updateUser(id: string, data: any) {
    return this.client.put(`/api/users/${id}`, data)
  }

  async deactivateUser(id: string) {
    return this.client.post(`/api/users/${id}/deactivate`)
  }

  async activateUser(id: string) {
    return this.client.post(`/api/users/${id}/activate`)
  }

  async getUserPermissions(id: string) {
    return this.client.get(`/api/users/${id}/permissions`)
  }

  async getRolePermissions(role: string) {
    return this.client.get(`/api/users/role/${role}`)
  }

  async changeUserRole(id: string, newRole: string) {
    return this.client.post(`/api/users/${id}/change-role`, { new_role: newRole })
  }

  async getUserStatistics() {
    return this.client.get('/api/users/statistics/summary')
  }

  // Reports endpoints
  async getReports(skip = 0, limit = 10) {
    return this.client.get('/api/reports', { params: { skip, limit } })
  }

  async getReport(id: string) {
    return this.client.get(`/api/reports/${id}`)
  }

  async createReport(data: any) {
    return this.client.post('/api/reports', data)
  }

  async updateReport(id: string, data: any) {
    return this.client.put(`/api/reports/${id}`, data)
  }

  async deleteReport(id: string) {
    return this.client.delete(`/api/reports/${id}`)
  }

  async generateReport(id: string) {
    return this.client.post(`/api/reports/${id}/generate`)
  }

  async exportReport(id: string, format: string = "pdf") {
    return this.client.post(`/api/reports/${id}/export`, { format })
  }

  // Integrations endpoints
  async getIntegrations(skip = 0, limit = 10) {
    return this.client.get('/api/integrations', { params: { skip, limit } })
  }

  async getAvailableIntegrations() {
    return this.client.get('/api/integrations/available')
  }

  async getIntegrationOrchestrationStatus() {
    return this.client.get('/api/integrations-orchestration/status')
  }

  async getTwilioStatus() {
    return this.client.get('/api/integrations-orchestration/twilio/status')
  }

  async getElevenLabsStatus() {
    return this.client.get('/api/integrations-orchestration/elevenlabs/status')
  }

  async getCalcomStatus() {
    return this.client.get('/api/integrations-orchestration/calcom/status')
  }

  async getLangGraphStatus() {
    return this.client.get('/api/integrations-orchestration/langgraph/status')
  }

  async executePropertyAgent(data: any) {
    return this.client.post('/api/integrations-orchestration/langgraph/execute-property-agent', data)
  }

  async executeQualification(data: any) {
    return this.client.post('/api/integrations-orchestration/langgraph/execute-qualification', data)
  }

  async sendTwilioMessage(data: any) {
    return this.client.post('/api/integrations-orchestration/twilio/send-message', data)
  }

  async generateSpeech(data: any) {
    return this.client.post('/api/integrations-orchestration/elevenlabs/generate-speech', data)
  }

  async createCalcomBooking(data: any) {
    return this.client.post('/api/integrations-orchestration/calcom/create-booking', data)
  }

  async testAllIntegrations() {
    return this.client.post('/api/integrations-orchestration/test-all')
  }

  async getIntegration(id: string) {
    return this.client.get(`/api/integrations/${id}`)
  }

  async connectIntegration(provider: string, config: any) {
    return this.client.post('/api/integrations', { provider, ...config })
  }

  async disconnectIntegration(id: string) {
    return this.client.delete(`/api/integrations/${id}`)
  }

  async testIntegration(id: string) {
    return this.client.post(`/api/integrations/${id}/test`)
  }

  async syncIntegration(id: string) {
    return this.client.post(`/api/integrations/${id}/sync`)
  }

  // Webhooks endpoints
  async getWebhooks(integrationId?: string) {
    return this.client.get('/api/integrations/webhooks', { params: { integration_id: integrationId } })
  }

  async createWebhook(integrationId: string, webhookData: any) {
    return this.client.post(`/api/integrations/webhooks`, { integration_id: integrationId, ...webhookData })
  }

  async deleteWebhook(webhookId: string) {
    return this.client.delete(`/api/integrations/webhooks/${webhookId}`)
  }

  async testWebhook(webhookId: string) {
    return this.client.post(`/api/integrations/webhooks/${webhookId}/test`)
  }

  // Analytics endpoints
  async getDashboardMetrics() {
    return this.client.get('/api/analytics/dashboard')
  }

  async getLeadAnalytics() {
    return this.client.get('/api/analytics/leads')
  }
}

export const apiClient = new ApiClient()
