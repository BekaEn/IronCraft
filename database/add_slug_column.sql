-- Add slug column to products table (allow NULL temporarily)
ALTER TABLE products 
ADD COLUMN slug VARCHAR(255) NULL AFTER name;

-- Generate slugs for existing products
UPDATE products SET slug = 'anime-personaji-shavi-metalis-kedlis-dekori' WHERE id = 1;
UPDATE products SET slug = 'anime-gogona-metalis-kedlis-xelovneba' WHERE id = 2;
UPDATE products SET slug = 'anime-portreti-premiumi-metalis-dekori' WHERE id = 3;
UPDATE products SET slug = 'anime-gmiri-metalis-kedlis-paneli' WHERE id = 4;

-- Now make slug NOT NULL and UNIQUE
ALTER TABLE products 
MODIFY COLUMN slug VARCHAR(255) NOT NULL UNIQUE;

-- Verify the updates
SELECT id, name, slug FROM products;
