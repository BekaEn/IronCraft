# Product Variations System - Implementation Guide

## Overview
This guide explains the new product variations system that replaces the simple stock tracking with a flexible color/size variation system where each variation has its own price and images.

## Database Changes

### Migration Required
Run the SQL migration file: `database/add_product_variations.sql`

This will:
1. Create the `product_variations` table
2. Remove the `stock` column from `products` table
3. Add necessary indexes

### New Table Structure: `product_variations`
```sql
- id: INT (Primary Key)
- product_id: INT (Foreign Key to products)
- color: VARCHAR(100)
- size: VARCHAR(100)
- price: DECIMAL(10,2)
- sale_price: DECIMAL(10,2) (nullable)
- images: JSON (array of image paths)
- is_active: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- UNIQUE constraint on (product_id, color, size)
```

## Backend Changes

### New Files Created
1. **`backend/src/models/ProductVariation.ts`** - Sequelize model for variations
2. **`backend/src/controllers/productVariationController.ts`** - CRUD operations for variations

### Updated Files
1. **`backend/src/models/Product.ts`** - Removed `stock` field
2. **`backend/src/controllers/productController.ts`** - Added variations to product queries
3. **`backend/src/routes/productRoutes.ts`** - Added variation endpoints

### API Endpoints

#### Get Product Variations
```
GET /api/products/:productId/variations
Response: Array of variations for the product
```

#### Create Variation
```
POST /api/products/:productId/variations
Auth: Required (Admin)
Body: {
  color: string,
  size: string,
  price: number,
  salePrice?: number,
  images: string[]
}
```

#### Update Variation
```
PUT /api/products/variations/:id
Auth: Required (Admin)
Body: {
  color?: string,
  size?: string,
  price?: number,
  salePrice?: number,
  images?: string[],
  isActive?: boolean
}
```

#### Delete Variation
```
DELETE /api/products/variations/:id
Auth: Required (Admin)
```

#### Bulk Upsert Variations
```
POST /api/products/:productId/variations/bulk
Auth: Required (Admin)
Body: {
  variations: [
    {
      id?: number,  // If provided, updates existing; otherwise creates new
      color: string,
      size: string,
      price: number,
      salePrice?: number,
      images: string[],
      isActive?: boolean
    }
  ]
}
```

## Frontend Changes

### Updated Files
1. **`frontend/src/pages/ProductPage.tsx`**
   - Removed stock status display
   - Removed stock validation from add to cart
   - Removed quantity limits based on stock

2. **`frontend/src/components/Layout/MobileBottomNav.tsx`**
   - Removed stock validation from Buy Now button

### What Still Needs to Be Done

#### 1. Admin Panel Updates
You need to update `frontend/src/components/Admin/ProductForm.tsx` to:
- Remove stock input field
- Add variation management UI with:
  - List of existing variations
  - Add new variation button
  - For each variation:
    - Color input/selector
    - Size input/selector
    - Price input
    - Sale price input (optional)
    - Image upload for that specific variation
    - Delete button

#### 2. Product Display Page Enhancement
Update `frontend/src/pages/ProductPage.tsx` to:
- Add color selector (buttons or dropdown)
- Add size selector (buttons or dropdown)
- Display selected variation's price
- Display selected variation's images
- Update main product image when variation changes
- Store selected variation in component state

Example implementation structure:
```tsx
const [selectedColor, setSelectedColor] = useState<string>('');
const [selectedSize, setSelectedSize] = useState<string>('');
const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);

// Get unique colors and sizes from variations
const colors = [...new Set(product.variations?.map(v => v.color))];
const sizes = [...new Set(product.variations?.map(v => v.size))];

// Update selected variation when color/size changes
useEffect(() => {
  if (selectedColor && selectedSize && product.variations) {
    const variation = product.variations.find(
      v => v.color === selectedColor && v.size === selectedSize
    );
    setSelectedVariation(variation || null);
  }
}, [selectedColor, selectedSize, product.variations]);
```

#### 3. Frontend Type Updates
Create/update types in `frontend/src/types/` or inline:
```typescript
interface ProductVariation {
  id: number;
  productId: number;
  color: string;
  size: string;
  price: number;
  salePrice?: number;
  images: string[];
  isActive: boolean;
}

interface Product {
  // ... existing fields
  variations?: ProductVariation[];
  // Remove: stock: number;
}
```

#### 4. Cart Integration
Update cart logic to store selected variation info with cart items so users know which color/size they're purchasing.

## Migration Steps

### For Existing Products
1. Run the database migration
2. For each existing product, create at least one default variation:
   - Color: "Default" or actual color
   - Size: "Standard" or actual size
   - Price: Copy from product.price
   - Images: Copy from product.images

### SQL to Create Default Variations
```sql
INSERT INTO product_variations (product_id, color, size, price, sale_price, images, is_active)
SELECT 
  id,
  'Default' as color,
  'Standard' as size,
  price,
  sale_price,
  images,
  true
FROM products
WHERE is_active = true;
```

## Testing Checklist

- [ ] Database migration runs successfully
- [ ] Backend returns variations with products
- [ ] Admin can create new variations
- [ ] Admin can update existing variations
- [ ] Admin can delete variations
- [ ] Product page displays variations
- [ ] Users can select color and size
- [ ] Price updates when variation changes
- [ ] Images update when variation changes
- [ ] Add to cart works with selected variation
- [ ] Cart displays correct variation info
- [ ] Checkout includes variation details

## Next Steps

1. **Run the database migration** on your Railway MySQL database
2. **Create default variations** for existing products
3. **Update the admin panel** to manage variations
4. **Update the product display page** to show and select variations
5. **Test the complete flow** from browsing to checkout
6. **Deploy to Railway** and verify everything works in production

## Notes

- The base product still has a `price` field - this can serve as the "starting from" price for display in product lists
- Each variation can have its own set of images specific to that color/size combination
- The unique constraint ensures you can't accidentally create duplicate variations
- Variations can be marked as inactive without deleting them
