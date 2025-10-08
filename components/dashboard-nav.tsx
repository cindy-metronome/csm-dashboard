"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, User, TrendingUp, Bell } from "lucide-react"

const navItems = [
  {
    title: "My Book of Business",
    href: "/dashboard/book-of-business",
    icon: LayoutDashboard,
  },
  {
    title: "Alerts",
    href: "/dashboard/alerts",
    icon: Bell,
  },
  {
    title: "Customer 360",
    href: "/dashboard/customer-360",
    icon: User,
  },
  {
    title: "Finding Growth",
    href: "/dashboard/growth",
    icon: TrendingUp,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard/book-of-business" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="font-mono text-sm font-bold text-primary-foreground">CS</span>
              </div>
              <span className="font-semibold text-foreground">CSM Dashboard</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              CSM: <span className="text-foreground font-medium">Sarah Johnson</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
