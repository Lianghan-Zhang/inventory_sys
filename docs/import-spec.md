# 导入规则与字段映射（CSV/XLSX）

## 1. 文件要求
- 支持 CSV / XLSX
- CSV 建议 UTF-8 编码
- 第一行为表头

## 2. 字段映射（与示例一致）

- 商品编码* → products.sku（必填）
- 商品名称 → products.name
- 材质 / 型号 / 颜色 / 配件 → products.material / model / color / parts
- 货品码 → products.product_code
- 货位码 → locations.code
- 货位条码 → locations.barcode
- 库存* → inventory.quantity（快照）
- 在途数量 → inventory.in_transit_quantity
- 预出库数量 → inventory.reserved_quantity
- 在途冻结 → inventory.in_transit_quantity 或扩展字段
- 库存冻结 → inventory.frozen_quantity
- 预警天数 → 规则转换为 reorder_point / safety_stock
- 供应商 → suppliers.name
- 累计总销量 → 仅报表使用，不直接落库
- 库存创建时间 → 仅用于审计

## 3. 校验规则

- 商品编码* 必须存在或允许自动建档（配置项）。
- 库存*、在途数量、预出库数量、在途冻结、库存冻结必须为非负整数。
- 货位码为空或货位条码=-1 → 默认库位（locations.is_default=true）。
- 未找到默认库位 → 行失败。

## 4. 导入结果

- 成功与失败行分开记录于 import_record_details。
- 失败不阻断整体导入。
- 支持 dry_run，仅校验不落库。
