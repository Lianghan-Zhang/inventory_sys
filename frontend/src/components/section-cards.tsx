import { IconAlertTriangle, IconBox, IconDatabase, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SectionCardsProps {
  totalSku: number
  totalQuantity: number
  lowStockCount: number
  pendingInbound: number
}

export function SectionCards({
  totalSku,
  totalQuantity,
  lowStockCount,
  pendingInbound,
}: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>总SKU数量</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalSku}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconDatabase />
              货品种类
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            当前库存 <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            共 {totalQuantity} 件商品
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>低库存预警</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-destructive">
            {lowStockCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-destructive text-destructive">
              <IconAlertTriangle />
              需补货
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-destructive">
            库存不足 <IconAlertTriangle className="size-4" />
          </div>
          <div className="text-muted-foreground">
            请及时补充库存
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>待入库数量</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pendingInbound}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconBox />
              入库单
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            待处理入库 <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            预计增加库存量
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>库存周转率</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              周/月
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            稳定运营 <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">库存周转情况良好</div>
        </CardFooter>
      </Card>
    </div>
  )
}
