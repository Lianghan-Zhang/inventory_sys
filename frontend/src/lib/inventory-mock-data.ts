import type { InventoryItem, Category } from "./inventory-api"

// Mock 分类数据
export const mockCategories: Category[] = [
  { id: 1, name: "电子元件", itemCount: 12 },
  { id: 2, name: "办公用品", itemCount: 8 },
  { id: 3, name: "包装材料", itemCount: 6 },
  { id: 4, name: "原材料", itemCount: 15 },
  { id: 5, name: "成品", itemCount: 10 },
]

// Mock 库存货品数据
export const mockInventoryItems: InventoryItem[] = [
  {
    id: 1,
    name: "电阻 10KΩ 1/4W",
    category: "电子元件",
    quantity: 1500,
    threshold: 500,
    unit: "个",
    location: "A-01-01",
    lastUpdated: "2024-01-15",
    status: "normal",
  },
  {
    id: 2,
    name: "电容 100μF 25V",
    category: "电子元件",
    quantity: 80,
    threshold: 100,
    unit: "个",
    location: "A-01-02",
    lastUpdated: "2024-01-14",
    status: "low",
  },
  {
    id: 3,
    name: "LED 灯珠 5mm 红",
    category: "电子元件",
    quantity: 3000,
    threshold: 1000,
    unit: "个",
    location: "A-01-03",
    lastUpdated: "2024-01-15",
    status: "normal",
  },
  {
    id: 4,
    name: "USB-C 连接器",
    category: "电子元件",
    quantity: 25,
    threshold: 50,
    unit: "个",
    location: "A-02-01",
    lastUpdated: "2024-01-13",
    status: "low",
  },
  {
    id: 5,
    name: "A4 打印纸",
    category: "办公用品",
    quantity: 20,
    threshold: 100,
    unit: "包",
    location: "B-01-01",
    lastUpdated: "2024-01-10",
    status: "low",
  },
  {
    id: 6,
    name: "签字笔 黑色",
    category: "办公用品",
    quantity: 200,
    threshold: 50,
    unit: "支",
    location: "B-01-02",
    lastUpdated: "2024-01-15",
    status: "normal",
  },
  {
    id: 7,
    name: "文件夹 A4",
    category: "办公用品",
    quantity: 150,
    threshold: 30,
    unit: "个",
    location: "B-01-03",
    lastUpdated: "2024-01-12",
    status: "normal",
  },
  {
    id: 8,
    name: "瓦楞纸箱 40x30x20",
    category: "包装材料",
    quantity: 500,
    threshold: 200,
    unit: "个",
    location: "C-01-01",
    lastUpdated: "2024-01-15",
    status: "normal",
  },
  {
    id: 9,
    name: "气泡膜",
    category: "包装材料",
    quantity: 0,
    threshold: 50,
    unit: "卷",
    location: "C-01-02",
    lastUpdated: "2024-01-08",
    status: "out",
  },
  {
    id: 10,
    name: "胶带 透明",
    category: "包装材料",
    quantity: 45,
    threshold: 20,
    unit: "卷",
    location: "C-01-03",
    lastUpdated: "2024-01-14",
    status: "normal",
  },
  {
    id: 11,
    name: "PCB 电路板",
    category: "电子元件",
    quantity: 200,
    threshold: 100,
    unit: "块",
    location: "A-03-01",
    lastUpdated: "2024-01-15",
    status: "normal",
  },
  {
    id: 12,
    name: "螺丝 M3x8mm",
    category: "电子元件",
    quantity: 5000,
    threshold: 2000,
    unit: "个",
    location: "A-02-02",
    lastUpdated: "2024-01-15",
    status: "normal",
  },
  {
    id: 13,
    name: "标签贴纸",
    category: "办公用品",
    quantity: 15,
    threshold: 50,
    unit: "张",
    location: "B-02-01",
    lastUpdated: "2024-01-11",
    status: "low",
  },
  {
    id: 14,
    name: "塑料托盘",
    category: "包装材料",
    quantity: 80,
    threshold: 30,
    unit: "个",
    location: "C-02-01",
    lastUpdated: "2024-01-15",
    status: "normal",
  },
  {
    id: 15,
    name: "电容 10μF 50V",
    category: "电子元件",
    quantity: 0,
    threshold: 100,
    unit: "个",
    location: "A-01-04",
    lastUpdated: "2024-01-05",
    status: "out",
  },
]

// Mock 库存趋势数据
export const mockTrendData = [
  { date: "2024-01-09", quantity: 8500 },
  { date: "2024-01-10", quantity: 8200 },
  { date: "2024-01-11", quantity: 8900 },
  { date: "2024-01-12", quantity: 9100 },
  { date: "2024-01-13", quantity: 8800 },
  { date: "2024-01-14", quantity: 8600 },
  { date: "2024-01-15", quantity: 9050 },
]

// 辅助函数
export function getLowStockItems(items: InventoryItem[]): InventoryItem[] {
  return items.filter((item) => item.status === "low" || item.status === "out")
}

export function getStats(items: InventoryItem[]) {
  return {
    totalSku: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    lowStockCount: getLowStockItems(items).length,
    pendingInbound: 5, // 模拟待入库数量
  }
}

export function getStatusBadgeVariant(status: string): "default" | "destructive" | "secondary" {
  switch (status) {
    case "normal":
      return "default"
    case "low":
      return "secondary"
    case "out":
      return "destructive"
    default:
      return "default"
  }
}

export function getStatusText(status: string): string {
  switch (status) {
    case "normal":
      return "正常"
    case "low":
      return "偏低"
    case "out":
      return "缺货"
    default:
      return status
  }
}
