# 后端设计文档（库存系统）

更新时间：2026-01-29

## 1. 目标与约束

- 系统无法直接对接销售系统，只能手动导入导出的 XLSX/CSV 文件进行数据更新。
- 业务要求：多仓 + 多库位、批次管理、序列号追踪。
- 不需要：多单位换算、多币种。
- 一切库存变更必须可审计、可追溯。

## 2. 关键决策

- **导入策略**：全量快照覆盖（A）。导入文件视为当前库存快照，不直接写库存表，而是通过“差量流水 + 快照更新”的事务实现。
- **库存流水为唯一入口**：所有库存变化必须写入 `inventory_movements`。
- **序列号追踪方案 A**：序列号流转直接记录在 `inventory_movements`，每条序列号变动 `quantity=1`。
- **空库位处理**：若 `货位码` 为空或 `货位条码=-1`，归入“仓库默认库位”（`locations.is_default=true`）。

## 3. 数据流（导入）

1. 用户上传 XLSX/CSV。
2. 生成 `import_records`，写入文件元信息与导入状态。
3. 逐行解析：
   - 解析为标准字段并写入 `import_record_details.raw_payload`。
   - 做主数据匹配（`产品`、`供应商`、`仓库`、`库位`）。
   - 对非法行写 `error_message`，不中断整体导入。
4. 以 `(product_id, warehouse_id, location_id)` 为键，与 `inventory` 快照对比，计算 `delta`：
   - `delta != 0` -> 写 `inventory_movements`（`movement_type=adjust`, `ref_type=import`, `ref_id=import_record_id`）。
   - 同一事务中更新 `inventory` 快照。
5. 批次/序列号：
   - 若导入包含 `batch_code` 或 `serial_no`，先校验唯一性/有效性。
   - 每个序列号生成单独流水（`quantity=1`）。

## 4. 主要表设计（摘要）

### 4.1 基础表
- `users`：含 `role`, `last_login_at`, `deleted_at`
- `warehouses`
- `locations`：`(warehouse_id, code)` 唯一；`barcode` 可唯一；`is_default` 标识默认库位

### 4.2 产品与业务对象
- `categories`、`suppliers`、`customers`
- `products`：
  - `sku`（商品编码，唯一）
  - `product_code`（货品码）
  - `attributes` JSONB 承载可变属性
  - `tracking_type`：none/batch/serial/both

### 4.3 库存核心
- `inventory`
  - 唯一键：`(product_id, warehouse_id, location_id)`
  - 数量字段：`quantity`, `frozen_quantity`, `reserved_quantity`, `in_transit_quantity`
  - 预警：`reorder_point`, `safety_stock`
- `inventory_movements`
  - `movement_type`：purchase_in, sales_out, transfer_in, transfer_out, adjust, freeze, unfreeze
  - `ref_type/ref_id` 与导入/订单关联
  - `batch_id`, `serial_number_id`
- `batches`：`(product_id, batch_code)` 唯一
- `serial_numbers`：`serial_no` 唯一

### 4.4 订单层
- `purchase_orders` / `purchase_order_items`
- `sales_orders` / `sales_order_items`
- 订单头包含 `status`, `approved_by`, `received_at`, `shipped_at`, `deleted_at`

### 4.5 支撑表
- `inventory_alerts`（需含 `warehouse_id` / `location_id`）
- `import_records` / `import_record_details`

## 5. CSV 字段映射（示例）

输入表头（示例）：
- 商品编码* → `products.sku`
- 商品名称 → `products.name`
- 材质/型号/颜色/配件 → `products.material/model/color/parts`
- 货品码 → `products.product_code`
- 货位码 / 货位条码 → `locations.code` / `locations.barcode`
- 库存* → `inventory.quantity`（通过差量流水更新）
- 在途数量 / 预出库数量 / 在途冻结 / 库存冻结 → `inventory` 对应字段
- 预警天数 → 转换为 `reorder_point` 或规则映射（需配置）
- 供应商 → `suppliers.name`
- 累计总销量 → 不直接落库（可用报表统计）
- 库存创建时间 → 仅用于导入记录与追踪

## 6. 一致性与审计

- 库存快照不可直接修改，仅通过流水更新。
- 导入必须写入 `import_records` 和 `import_record_details` 以保留审计线索。
- 建议在服务层使用事务保证“流水 + 快照更新”原子性。

## 7. 后续可选增强

- 自动校验序列号数量与库存数量一致性
- 导入规则可配置化（字段映射/数据校验/告警阈值）
- 报表层：从流水聚合销量与库存趋势
