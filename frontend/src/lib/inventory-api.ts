import { z } from "zod"

// 数据模型定义
export const inventoryItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  quantity: z.number(),
  threshold: z.number(),
  unit: z.string(),
  location: z.string(),
  lastUpdated: z.string(),
  status: z.enum(["normal", "low", "out"]),
})

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  itemCount: z.number(),
})

export type InventoryItem = z.infer<typeof inventoryItemSchema>
export type Category = z.infer<typeof categorySchema>

// API 服务层 - 预留后端接口
const API_BASE = "/api/v1"

export const inventoryApi = {
  // 获取所有库存货品
  async getItems(): Promise<InventoryItem[]> {
    // TODO: 替换为真实 API 调用
    // return fetch(`${API_BASE}/items`).then(r => r.json())
    return Promise.resolve([])
  },

  // 获取所有分类
  async getCategories(): Promise<Category[]> {
    // TODO: 替换为真实 API 调用
    // return fetch(`${API_BASE}/categories`).then(r => r.json())
    return Promise.resolve([])
  },

  // 获取低库存预警货品
  async getLowStockItems(): Promise<InventoryItem[]> {
    // TODO: 替换为真实 API 调用
    // return fetch(`${API_BASE}/items/alerts`).then(r => r.json())
    return Promise.resolve([])
  },

  // 更新货品信息
  async updateItem(id: number, data: Partial<InventoryItem>): Promise<InventoryItem> {
    // TODO: 替换为真实 API 调用
    // return fetch(`${API_BASE}/items/${id}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // }).then(r => r.json())
    return Promise.resolve({} as InventoryItem)
  },

  // 添加新货品
  async addItem(data: Omit<InventoryItem, "id">): Promise<InventoryItem> {
    // TODO: 替换为真实 API 调用
    // return fetch(`${API_BASE}/items`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // }).then(r => r.json())
    return Promise.resolve({} as InventoryItem)
  },

  // 删除货品
  async deleteItem(id: number): Promise<void> {
    // TODO: 替换为真实 API 调用
    // return fetch(`${API_BASE}/items/${id}`, { method: "DELETE" })
    return Promise.resolve()
  },

  // 获取库存统计数据
  async getStats(): Promise<{
    totalSku: number
    totalQuantity: number
    lowStockCount: number
    pendingInbound: number
  }> {
    // TODO: 替换为真实 API 调用
    return Promise.resolve({
      totalSku: 0,
      totalQuantity: 0,
      lowStockCount: 0,
      pendingInbound: 0,
    })
  },

  // 获取库存趋势数据
  async getTrendData(): Promise<{ date: string; quantity: number }[]> {
    // TODO: 替换为真实 API 调用
    return Promise.resolve([])
  },
}
