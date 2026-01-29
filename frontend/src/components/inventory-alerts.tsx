import { IconAlertTriangle, IconArrowRight, IconAlertCircle } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { InventoryItem } from "@/lib/inventory-api"
import { getLowStockItems } from "@/lib/inventory-mock-data"

interface InventoryAlertsProps {
  items: InventoryItem[]
  onViewAll?: () => void
}

export function InventoryAlerts({ items, onViewAll }: InventoryAlertsProps) {
  const lowStockItems = getLowStockItems(items)
  const criticalItems = lowStockItems.filter((item) => item.status === "out")

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconAlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-lg font-semibold">库存预警</CardTitle>
              {lowStockItems.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {lowStockItems.length}
                </Badge>
              )}
            </div>
            {onViewAll && lowStockItems.length > 0 && (
              <Button variant="ghost" size="sm" onClick={onViewAll}>
                查看全部
                <IconArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
          <CardDescription>库存量低于预设阈值的货品，请及时补货</CardDescription>
        </CardHeader>
        <CardContent>
          {lowStockItems.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <IconAlertTriangle className="mx-auto h-12 w-12 opacity-20" />
              <p className="mt-2">暂无库存预警，所有货品库存充足</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {lowStockItems.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-foreground">
                        {item.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className="shrink-0 text-xs"
                      >
                        {item.category}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        当前: {item.quantity} {item.unit}
                      </span>
                      <span className="text-red-600 font-medium">
                        / 阈值: {item.threshold} {item.unit}
                      </span>
                    </div>
                  </div>
                  <div className="ml-2 shrink-0">
                    <span className="text-xs font-medium text-red-600">
                      需补货
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {lowStockItems.length > 6 && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm" onClick={onViewAll}>
                还有 {lowStockItems.length - 6} 项预警未显示
              </Button>
            </div>
          )}
          {criticalItems.length > 0 && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
              <div className="flex items-center gap-2">
                <IconAlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  紧急：{criticalItems.length} 种货品已缺货，请立即采购
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
