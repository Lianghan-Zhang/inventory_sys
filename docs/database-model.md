# 数据库模型（SQLAlchemy 2.0）

> 适配：FastAPI + SQLAlchemy 2.0 + PostgreSQL
> 说明：库存变更通过 inventory_movements 记录，inventory 为快照。

```python
from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import Optional, Dict, Any

from sqlalchemy import (
    Boolean, CheckConstraint, Date, DateTime, Enum as SAEnum,
    ForeignKey, Index, Integer, Numeric, String, Text,
    UniqueConstraint, func
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )


class SoftDeleteMixin:
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)


class TrackingType(str, Enum):
    NONE = "none"
    BATCH = "batch"
    SERIAL = "serial"
    BOTH = "both"


class MovementType(str, Enum):
    PURCHASE_IN = "purchase_in"
    SALES_OUT = "sales_out"
    TRANSFER_IN = "transfer_in"
    TRANSFER_OUT = "transfer_out"
    ADJUST = "adjust"
    FREEZE = "freeze"
    UNFREEZE = "unfreeze"


class OrderStatus(str, Enum):
    DRAFT = "draft"
    APPROVED = "approved"
    RECEIVED = "received"
    SHIPPED = "shipped"
    CLOSED = "closed"
    CANCELLED = "cancelled"


class ImportStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SUCCESS = "success"
    PARTIAL = "partial"
    FAILED = "failed"


class AlertType(str, Enum):
    LOW_STOCK = "low_stock"
    OUT_OF_STOCK = "out_of_stock"


class LocationStatus(str, Enum):
    ACTIVE = "active"
    DISABLED = "disabled"


class SerialStatus(str, Enum):
    IN_STOCK = "in_stock"
    RESERVED = "reserved"
    SHIPPED = "shipped"
    SCRAPPED = "scrapped"


class InventoryStatus(str, Enum):
    NORMAL = "normal"
    QC_HOLD = "qc_hold"
    DAMAGED = "damaged"


class User(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    role: Mapped[str] = mapped_column(String(30), default="user")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)


class Warehouse(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "warehouses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200))
    address: Mapped[Optional[str]] = mapped_column(String(255))
    remark: Mapped[Optional[str]] = mapped_column(Text)


class Location(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "locations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    warehouse_id: Mapped[int] = mapped_column(ForeignKey("warehouses.id"), index=True)
    code: Mapped[str] = mapped_column(String(50))
    barcode: Mapped[Optional[str]] = mapped_column(String(50), unique=True)
    status: Mapped[LocationStatus] = mapped_column(
        SAEnum(LocationStatus), default=LocationStatus.ACTIVE
    )
    is_default: Mapped[bool] = mapped_column(Boolean, default=False)

    __table_args__ = (
        UniqueConstraint("warehouse_id", "code", name="uq_location_warehouse_code"),
    )


class Category(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    parent_id: Mapped[Optional[int]] = mapped_column(ForeignKey("categories.id"))

    __table_args__ = (
        UniqueConstraint("parent_id", "name", name="uq_category_parent_name"),
    )


class Supplier(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "suppliers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200), index=True)
    contact_person: Mapped[Optional[str]] = mapped_column(String(100))
    phone: Mapped[Optional[str]] = mapped_column(String(50))
    email: Mapped[Optional[str]] = mapped_column(String(255))
    address: Mapped[Optional[str]] = mapped_column(String(255))
    remark: Mapped[Optional[str]] = mapped_column(Text)


class Customer(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200), index=True)
    contact_person: Mapped[Optional[str]] = mapped_column(String(100))
    phone: Mapped[Optional[str]] = mapped_column(String(50))
    email: Mapped[Optional[str]] = mapped_column(String(255))
    address: Mapped[Optional[str]] = mapped_column(String(255))
    remark: Mapped[Optional[str]] = mapped_column(Text)


class Product(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sku: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    product_code: Mapped[Optional[str]] = mapped_column(String(100), index=True)
    name: Mapped[str] = mapped_column(String(200))
    description: Mapped[Optional[str]] = mapped_column(Text)

    category_id: Mapped[Optional[int]] = mapped_column(ForeignKey("categories.id"), index=True)
    supplier_id: Mapped[Optional[int]] = mapped_column(ForeignKey("suppliers.id"), index=True)

    material: Mapped[Optional[str]] = mapped_column(String(100))
    model: Mapped[Optional[str]] = mapped_column(String(100))
    color: Mapped[Optional[str]] = mapped_column(String(50))
    parts: Mapped[Optional[str]] = mapped_column(String(200))

    unit_price: Mapped[Optional[float]] = mapped_column(Numeric(12, 2))
    master_sku: Mapped[Optional[str]] = mapped_column(String(100))

    tracking_type: Mapped[TrackingType] = mapped_column(
        SAEnum(TrackingType), default=TrackingType.NONE
    )

    attributes: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict)


class Batch(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "batches"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), index=True)
    batch_code: Mapped[str] = mapped_column(String(100))
    production_date: Mapped[Optional[date]] = mapped_column(Date)
    expiry_date: Mapped[Optional[date]] = mapped_column(Date)

    __table_args__ = (
        UniqueConstraint("product_id", "batch_code", name="uq_batch_product_code"),
    )


class SerialNumber(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "serial_numbers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), index=True)
    serial_no: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    status: Mapped[SerialStatus] = mapped_column(
        SAEnum(SerialStatus), default=SerialStatus.IN_STOCK
    )

    warehouse_id: Mapped[Optional[int]] = mapped_column(ForeignKey("warehouses.id"), index=True)
    location_id: Mapped[Optional[int]] = mapped_column(ForeignKey("locations.id"), index=True)
    batch_id: Mapped[Optional[int]] = mapped_column(ForeignKey("batches.id"), index=True)


class Inventory(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "inventory"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), index=True)
    warehouse_id: Mapped[int] = mapped_column(ForeignKey("warehouses.id"), index=True)
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.id"), index=True)

    quantity: Mapped[int] = mapped_column(Integer, default=0)
    frozen_quantity: Mapped[int] = mapped_column(Integer, default=0)
    reserved_quantity: Mapped[int] = mapped_column(Integer, default=0)
    in_transit_quantity: Mapped[int] = mapped_column(Integer, default=0)

    reorder_point: Mapped[int] = mapped_column(Integer, default=0)
    safety_stock: Mapped[int] = mapped_column(Integer, default=0)

    status: Mapped[InventoryStatus] = mapped_column(
        SAEnum(InventoryStatus), default=InventoryStatus.NORMAL
    )

    __table_args__ = (
        UniqueConstraint("product_id", "warehouse_id", "location_id", name="uq_inventory_key"),
        CheckConstraint("quantity >= 0", name="ck_inventory_qty_nonneg"),
    )


class InventoryMovement(Base, TimestampMixin):
    __tablename__ = "inventory_movements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), index=True)
    warehouse_id: Mapped[int] = mapped_column(ForeignKey("warehouses.id"), index=True)
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.id"), index=True)

    movement_type: Mapped[MovementType] = mapped_column(SAEnum(MovementType))
    quantity: Mapped[int] = mapped_column(Integer)
    unit_cost: Mapped[Optional[float]] = mapped_column(Numeric(12, 2))

    ref_type: Mapped[Optional[str]] = mapped_column(String(50))
    ref_id: Mapped[Optional[str]] = mapped_column(String(64))

    batch_id: Mapped[Optional[int]] = mapped_column(ForeignKey("batches.id"), index=True)
    serial_number_id: Mapped[Optional[int]] = mapped_column(ForeignKey("serial_numbers.id"), index=True)

    created_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), index=True)
    note: Mapped[Optional[str]] = mapped_column(Text)

    __table_args__ = (
        Index("ix_movements_product_time", "product_id", "created_at"),
        Index("ix_movements_wh_time", "warehouse_id", "created_at"),
        Index("ix_movements_ref", "ref_type", "ref_id"),
    )


class PurchaseOrder(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "purchase_orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_number: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    supplier_id: Mapped[int] = mapped_column(ForeignKey("suppliers.id"), index=True)

    status: Mapped[OrderStatus] = mapped_column(SAEnum(OrderStatus), default=OrderStatus.DRAFT)
    total_amount: Mapped[Optional[float]] = mapped_column(Numeric(12, 2))
    expected_date: Mapped[Optional[date]] = mapped_column(Date)
    approved_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"))
    received_at: Mapped[Optional[datetime]] = mapped_column(DateTime)

    created_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"))


class PurchaseOrderItem(Base, TimestampMixin):
    __tablename__ = "purchase_order_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    purchase_order_id: Mapped[int] = mapped_column(
        ForeignKey("purchase_orders.id"), index=True
    )
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), index=True)
    quantity: Mapped[int] = mapped_column(Integer)
    unit_price: Mapped[Optional[float]] = mapped_column(Numeric(12, 2))


class SalesOrder(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "sales_orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_number: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), index=True)

    status: Mapped[OrderStatus] = mapped_column(SAEnum(OrderStatus), default=OrderStatus.DRAFT)
    total_amount: Mapped[Optional[float]] = mapped_column(Numeric(12, 2))
    shipped_at: Mapped[Optional[datetime]] = mapped_column(DateTime)

    created_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"))


class SalesOrderItem(Base, TimestampMixin):
    __tablename__ = "sales_order_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sales_order_id: Mapped[int] = mapped_column(ForeignKey("sales_orders.id"), index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), index=True)
    quantity: Mapped[int] = mapped_column(Integer)
    unit_price: Mapped[Optional[float]] = mapped_column(Numeric(12, 2))


class InventoryAlert(Base, TimestampMixin):
    __tablename__ = "inventory_alerts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), index=True)
    warehouse_id: Mapped[int] = mapped_column(ForeignKey("warehouses.id"), index=True)
    location_id: Mapped[Optional[int]] = mapped_column(ForeignKey("locations.id"), index=True)

    alert_type: Mapped[AlertType] = mapped_column(SAEnum(AlertType))
    current_quantity: Mapped[int] = mapped_column(Integer)
    threshold: Mapped[int] = mapped_column(Integer)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)


class ImportRecord(Base, TimestampMixin):
    __tablename__ = "import_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    file_name: Mapped[str] = mapped_column(String(255))
    file_hash: Mapped[Optional[str]] = mapped_column(String(64), index=True)
    source_system: Mapped[Optional[str]] = mapped_column(String(100))
    status: Mapped[ImportStatus] = mapped_column(
        SAEnum(ImportStatus), default=ImportStatus.PENDING
    )

    total_rows: Mapped[int] = mapped_column(Integer, default=0)
    success_rows: Mapped[int] = mapped_column(Integer, default=0)
    failed_rows: Mapped[int] = mapped_column(Integer, default=0)

    created_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"))
    note: Mapped[Optional[str]] = mapped_column(Text)


class ImportRecordDetail(Base, TimestampMixin):
    __tablename__ = "import_record_details"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    import_record_id: Mapped[int] = mapped_column(
        ForeignKey("import_records.id"), index=True
    )
    row_number: Mapped[int] = mapped_column(Integer)
    raw_payload: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict)
    error_message: Mapped[Optional[str]] = mapped_column(Text)
    is_success: Mapped[bool] = mapped_column(Boolean, default=True)

    __table_args__ = (
        UniqueConstraint("import_record_id", "row_number", name="uq_import_row"),
    )
```
