import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  mockGrowthOpportunities,
  mockOverageLeaderboard,
  mockCreditPurchases,
  type GrowthOpportunity,
} from "@/lib/mock-data"
import { TrendingUp, AlertCircle, DollarSign, Calendar, CreditCard, Zap } from "lucide-react"
import Link from "next/link"

export default function GrowthPage() {
  const highPriorityOpportunities = mockGrowthOpportunities.filter((o) => o.priority === "high")
  const totalPotentialRevenue = mockGrowthOpportunities.reduce((sum, o) => sum + o.value, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Finding Growth</h1>
        <p className="text-muted-foreground mt-2">Identify upsell and cross-sell opportunities across your book</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-chart-1/50 bg-chart-1/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{mockGrowthOpportunities.length}</div>
            <p className="text-xs text-muted-foreground mt-2">{highPriorityOpportunities.length} high priority</p>
          </CardContent>
        </Card>

        <Card className="border-chart-2/50 bg-chart-2/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Potential Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">${(totalPotentialRevenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground mt-2">Across all opportunities</p>
          </CardContent>
        </Card>

        <Card className="border-chart-3/50 bg-chart-3/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Urgent Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {mockGrowthOpportunities.filter((o) => o.daysUntilAction && o.daysUntilAction <= 30).length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Within next 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* High Priority Opportunities */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <h2 className="text-xl font-semibold text-foreground">High Priority Opportunities</h2>
        </div>
        <div className="grid gap-4">
          {highPriorityOpportunities.map((opportunity, index) => (
            <OpportunityCard key={index} opportunity={opportunity} />
          ))}
        </div>
      </div>

      {/* Medium Priority Opportunities */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Medium Priority Opportunities</h2>
        <div className="grid gap-4">
          {mockGrowthOpportunities
            .filter((o) => o.priority === "medium")
            .map((opportunity, index) => (
              <OpportunityCard key={index} opportunity={opportunity} />
            ))}
        </div>
      </div>

      {/* Overage Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Top Overage Customers
          </CardTitle>
          <CardDescription>Customers consistently incurring the highest overage charges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockOverageLeaderboard.map((customer, index) => (
              <Link key={customer.customerId} href={`/dashboard/customer-360?id=${customer.customerId}`}>
                <div className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0 hover:bg-accent/50 rounded-md p-2 -m-2 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{customer.customerName}</div>
                      <div className="text-xs text-muted-foreground">{customer.months} months of overages</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">
                      ${(customer.totalOverage / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-muted-foreground">Total overage</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Credit Purchase History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Recent Credit Purchases
          </CardTitle>
          <CardDescription>Customers who have made one-off credit purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockCreditPurchases.map((customer) => (
              <Link key={customer.customerId} href={`/dashboard/customer-360?id=${customer.customerId}`}>
                <div className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0 hover:bg-accent/50 rounded-md p-2 -m-2 transition-colors cursor-pointer">
                  <div>
                    <div className="font-medium text-foreground">{customer.customerName}</div>
                    <div className="text-xs text-muted-foreground">
                      {customer.purchases} {customer.purchases === 1 ? "purchase" : "purchases"} • Last:{" "}
                      {new Date(customer.lastPurchase).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">${(customer.totalValue / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-muted-foreground">Total value</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function OpportunityCard({ opportunity }: { opportunity: GrowthOpportunity }) {
  const getTypeIcon = () => {
    switch (opportunity.type) {
      case "commitment-threshold":
        return <AlertCircle className="h-5 w-5" />
      case "overage":
        return <Zap className="h-5 w-5" />
      case "credit-purchase":
        return <CreditCard className="h-5 w-5" />
      case "renewal":
        return <Calendar className="h-5 w-5" />
    }
  }

  const getTypeLabel = () => {
    switch (opportunity.type) {
      case "commitment-threshold":
        return "Commitment Alert"
      case "overage":
        return "Overage Pattern"
      case "credit-purchase":
        return "Credit Purchase"
      case "renewal":
        return "Upcoming Renewal"
    }
  }

  const getPriorityColor = () => {
    switch (opportunity.priority) {
      case "high":
        return "destructive"
      case "medium":
        return "warning"
      default:
        return "secondary"
    }
  }

  return (
    <Link href={`/dashboard/customer-360?id=${opportunity.customerId}`}>
      <Card className="transition-colors hover:bg-accent/50 cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{opportunity.customerName}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                {getTypeIcon()}
                {getTypeLabel()}
              </CardDescription>
            </div>
            <Badge variant={getPriorityColor() as any}>{opportunity.priority} priority</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-foreground">{opportunity.description}</p>
              {opportunity.daysUntilAction && (
                <p className="text-xs text-muted-foreground">Action needed in {opportunity.daysUntilAction} days</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">${(opportunity.value / 1000).toFixed(0)}K</div>
              <div className="text-xs text-muted-foreground">Potential value</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
