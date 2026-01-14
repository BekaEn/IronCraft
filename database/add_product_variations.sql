-- Migration to add product variations table and remove stock from products

-- Create product_variations table
CREATE TABLE IF NOT EXISTS product_variations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  color VARCHAR(100) NOT NULL,
  size VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2) DEFAULT NULL,
  images JSON NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_variation (product_id, color, size)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Remove stock column from products table
ALTER TABLE products DROP COLUMN IF EXISTS stock;

-- Add index for faster queries
CREATE INDEX idx_product_variations_product_id ON product_variations(product_id);
CREATE INDEX idx_product_variations_active ON product_variations(is_active);
