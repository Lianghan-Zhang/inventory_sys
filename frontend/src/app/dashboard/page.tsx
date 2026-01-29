import { AppSidebar } from "@/components/app-sidebar"
import { InventoryAlerts } from "@/components/inventory-alerts"
import { InventoryTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { mockInventoryItems, getStats } from "@/lib/inventory-mock-data"

export default function Page() {
  const stats = getStats(mockInventoryItems)

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* 统计卡片 */}
              <SectionCards
                totalSku={stats.totalSku}
                totalQuantity={stats.totalQuantity}
                lowStockCount={stats.lowStockCount}
                pendingInbound={stats.pendingInbound}
              />
              {/* 低库存预警区域 */}
              <InventoryAlerts items={mockInventoryItems} />
              {/* 库存货品列表 */}
              <InventoryTable data={mockInventoryItems} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
