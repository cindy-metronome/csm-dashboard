"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock, AlertTriangle, AlertCircle, Info, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
// Removed direct Metronome API import - now using API route

interface AlertData {
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
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/alerts')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch alerts')
      }
      
      setAlerts(result.data)
      
      // Log the data source for debugging
      console.log(`Alerts loaded from: ${result.source}`)
    } catch (err) {
      console.error('Failed to fetch alerts:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts')
      
      // Fallback to mock data on error
      const { mockThresholdNotifications } = await import("@/lib/mock-data")
      setAlerts(mockThresholdNotifications)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 }
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity]
    }
    return new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime()
  })

  const criticalCount = sortedAlerts.filter((a) => a.severity === "critical").length
  const warningCount = sortedAlerts.filter((a) => a.severity === "warning").length
  const infoCount = sortedAlerts.filter((a) => a.severity === "info").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Usage Alerts</h1>
          <p className="text-muted-foreground mt-2">
            Threshold notifications from Metronome monitoring customer usage patterns
          </p>
        </div>
        <button
          onClick={fetchAlerts}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-accent hover:bg-accent/80 rounded-md transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive font-medium">Error loading alerts</span>
          </div>
          <p className="text-sm text-destructive/80 mt-1">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">{sortedAlerts.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Total Alerts</p>
              </div>
              <Bell className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Critical</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-warning">{warningCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Warning</p>
              </div>
              <AlertCircle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-primary">{infoCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Info</p>
              </div>
              <Info className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-16 bg-muted rounded"></div>
                        <div className="h-5 w-24 bg-muted rounded"></div>
                        <div className="h-5 w-32 bg-muted rounded"></div>
                      </div>
                      <div className="h-4 w-3/4 bg-muted rounded"></div>
                      <div className="flex items-center gap-4">
                        <div className="h-3 w-20 bg-muted rounded"></div>
                        <div className="h-3 w-16 bg-muted rounded"></div>
                        <div className="h-3 w-24 bg-muted rounded"></div>
                        <div className="h-3 w-12 bg-muted rounded"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-8 w-12 bg-muted rounded"></div>
                      <div className="h-3 w-16 bg-muted rounded mt-1"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedAlerts.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No alerts found</h3>
              <p className="text-muted-foreground">
                {error ? 'Unable to load alerts. Using mock data for demonstration.' : 'No threshold notifications are currently active.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))
        )}
      </div>
    </div>
  )
}

function AlertCard({ alert }: { alert: AlertData }) {
  const getSeverityColor = () => {
    switch (alert.severity) {
      case "critical":
        return "destructive"
      case "warning":
        return "warning"
      default:
        return "secondary"
    }
  }

  const getSeverityBg = () => {
    switch (alert.severity) {
      case "critical":
        return "bg-destructive/5 border-destructive/50"
      case "warning":
        return "bg-warning/5 border-warning/50"
      default:
        return "bg-muted/50 border-border"
    }
  }

  const getAlertTypeLabel = () => {
    switch (alert.alertType) {
      case "usage_threshold":
        return "Usage Threshold"
      case "commitment_threshold":
        return "Commitment Threshold"
      case "credit_balance":
        return "Credit Balance"
      case "invoice_threshold":
        return "Invoice Threshold"
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <Link href={`/dashboard/customer-360?id=${alert.customerId}`}>
      <Card className={`transition-colors hover:bg-accent/50 cursor-pointer ${getSeverityBg()}`}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={getSeverityColor() as any} className="uppercase text-xs">
                  {alert.severity}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getAlertTypeLabel()}
                </Badge>
                <span className="text-sm font-semibold text-foreground">{alert.customerName}</span>
              </div>
              <p className="text-sm text-foreground">{alert.message}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Metric:</span>
                  <span>{alert.metricName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Current:</span>
                  <span>{alert.currentValue.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Threshold:</span>
                  <span>{alert.threshold.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(alert.triggeredAt)}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{alert.percentageOfThreshold}%</div>
              <div className="text-xs text-muted-foreground">of threshold</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
