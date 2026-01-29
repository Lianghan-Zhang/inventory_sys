-- PostgreSQL DDL (Inventory System)

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(30) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(255),
    remark TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    warehouse_id INT NOT NULL REFERENCES warehouses(id),
    code VARCHAR(50) NOT NULL,
    barcode VARCHAR(50) UNIQUE,
    status VARCHAR(20) DEFAULT 'active',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    UNIQUE (warehouse_id, code)
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INT REFERENCES categories(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    UNIQUE (parent_id, name)
);

CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    address VARCHAR(255),
    remark TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    address VARCHAR(255),
    remark TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    product_code VARCHAR(100),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INT REFERENCES categories(id),
    supplier_id INT REFERENCES suppliers(id),
    material VARCHAR(100),
    model VARCHAR(100),
    color VARCHAR(50),
    parts VARCHAR(200),
    unit_price NUMERIC(12,2),
    master_sku VARCHAR(100),
    tracking_type VARCHAR(20) DEFAULT 'none',
    attributes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE batches (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id),
    batch_code VARCHAR(100) NOT NULL,
    production_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    UNIQUE (product_id, batch_code)
);

CREATE TABLE serial_numbers (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id),
    serial_no VARCHAR(200) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'in_stock',
    warehouse_id INT REFERENCES warehouses(id),
    location_id INT REFERENCES locations(id),
    batch_id INT REFERENCES batches(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id),
    warehouse_id INT NOT NULL REFERENCES warehouses(id),
    location_id INT NOT NULL REFERENCES locations(id),
    quantity INT DEFAULT 0,
    frozen_quantity INT DEFAULT 0,
    reserved_quantity INT DEFAULT 0,
    in_transit_quantity INT DEFAULT 0,
    reorder_point INT DEFAULT 0,
    safety_stock INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'normal',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    UNIQUE (product_id, warehouse_id, location_id),
    CHECK (quantity >= 0)
);

CREATE TABLE inventory_movements (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id),
    warehouse_id INT NOT NULL REFERENCES warehouses(id),
    location_id INT NOT NULL REFERENCES locations(id),
    movement_type VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    unit_cost NUMERIC(12,2),
    ref_type VARCHAR(50),
    ref_id VARCHAR(64),
    batch_id INT REFERENCES batches(id),
    serial_number_id INT REFERENCES serial_numbers(id),
    created_by INT REFERENCES users(id),
    note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    supplier_id INT NOT NULL REFERENCES suppliers(id),
    status VARCHAR(20) DEFAULT 'draft',
    total_amount NUMERIC(12,2),
    expected_date DATE,
    approved_by INT REFERENCES users(id),
    received_at TIMESTAMP,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE purchase_order_items (
    id SERIAL PRIMARY KEY,
    purchase_order_id INT NOT NULL REFERENCES purchase_orders(id),
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price NUMERIC(12,2),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE sales_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id INT NOT NULL REFERENCES customers(id),
    status VARCHAR(20) DEFAULT 'draft',
    total_amount NUMERIC(12,2),
    shipped_at TIMESTAMP,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE sales_order_items (
    id SERIAL PRIMARY KEY,
    sales_order_id INT NOT NULL REFERENCES sales_orders(id),
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price NUMERIC(12,2),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE inventory_alerts (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id),
    warehouse_id INT NOT NULL REFERENCES warehouses(id),
    location_id INT REFERENCES locations(id),
    alert_type VARCHAR(20) NOT NULL,
    current_quantity INT NOT NULL,
    threshold INT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE import_records (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_hash VARCHAR(64),
    source_system VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    total_rows INT DEFAULT 0,
    success_rows INT DEFAULT 0,
    failed_rows INT DEFAULT 0,
    created_by INT REFERENCES users(id),
    note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE import_record_details (
    id SERIAL PRIMARY KEY,
    import_record_id INT NOT NULL REFERENCES import_records(id),
    row_number INT NOT NULL,
    raw_payload JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    is_success BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (import_record_id, row_number)
);

-- Indexes
CREATE INDEX ix_movements_product_time ON inventory_movements (product_id, created_at);
CREATE INDEX ix_movements_wh_time ON inventory_movements (warehouse_id, created_at);
CREATE INDEX ix_movements_ref ON inventory_movements (ref_type, ref_id);
