-- Add thumbnail column to products table
ALTER TABLE products ADD COLUMN thumbnail VARCHAR(500) DEFAULT NULL;
