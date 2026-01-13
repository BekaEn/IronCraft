# Migration Guide: Smart Locks to Metal Wall Art

This guide will help you migrate your existing smart locks e-commerce platform to a metal wall art e-commerce platform.

## Overview

The migration includes:
- Database schema updates (new product categories and specifications)
- Backend model updates (Product model)
- Frontend updates (HomePage, ProductPage, types)
- Sample wall art products

## Step-by-Step Migration

### 1. Backup Your Current Database

```bash
mysqldump -u smartlocks_user -p smart_locks_ecommerce > backup_$(date +%Y%m%d).sql
```

### 2. Run the Migration Script

```bash
mysql -u smartlocks_user -p smart_locks_ecommerce < database/migrate_to_wallart.sql
```

This script will:
- Create a backup table `products_backup` with your current products
- Drop and recreate the products table with new schema
- Insert sample wall art products
- Update admin user email to admin@wallart.ge

### 3. Restart Backend Server

```bash
cd backend
npm run build
npm run dev
```

### 4. Restart Frontend Server

```bash
cd frontend
npm run dev
```

### 5. Verify the Migration

1. Visit http://localhost:3000
2. Check that the homepage displays wall art content
3. Browse products to see the new wall art items
4. Check product details page for new specifications (dimensions, weight, thickness, etc.)
5. Login as admin (admin@wallart.ge / admin123) to verify admin panel

## Changes Made

### Database Schema
- **Category enum changed**: `fingerprint`, `faceid`, `combo` → `anime`, `abstract`, `nature`, `custom`, `geometric`, `portrait`, `other`
- **New fields added**:
  - `detailedDescription` (JSON)
  - `isOnSale` (BOOLEAN)
  - `salePrice` (DECIMAL)

### Product Specifications
Old fields (smart locks):
- unlockMethods
- batteryLife
- installation
- compatibility

New fields (wall art):
- dimensions (e.g., "60x40 სმ")
- weight (e.g., "1.2 კგ")
- thickness (e.g., "2 მმ")
- finish (e.g., "მატი შავი")
- mounting (e.g., "კედლის საკიდები ჩართულია")
- care (e.g., "მშრალი ქსოვილით გასაწმენდი")

Note: Old fields are still supported for backward compatibility.

### Frontend Changes
- **HomePage**: Updated hero section, features, and call-to-action for wall art
- **ProductPage**: Updated specifications display to show wall art-specific fields
- **Types**: Updated Product interface to include new fields
- **Branding**: Changed from "Smart Locks Georgia" to "Metal Art Georgia"

### Sample Products
The migration includes 6 sample wall art products:
1. ანიმე პერსონაჟი - შავი მეტალის კედლის დეკორი (149.99 GEL)
2. ანიმე გოგონა - მეტალის კედლის ხელოვნება (129.99 GEL, ON SALE: 99.99 GEL)
3. ანიმე პორტრეტი - პრემიუმ მეტალის დეკორი (199.99 GEL)
4. ანიმე გმირი - მეტალის კედლის პანელი (169.99 GEL, ON SALE: 139.99 GEL)
5. აბსტრაქტული ანიმე - მეტალის ხელოვნება (139.99 GEL)
6. ანიმე კოლექცია - მეტალის სეტი (349.99 GEL, ON SALE: 299.99 GEL)

## Rollback Instructions

If you need to rollback the migration:

```bash
# Restore from backup
mysql -u smartlocks_user -p smart_locks_ecommerce < backup_YYYYMMDD.sql

# Or restore from products_backup table (if migration was run)
mysql -u smartlocks_user -p smart_locks_ecommerce << EOF
DROP TABLE IF EXISTS products;
CREATE TABLE products AS SELECT * FROM products_backup;
ALTER TABLE products ADD PRIMARY KEY (id);
ALTER TABLE products MODIFY id INT AUTO_INCREMENT;
EOF
```

## Post-Migration Tasks

1. **Update Product Images**: Replace placeholder images with actual wall art product images
2. **Update Hero Slides**: Create new hero slides for wall art promotions via admin panel
3. **Update Settings**: Configure promo banners and site settings via admin panel
4. **Test Payment Flow**: Verify TBC Bank integration still works with new products
5. **Update Admin Password**: Change default admin password (admin123)
6. **Update Environment Variables**: Review and update any environment-specific settings

## Support

For issues or questions:
- Check the main README.md for general setup instructions
- Review the database schema in `database/schema.sql`
- Check TypeScript types in `frontend/src/types/index.ts`
- Review backend models in `backend/src/models/Product.ts`

## Important Notes

- The database name remains `smart_locks_ecommerce` for backward compatibility
- Admin email changed from admin@smartlocks.ge to admin@wallart.ge
- Default password remains admin123 (CHANGE IN PRODUCTION!)
- All existing orders and users are preserved
- The migration script creates a backup table automatically
