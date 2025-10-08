// Metronome API service functions
// Based on: https://docs.metronome.com/api-reference/alerts/get-all-threshold-notifications

export interface MetronomeAlert {
  id: string
  name: string
  uniqueness_key?: string
  type: string
  status: 'enabled' | 'disabled' | 'archived'
  credit_type?: {
    id: string
    name: string
  }
  threshold: number
  updated_at: string
}

export interface MetronomeCustomerAlert {
  customer_status: 'ok' | 'in_alarm' | 'evaluating' | null
  alert: MetronomeAlert
}

export interface MetronomeAlertsResponse {
  data: MetronomeCustomerAlert[]
  next_page: string | null
}

export interface MetronomeCustomer {
  id: string
  name: string
  external_id?: string
  created_at: string
  updated_at: string
}

export interface MetronomeCustomersResponse {
  data: MetronomeCustomer[]
  next_page: string | null
}

class MetronomeAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message)
    this.name = 'MetronomeAPIError'
  }
}

class MetronomeAPI {
  private baseURL: string
  private token: string

  constructor() {
    this.baseURL = process.env.METRONOME_API_BASE_URL || 'https://api.metronome.com/v1'
    this.token = process.env.METRONOME_API_TOKEN || ''
    
    if (!this.token) {
      console.warn('METRONOME_API_TOKEN not found in environment variables')
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.token) {
      throw new MetronomeAPIError('Metronome API token not configured')
    }

    const url = `${this.baseURL}${endpoint}`
    console.log(`Making request to: ${url}`)
    console.log(`Request body:`, options.body)
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    console.log(`Response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('API Error:', errorData)
      throw new MetronomeAPIError(
        `Metronome API error: ${response.status} ${response.statusText}`,
        response.status,
        errorData
      )
    }

    return response.json()
  }

  /**
   * Get all threshold notifications for a specific customer
   * @param customerId - The Metronome customer ID
   * @param alertStatuses - Optional filter by alert status
   * @param nextPage - Optional pagination cursor
   */
  async getCustomerAlerts(
    customerId: string,
    alertStatuses?: string[],
    nextPage?: string
  ): Promise<MetronomeAlertsResponse> {
    const body: any = { customer_id: customerId }
    
    if (alertStatuses && alertStatuses.length > 0) {
      body.alert_statuses = alertStatuses
    }

    if (nextPage) {
      body.next_page = nextPage
    }

    return this.makeRequest<MetronomeAlertsResponse>('/customer-alerts/list', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  /**
   * Get all customers (for populating customer list)
   * @param nextPage - Optional pagination cursor
   */
  async getCustomers(nextPage?: string): Promise<MetronomeCustomersResponse> {
    const body: any = {}
    
    if (nextPage) {
      body.next_page = nextPage
    }

    console.log('Fetching customers from Metronome API...')
    // Try different endpoint structures for sandbox environment
    try {
      // Try GET /customers first
      return await this.makeRequest<MetronomeCustomersResponse>('/customers', {
        method: 'GET',
      })
    } catch (error) {
      console.log('Failed with GET /customers, trying POST /customers...')
      try {
        return await this.makeRequest<MetronomeCustomersResponse>('/customers', {
          method: 'POST',
          body: JSON.stringify(body),
        })
      } catch (error2) {
        console.log('Failed with POST /customers, trying /customers/list...')
        return await this.makeRequest<MetronomeCustomersResponse>('/customers/list', {
          method: 'POST',
          body: JSON.stringify(body),
        })
      }
    }
  }

  /**
   * Get all threshold notifications across all customers
   * This calls the customer-alerts/list endpoint directly
   */
  async getAllAlerts(): Promise<MetronomeCustomerAlert[]> {
    try {
      console.log('Fetching all customer alerts from Metronome API...')
      
      // First, we need to get customers to get their IDs
      console.log('First fetching customers...')
      const customersResponse = await this.getCustomers()
      console.log('Customers response:', customersResponse)
      const customers = customersResponse.data

      if (customers.length === 0) {
        console.log('No customers found, returning empty alerts array')
        return []
      }

      // Get alerts for each customer
      const allAlerts: MetronomeCustomerAlert[] = []
      
      for (const customer of customers) {
        try {
          console.log(`Fetching alerts for customer: ${customer.id} (${customer.name})`)
          const alertsResponse = await this.getCustomerAlerts(customer.id)
          console.log(`Alerts for ${customer.name}:`, alertsResponse.data)
          allAlerts.push(...alertsResponse.data)
        } catch (error) {
          console.warn(`Failed to fetch alerts for customer ${customer.id}:`, error)
          // Continue with other customers even if one fails
        }
      }

      return allAlerts
    } catch (error) {
      console.error('Failed to fetch all alerts:', error)
      throw error
    }
  }
}

// Export a singleton instance
export const metronomeAPI = new MetronomeAPI()

// Helper function to transform Metronome data to our internal format
export function transformMetronomeAlert(
  customerAlert: MetronomeCustomerAlert,
  customerName?: string
): {
  id: string
  customerId: string
  customerName: string
  alertType: string
  threshold: number
  currentValue: number
  percentageOfThreshold: number
  severity: 'critical' | 'warning' | 'info'
  message: string
  triggeredAt: string
  metricName: string
} {
  const { customer_status, alert } = customerAlert
  
  // Determine severity based on customer status
  let severity: 'critical' | 'warning' | 'info' = 'info'
  if (customer_status === 'in_alarm') {
    severity = 'critical'
  } else if (customer_status === 'evaluating') {
    severity = 'warning'
  }

  // Generate a message based on alert type and status
  let message = ''
  if (customer_status === 'in_alarm') {
    message = `Alert triggered: ${alert.name}`
  } else if (customer_status === 'evaluating') {
    message = `Alert evaluating: ${alert.name}`
  } else {
    message = `Alert active: ${alert.name}`
  }

  // For now, we'll use placeholder values for current value and percentage
  // In a real implementation, you might need additional API calls to get current usage
  const currentValue = alert.threshold * 0.8 // Placeholder: 80% of threshold
  const percentageOfThreshold = Math.round((currentValue / alert.threshold) * 100)

  return {
    id: alert.id,
    customerId: 'unknown', // We'd need to map this from the customer data
    customerName: customerName || 'Unknown Customer',
    alertType: alert.type,
    threshold: alert.threshold,
    currentValue,
    percentageOfThreshold,
    severity,
    message,
    triggeredAt: alert.updated_at,
    metricName: alert.credit_type?.name || 'Unknown Metric',
  }
}
