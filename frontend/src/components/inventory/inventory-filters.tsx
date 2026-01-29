import * as React from "react"
import {
  IconFilter,
  IconRefresh,
  IconX,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface InventoryFiltersProps {
  searchValue: string
  onSearchChange: (value: string) => void
  selectedCategories: string[]
  onCategoriesChange: (categories: string[]) => void
  statusFilter: string
  onStatusChange: (status: string) => void
  categories: string[]
  onReset: () => void
}

export function InventoryFilters({
  searchValue,
  onSearchChange,
  selectedCategories,
  onCategoriesChange,
  statusFilter,
  onStatusChange,
  categories,
  onReset,
}: InventoryFiltersProps) {
  const allCategories = categories.length > 0 ? categories : ["电子元件", "办公用品", "包装材料", "原材料", "成品"]

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category))
    } else {
      onCategoriesChange([...selectedCategories, category])
    }
  }

  const selectAllCategories = () => {
    onCategoriesChange(allCategories)
  }

  const clearCategories = () => {
    onCategoriesChange([])
  }

  const hasActiveFilters = searchValue || selectedCategories.length > 0 && selectedCategories.length < allCategories.length || statusFilter !== "all"

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        {/* 搜索框 */}
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="搜索货品名称..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
          <IconFilter className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* 分类多选 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <IconFilter className="mr-2 h-4 w-4" />
              分类
              {selectedCategories.length > 0 && selectedCategories.length < allCategories.length && (
                <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                  {selectedCategories.length}
                </span>
              )}
              {selectedCategories.length === allCategories.length && (
                <span className="ml-1 rounded-full bg-green-100 px-1.5 py-0.5 text-xs text-green-700">
                  全部
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>选择分类</span>
              <div className="flex gap-1">
                <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={selectAllCategories}>
                  全选
                </Button>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={clearCategories}>
                  清除
                </Button>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allCategories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 库存状态筛选 */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="库存状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="normal">正常</SelectItem>
            <SelectItem value="low">偏低</SelectItem>
            <SelectItem value="out">缺货</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 重置按钮 */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <IconRefresh className="mr-2 h-4 w-4" />
          重置筛选
        </Button>
      )}
    </div>
  )
}
