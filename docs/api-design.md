# 接口设计（/api/v1）

## 1. 认证与用户

- POST /api/v1/auth/login
  - 入参：username, password
  - 出参：access_token, user

- GET /api/v1/users/me
  - 出参：当前用户信息

## 2. 基础资料

- GET /api/v1/warehouses
- POST /api/v1/warehouses
- GET /api/v1/warehouses/{id}
- PATCH /api/v1/warehouses/{id}
- DELETE /api/v1/warehouses/{id}

- GET /api/v1/locations?warehouse_id=
- POST /api/v1/locations
- GET /api/v1/locations/{id}
- PATCH /api/v1/locations/{id}
- DELETE /api/v1/locations/{id}

- GET /api/v1/categories
- POST /api/v1/categories
- PATCH /api/v1/categories/{id}
- DELETE /api/v1/categories/{id}

- GET /api/v1/suppliers
- POST /api/v1/suppliers
- PATCH /api/v1/suppliers/{id}
- DELETE /api/v1/suppliers/{id}

- GET /api/v1/customers
- POST /api/v1/customers
- PATCH /api/v1/customers/{id}
- DELETE /api/v1/customers/{id}

## 3. 产品

- GET /api/v1/products?sku=&name=&category_id=&supplier_id=
- POST /api/v1/products
- GET /api/v1/products/{id}
- PATCH /api/v1/products/{id}
- DELETE /api/v1/products/{id}

## 4. 库存与流水

- GET /api/v1/inventory?product_id=&warehouse_id=&location_id=
- GET /api/v1/inventory/{id}
- GET /api/v1/inventory/alerts
- GET /api/v1/inventory/movements?product_id=&warehouse_id=&date_from=&date_to=

## 5. 导入（CSV/XLSX）

### 5.1 上传导入文件

- POST /api/v1/imports
  - Content-Type: multipart/form-data
  - form-data:
    - file: CSV/XLSX
    - warehouse_code: 可选（为空时使用系统默认仓库）
    - dry_run: 可选（true 仅校验，不落库）
  - 返回：import_record_id, status

### 5.2 查询导入记录

- GET /api/v1/imports
- GET /api/v1/imports/{id}
- GET /api/v1/imports/{id}/details?status=failed&page=&page_size=

### 5.3 导入校验规则（核心）

- 必填字段：商品编码*、库存*。
- 类型校验：库存/在途/冻结/预出库为非负整数。
- 货位处理：
  - 货位码为空或货位条码=-1 → 自动归入仓库默认库位。
  - 若无默认库位 → 该行标记失败。
- SKU 必须存在；若不存在：
  - 可配置为“自动创建产品”或“导入失败”。
- CSV/XLSX 兼容：UTF-8 编码优先，必要时做编码探测。

### 5.4 导入逻辑

- 对比 `(product_id, warehouse_id, location_id)` 快照，计算 delta。
- delta != 0 写入 `inventory_movements`，并更新 `inventory`。
- 失败行记录 `import_record_details.error_message`，不影响其他行。

## 6. 采购订单

- GET /api/v1/purchase-orders
- POST /api/v1/purchase-orders
- GET /api/v1/purchase-orders/{id}
- PATCH /api/v1/purchase-orders/{id}
- POST /api/v1/purchase-orders/{id}/approve
- POST /api/v1/purchase-orders/{id}/receive

## 7. 销售订单

- GET /api/v1/sales-orders
- POST /api/v1/sales-orders
- GET /api/v1/sales-orders/{id}
- PATCH /api/v1/sales-orders/{id}
- POST /api/v1/sales-orders/{id}/ship
