"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockCustomers, mockUsageData, mockInvoices, mockCommitmentData } from "@/lib/mock-data"
import { useSearchParams } from "next/navigation"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Minus, DollarSign, CreditCard, Calendar } from "lucide-react"

export default function Customer360Page() {
  const searchParams = useSearchParams()
  const customerId = searchParams.get("id") || "1"
  const customer = mockCustomers.find((c) => c.id === customerId) || mockCustomers[0]

  const getTrendIcon = () => {
    switch (customer.usageTrend) {
      case "up":
        return <TrendingUp className="h-5 w-5 text-success" />
      case "down":
        return <TrendingDown className="h-5 w-5 text-destructive" />
      default:
        return <Minus className="h-5 w-5 text-muted-foreground" />
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{customer.name}</h1>
          <p className="text-muted-foreground mt-2">Complete customer overview and usage analytics</p>
        </div>
        <Badge variant={getStatusColor() as any} className="text-sm px-3 py-1">
          {customer.status.replace("-", " ")}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Upcoming Invoice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${(customer.upcomingInvoice / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground mt-1">Due in 15 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Credit Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${(customer.creditBalance / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground mt-1">Remaining credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Commitment Burndown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{customer.commitmentBurndown}%</div>
            <p className="text-xs text-muted-foreground mt-1">Of annual commitment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Usage Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className="text-2xl font-bold capitalize text-foreground">{customer.usageTrend}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage by Billable Metric - Full Width Row */}
      <Card>
        <CardHeader>
          <CardTitle>Usage by Billable Metric</CardTitle>
          <CardDescription>API calls over time (trended)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "API Calls",
                color: "hsl(210, 100%, 60%)",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Commitment Burndown Chart - Full Width Row */}
      <Card>
        <CardHeader>
          <CardTitle>Commitment Burndown</CardTitle>
          <CardDescription>Progress against annual contract</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              committed: {
                label: "Committed",
                color: "hsl(240, 10%, 50%)",
              },
              used: {
                label: "Used",
                color: "hsl(190, 100%, 60%)",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockCommitmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="committed" fill="var(--color-committed)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="used" fill="var(--color-used)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>Past invoices with base fees, usage, and overages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="font-mono text-sm font-medium text-foreground">{invoice.id}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(invoice.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold text-foreground">${(invoice.amount / 1000).toFixed(1)}K</div>
                  </div>
                  <Badge
                    variant={
                      invoice.status === "paid" ? "success" : invoice.status === "pending" ? "warning" : "destructive"
                    }
                    className="w-20 justify-center"
                  >
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
