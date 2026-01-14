-- Migration to add product variations table and remove stock from products

-- Create product_variations table
CREATE TABLE IF NOT EXISTS product_variations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  color VARCHAR(100) NOT NULL,
  size VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2) DEFAULT NULL,
  images JSON NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_variation (product_id, color, size)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Remove stock column from products table (if it exists)
-- Check if column exists first, then drop
SET @dbname = DATABASE();
SET @tablename = 'products';
SET @columnname = 'stock';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'ALTER TABLE products DROP COLUMN stock;',
  'SELECT 1;'
));
PREPARE alterIfExists FROM @preparedStatement;
EXECUTE alterIfExists;
DEALLOCATE PREPARE alterIfExists;

-- Add index for faster queries
CREATE INDEX idx_product_variations_product_id ON product_variations(product_id);
CREATE INDEX idx_product_variations_active ON product_variations(is_active);
