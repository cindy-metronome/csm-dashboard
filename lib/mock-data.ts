// Mock data for Metronome API responses

export interface Customer {
  id: string
  name: string
  commitmentBurndown: number
  usageTrend: "up" | "down" | "stable"
  upcomingInvoice: number
  creditBalance: number
  status: "healthy" | "at-risk" | "critical"
  lastActivity: string
}

export interface UsageMetric {
  date: string
  value: number
}

export interface Invoice {
  id: string
  date: string
  amount: number
  status: "paid" | "pending" | "overdue"
}

export interface GrowthOpportunity {
  customerId: string
  customerName: string
  type: "commitment-threshold" | "overage" | "credit-purchase" | "renewal"
  priority: "high" | "medium" | "low"
  value: number
  description: string
  daysUntilAction?: number
}

export interface ThresholdNotification {
  id: string
  customerId: string
  customerName: string
  alertType: "usage_threshold" | "commitment_threshold" | "credit_balance" | "invoice_threshold"
  threshold: number
  currentValue: number
  percentageOfThreshold: number
  severity: "critical" | "warning" | "info"
  message: string
  triggeredAt: string
  metricName: string
}

export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Acme Corporation",
    commitmentBurndown: 45,
    usageTrend: "down",
    upcomingInvoice: 125000,
    creditBalance: 275000,
    status: "critical",
    lastActivity: "2 days ago",
  },
  {
    id: "2",
    name: "TechStart Inc",
    commitmentBurndown: 92,
    usageTrend: "up",
    upcomingInvoice: 89000,
    creditBalance: 8000,
    status: "healthy",
    lastActivity: "1 hour ago",
  },
  {
    id: "3",
    name: "Global Systems",
    commitmentBurndown: 78,
    usageTrend: "stable",
    upcomingInvoice: 156000,
    creditBalance: 44000,
    status: "healthy",
    lastActivity: "5 hours ago",
  },
  {
    id: "4",
    name: "DataFlow Solutions",
    commitmentBurndown: 58,
    usageTrend: "down",
    upcomingInvoice: 67000,
    creditBalance: 84000,
    status: "at-risk",
    lastActivity: "1 day ago",
  },
  {
    id: "5",
    name: "CloudNine Enterprises",
    commitmentBurndown: 95,
    usageTrend: "up",
    upcomingInvoice: 198000,
    creditBalance: 10000,
    status: "healthy",
    lastActivity: "3 hours ago",
  },
  {
    id: "6",
    name: "Innovate Labs",
    commitmentBurndown: 34,
    usageTrend: "down",
    upcomingInvoice: 45000,
    creditBalance: 132000,
    status: "critical",
    lastActivity: "4 days ago",
  },
]

export const mockUsageData: UsageMetric[] = [
  { date: "2025-01-01", value: 45000 },
  { date: "2025-01-08", value: 52000 },
  { date: "2025-01-15", value: 48000 },
  { date: "2025-01-22", value: 61000 },
  { date: "2025-01-29", value: 58000 },
  { date: "2025-02-05", value: 67000 },
  { date: "2025-02-12", value: 72000 },
  { date: "2025-02-19", value: 69000 },
  { date: "2025-02-26", value: 75000 },
  { date: "2025-03-05", value: 81000 },
]

export const mockInvoices: Invoice[] = [
  { id: "INV-001", date: "2025-03-01", amount: 125000, status: "pending" },
  { id: "INV-002", date: "2025-02-01", amount: 118000, status: "paid" },
  { id: "INV-003", date: "2025-01-01", amount: 112000, status: "paid" },
  { id: "INV-004", date: "2024-12-01", amount: 105000, status: "paid" },
  { id: "INV-005", date: "2024-11-01", amount: 98000, status: "paid" },
]

export const mockCommitmentData = [
  { month: "Oct", committed: 500000, used: 420000 },
  { month: "Nov", committed: 500000, used: 445000 },
  { month: "Dec", committed: 500000, used: 468000 },
  { month: "Jan", committed: 500000, used: 490000 },
  { month: "Feb", committed: 500000, used: 475000 },
  { month: "Mar", committed: 500000, used: 225000 },
]

export const mockGrowthOpportunities: GrowthOpportunity[] = [
  {
    customerId: "2",
    customerName: "TechStart Inc",
    type: "commitment-threshold",
    priority: "high",
    value: 50000,
    description: "92% of commitment used - upsell opportunity",
    daysUntilAction: 15,
  },
  {
    customerId: "5",
    customerName: "CloudNine Enterprises",
    type: "overage",
    priority: "high",
    value: 85000,
    description: "Consistent overages for 3 months",
  },
  {
    customerId: "3",
    customerName: "Global Systems",
    type: "renewal",
    priority: "medium",
    value: 500000,
    description: "Contract renewal in 45 days",
    daysUntilAction: 45,
  },
  {
    customerId: "2",
    customerName: "TechStart Inc",
    type: "credit-purchase",
    priority: "medium",
    value: 25000,
    description: "3 credit purchases in last quarter",
  },
  {
    customerId: "4",
    customerName: "DataFlow Solutions",
    type: "renewal",
    priority: "high",
    value: 350000,
    description: "Contract renewal in 30 days",
    daysUntilAction: 30,
  },
]

export const mockOverageLeaderboard = [
  { customerId: "5", customerName: "CloudNine Enterprises", totalOverage: 85000, months: 3 },
  { customerId: "3", customerName: "Global Systems", totalOverage: 62000, months: 2 },
  { customerId: "2", customerName: "TechStart Inc", totalOverage: 45000, months: 4 },
  { customerId: "1", customerName: "Acme Corporation", totalOverage: 38000, months: 2 },
  { customerId: "4", customerName: "DataFlow Solutions", totalOverage: 28000, months: 3 },
]

export const mockCreditPurchases = [
  {
    customerId: "2",
    customerName: "TechStart Inc",
    purchases: 3,
    totalValue: 75000,
    lastPurchase: "2025-02-15",
  },
  {
    customerId: "5",
    customerName: "CloudNine Enterprises",
    purchases: 2,
    totalValue: 100000,
    lastPurchase: "2025-01-28",
  },
  {
    customerId: "3",
    customerName: "Global Systems",
    purchases: 1,
    totalValue: 50000,
    lastPurchase: "2025-01-10",
  },
]

export const mockThresholdNotifications: ThresholdNotification[] = [
  {
    id: "alert-001",
    customerId: "2",
    customerName: "TechStart Inc",
    alertType: "commitment_threshold",
    threshold: 90,
    currentValue: 92,
    percentageOfThreshold: 102,
    severity: "critical",
    message: "Customer has exceeded 90% commitment threshold",
    triggeredAt: "2025-03-07T14:30:00Z",
    metricName: "API Calls",
  },
  {
    id: "alert-002",
    customerId: "5",
    customerName: "CloudNine Enterprises",
    alertType: "usage_threshold",
    threshold: 100000,
    currentValue: 125000,
    percentageOfThreshold: 125,
    severity: "critical",
    message: "Usage has exceeded threshold by 25%",
    triggeredAt: "2025-03-07T10:15:00Z",
    metricName: "Compute Hours",
  },
  {
    id: "alert-003",
    customerId: "1",
    customerName: "Acme Corporation",
    alertType: "credit_balance",
    threshold: 300000,
    currentValue: 275000,
    percentageOfThreshold: 92,
    severity: "warning",
    message: "Credit balance falling below threshold",
    triggeredAt: "2025-03-06T16:45:00Z",
    metricName: "Credit Balance",
  },
  {
    id: "alert-004",
    customerId: "4",
    customerName: "DataFlow Solutions",
    alertType: "commitment_threshold",
    threshold: 70,
    currentValue: 58,
    percentageOfThreshold: 83,
    severity: "warning",
    message: "Commitment burndown below expected rate",
    triggeredAt: "2025-03-06T09:20:00Z",
    metricName: "Storage GB",
  },
  {
    id: "alert-005",
    customerId: "3",
    customerName: "Global Systems",
    alertType: "invoice_threshold",
    threshold: 150000,
    currentValue: 156000,
    percentageOfThreshold: 104,
    severity: "info",
    message: "Upcoming invoice exceeds typical amount",
    triggeredAt: "2025-03-05T11:00:00Z",
    metricName: "Monthly Invoice",
  },
]
