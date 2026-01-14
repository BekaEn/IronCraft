-- Update local database to match production
-- Run this file to add Product 2 variations for testing

-- Update Product 2 with correct data
UPDATE Products 
SET 
  name = 'ანიმე პერსონაჟი - შავი მეტალის კედლის დეკორი',
  description = 'მაღალი ხარისხის შავი მეტალის კედლის დეკორი ანიმე პერსონაჟის გამოსახულებით',
  price = 150.00,
  category = 'anime',
  images = JSON_ARRAY(
    'https://ironcraft-production.up.railway.app/uploads/products/anime-girl-1.jpg',
    'https://ironcraft-production.up.railway.app/uploads/products/anime-girl-2.jpg',
    'https://ironcraft-production.up.railway.app/uploads/products/anime-girl-3.jpg'
  ),
  isOnSale = true,
  salePrice = 120.00
WHERE id = 2;

-- Delete existing variations for Product 2 (if any)
DELETE FROM product_variations WHERE product_id = 2;

-- Insert the 6 variations (3 colors × 2 sizes)
INSERT INTO product_variations (product_id, color, size, price, sale_price, images, is_active, created_at, updated_at) VALUES
-- Black variations
(2, 'black', '60x80', 150.00, 120.00, JSON_ARRAY('https://ironcraft-production.up.railway.app/uploads/products/anime-girl-1.jpg'), true, NOW(), NOW()),
(2, 'black', '80x120', 180.00, 150.00, JSON_ARRAY('https://ironcraft-production.up.railway.app/uploads/products/anime-girl-1.jpg'), true, NOW(), NOW()),

-- Red variations
(2, 'red', '60x80', 150.00, 120.00, JSON_ARRAY('https://ironcraft-production.up.railway.app/uploads/products/anime-girl-2.jpg'), true, NOW(), NOW()),
(2, 'red', '80x120', 180.00, 150.00, JSON_ARRAY('https://ironcraft-production.up.railway.app/uploads/products/anime-girl-2.jpg'), true, NOW(), NOW()),

-- Blue variations
(2, 'blue', '60x80', 150.00, 120.00, JSON_ARRAY('https://ironcraft-production.up.railway.app/uploads/products/anime-girl-3.jpg'), true, NOW(), NOW()),
(2, 'blue', '80x120', 180.00, 150.00, JSON_ARRAY('https://ironcraft-production.up.railway.app/uploads/products/anime-girl-3.jpg'), true, NOW(), NOW());

-- Verify the data
SELECT 'Product 2 Data:' as Info;
SELECT * FROM Products WHERE id = 2;

SELECT 'Product 2 Variations:' as Info;
SELECT * FROM product_variations WHERE product_id = 2;
