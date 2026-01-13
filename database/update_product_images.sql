-- Update product images with real anime metal wall art photos
-- This script replaces the existing product images with actual product photos

-- Update Product 1 - Anime Girl Wall Art
UPDATE products 
SET images = JSON_ARRAY(
  '/uploads/products/anime-girl-1.jpg',
  '/uploads/products/anime-girl-1.jpg',
  '/uploads/products/anime-girl-1.jpg'
)
WHERE id = 1;

-- Update Product 2 - Anime Face Portrait
UPDATE products 
SET images = JSON_ARRAY(
  '/uploads/products/anime-face-1.jpg',
  '/uploads/products/anime-face-1.jpg',
  '/uploads/products/anime-face-1.jpg'
)
WHERE id = 2;

-- Update Product 3 - Anime Profile Silhouette
UPDATE products 
SET images = JSON_ARRAY(
  '/uploads/products/anime-profile-1.jpg',
  '/uploads/products/anime-profile-1.jpg',
  '/uploads/products/anime-profile-1.jpg'
)
WHERE id = 3;

-- Update Product 4 - Naruto Character Art
UPDATE products 
SET images = JSON_ARRAY(
  '/uploads/products/anime-naruto-1.jpg',
  '/uploads/products/anime-naruto-1.jpg',
  '/uploads/products/anime-naruto-1.jpg'
)
WHERE id = 4;

-- Verify the updates
SELECT id, name, images FROM products WHERE id IN (1, 2, 3, 4);
