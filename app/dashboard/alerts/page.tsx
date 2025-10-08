"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Clock, AlertTriangle, AlertCircle, Info, RefreshCw, User, X, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react"
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
  const [selectedCustomer, setSelectedCustomer] = useState<AlertData | null>(null)

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
            <AlertCard 
              key={alert.id} 
              alert={alert} 
              onClick={() => setSelectedCustomer(alert)}
            />
          ))
        )}
      </div>

      {/* Customer 360 Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="text-2xl">{selectedCustomer.customerName}</CardTitle>
                  <p className="text-muted-foreground">Customer ID: {selectedCustomer.customerId}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCustomer(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Alert Summary */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Current Alert</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={selectedCustomer.severity === 'critical' ? 'destructive' : selectedCustomer.severity === 'warning' ? 'default' : 'secondary'}>
                          {selectedCustomer.severity}
                        </Badge>
                        <span className="text-sm font-medium">{selectedCustomer.alertType.replace(/_/g, ' ')}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedCustomer.message}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(selectedCustomer.triggeredAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Threshold Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Value:</span>
                        <span className="font-medium">{selectedCustomer.currentValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Threshold:</span>
                        <span className="font-medium">{selectedCustomer.threshold.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Percentage:</span>
                        <span className={`font-medium ${selectedCustomer.percentageOfThreshold > 100 ? 'text-destructive' : 'text-success'}`}>
                          {selectedCustomer.threshold}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Customer Metrics */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Customer Metrics</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Metric Type</p>
                          <p className="text-2xl font-bold">{selectedCustomer.metricName}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Alert Status</p>
                          <p className="text-2xl font-bold capitalize">{selectedCustomer.severity}</p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                          <p className="text-2xl font-bold">{new Date(selectedCustomer.triggeredAt).toLocaleDateString()}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1">
                  <User className="h-4 w-4 mr-2" />
                  View Full Profile
                </Button>
                <Button variant="outline" className="flex-1">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Usage Trends
                </Button>
                <Button variant="outline" className="flex-1">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Billing Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function AlertCard({ alert, onClick }: { alert: AlertData; onClick: () => void }) {
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
    <Card 
      className={`transition-colors hover:bg-accent/50 cursor-pointer ${getSeverityBg()}`}
      onClick={onClick}
    >
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
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(alert.triggeredAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Metric:</span>
                  <span>{alert.metricName}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{alert.threshold}%</div>
              <div className="text-xs text-muted-foreground">remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>
  )
}
