import * as React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { InventoryFilters } from "@/components/inventory/inventory-filters"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockInventoryItems } from "@/lib/inventory-mock-data"

export default function InventoryPage() {
  const [searchValue, setSearchValue] = React.useState("")
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([])
  const [statusFilter, setStatusFilter] = React.useState("all")

  // 获取所有分类
  const categories = React.useMemo(() => {
    const cats = new Set(mockInventoryItems.map((item) => item.category))
    return Array.from(cats)
  }, [])

  // 过滤数据
  const filteredData = React.useMemo(() => {
    return mockInventoryItems.filter((item) => {
      // 搜索筛选
      if (searchValue && !item.name.toLowerCase().includes(searchValue.toLowerCase())) {
        return false
      }

      // 分类筛选
      if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) {
        return false
      }

      // 库存状态筛选
      if (statusFilter === "low") {
        if (item.quantity > item.threshold) return false
      } else if (statusFilter === "out") {
        if (item.quantity > 0) return false
      } else if (statusFilter === "normal") {
        if (item.quantity <= item.threshold) return false
      }

      return true
    })
  }, [searchValue, selectedCategories, statusFilter])

  // 统计信息
  const stats = React.useMemo(() => {
    const total = mockInventoryItems.length
    const low = mockInventoryItems.filter((item) => item.quantity <= item.threshold && item.quantity > 0).length
    const out = mockInventoryItems.filter((item) => item.quantity === 0).length
    return { total, low, out }
  }, [])

  const handleReset = () => {
    setSearchValue("")
    setSelectedCategories([])
    setStatusFilter("all")
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* 页面标题 */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">库存列表</h1>
                  <p className="text-muted-foreground">管理所有库存货品</p>
                </div>
                <Button>
                  添加货品
                </Button>
              </div>

              {/* 统计卡片 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>总货品数</CardDescription>
                    <CardTitle className="text-3xl">{stats.total}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">当前库存货品总数</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>库存偏低</CardDescription>
                    <CardTitle className="text-3xl text-amber-600">{stats.low}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">需要及时补货</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>已缺货</CardDescription>
                    <CardTitle className="text-3xl text-red-600">{stats.out}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">库存为 0 的货品</div>
                  </CardContent>
                </Card>
              </div>

              {/* 筛选栏 */}
              <InventoryFilters
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                selectedCategories={selectedCategories}
                onCategoriesChange={setSelectedCategories}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                categories={categories}
                onReset={handleReset}
              />

              {/* 数据表格 */}
              <InventoryTable data={filteredData} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
