import { DashboardSidebar } from "@/components/dashboard-sidebar"
import React from "react"
import { LayoutDashboard, Store, BarChart3 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"

const sidebarItems = [
  {
    label: "Store Info",
    href: "/dashboard/business/store",
    icon: <Store className="h-4 w-4" />,
  },
  {
    label: "Queue Management",
    href: "/dashboard/business/queue",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
]
const BusinessLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <DashboardSidebar items={sidebarItems} />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardHeader 
          title="Business Dashboard" 
          userRole="business" 
          sidebarItems={sidebarItems} 
        />
        {children}
      </div>
    </div>
  )
}

export default BusinessLayout
