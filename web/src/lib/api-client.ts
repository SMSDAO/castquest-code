const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  // Code Analysis
  async analyzeCode(path: string) {
    return this.request('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ path }),
    })
  }

  // Code Generation
  async generateCode(type: string, spec: any) {
    return this.request('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ type, spec }),
    })
  }

  // Testing
  async runTests(path?: string) {
    return this.request('/api/test', {
      method: 'POST',
      body: JSON.stringify({ path }),
    })
  }

  // Orchestration
  async runOrchestrator(mode: string, target: string) {
    return this.request('/api/orchestrate', {
      method: 'POST',
      body: JSON.stringify({ mode, target }),
    })
  }

  async getOrchestratorStatus(id: string) {
    return this.request(`/api/orchestrate/${id}`)
  }

  // Deployment
  async deploy(platform: string, environment: string) {
    return this.request('/api/deploy', {
      method: 'POST',
      body: JSON.stringify({ platform, environment }),
    })
  }

  async getDeploymentStatus(id: string) {
    return this.request(`/api/deploy/${id}`)
  }

  // Components
  async syncComponents(components: string[], options: any) {
    return this.request('/api/components/sync', {
      method: 'POST',
      body: JSON.stringify({ components, options }),
    })
  }

  async configureComponents(components: string[], database: string) {
    return this.request('/api/components/config', {
      method: 'POST',
      body: JSON.stringify({ components, database }),
    })
  }

  // System Stats
  async getSystemStats() {
    return this.request('/api/stats')
  }

  async getRecentActivity() {
    return this.request('/api/activity')
  }
}

export const api = new ApiClient(API_URL)
