import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockCustomers } from "@/lib/mock-data"
import { AlertTriangle, TrendingDown, TrendingUp, Minus } from "lucide-react"
import Link from "next/link"

export default function BookOfBusinessPage() {
  const criticalAccounts = mockCustomers.filter((c) => c.status === "critical")
  const atRiskAccounts = mockCustomers.filter((c) => c.status === "at-risk")
  const healthyAccounts = mockCustomers.filter((c) => c.status === "healthy")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Book of Business</h1>
        <p className="text-muted-foreground mt-2">Daily command center for prioritized account management</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-destructive">{criticalAccounts.length}</div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Accounts need immediate action</p>
          </CardContent>
        </Card>

        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">At Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-warning">{atRiskAccounts.length}</div>
              <TrendingDown className="h-8 w-8 text-warning" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Monitor closely for changes</p>
          </CardContent>
        </Card>

        <Card className="border-success/50 bg-success/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Healthy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-success">{healthyAccounts.length}</div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">On track with commitments</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Accounts */}
      {criticalAccounts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h2 className="text-xl font-semibold text-foreground">Critical Accounts</h2>
          </div>
          <div className="grid gap-4">
            {criticalAccounts.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        </div>
      )}

      {/* At Risk Accounts */}
      {atRiskAccounts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">At Risk Accounts</h2>
          <div className="grid gap-4">
            {atRiskAccounts.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        </div>
      )}

      {/* Healthy Accounts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Healthy Accounts</h2>
        <div className="grid gap-4">
          {healthyAccounts.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      </div>
    </div>
  )
}

function CustomerCard({ customer }: { customer: (typeof mockCustomers)[0] }) {
  const getTrendIcon = () => {
    switch (customer.usageTrend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-success" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = () => {
    switch (customer.status) {
      case "critical":
        return "destructive"
      case "at-risk":
        return "warning"
      default:
        return "success"
    }
  }

  const getBurndownColor = () => {
    if (customer.commitmentBurndown >= 80) return "text-success"
    if (customer.commitmentBurndown >= 50) return "text-warning"
    return "text-destructive"
  }

  return (
    <Link href={`/dashboard/customer-360?id=${customer.id}`}>
      <Card className="transition-colors hover:bg-accent/50 cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{customer.name}</CardTitle>
              <CardDescription>Last activity: {customer.lastActivity}</CardDescription>
            </div>
            <Badge variant={getStatusColor() as any}>{customer.status.replace("-", " ")}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Commitment Burndown</div>
              <div className={`text-2xl font-bold ${getBurndownColor()}`}>{customer.commitmentBurndown}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Usage Trend</div>
              <div className="flex items-center gap-2">
                {getTrendIcon()}
                <span className="text-sm font-medium capitalize">{customer.usageTrend}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Upcoming Invoice</div>
              <div className="text-lg font-semibold">${(customer.upcomingInvoice / 1000).toFixed(0)}K</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Credit Balance</div>
              <div className="text-lg font-semibold">${(customer.creditBalance / 1000).toFixed(0)}K</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
