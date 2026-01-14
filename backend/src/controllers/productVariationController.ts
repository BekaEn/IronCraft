import { Request, Response } from 'express';
import ProductVariation from '../models/ProductVariation';
import Product from '../models/Product';

// Get all variations for a product
export const getProductVariations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    
    const variations = await ProductVariation.findAll({
      where: { 
        productId: String(productId),
        isActive: true 
      },
      order: [['color', 'ASC'], ['size', 'ASC']],
    });
    
    res.json(variations);
  } catch (error) {
    console.error('Error fetching product variations:', error);
    res.status(500).json({ message: 'Error fetching variations', error: (error as Error).message });
  }
};

// Create a new variation
export const createProductVariation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { color, size, price, salePrice, images } = req.body;
    
    // Verify product exists
    const product = await Product.findByPk(String(productId));
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    // Check if variation already exists
    const existing = await ProductVariation.findOne({
      where: { productId: String(productId), color, size }
    });
    
    if (existing) {
      res.status(400).json({ message: 'Variation with this color and size already exists' });
      return;
    }
    
    const variation = await ProductVariation.create({
      productId: Number(productId),
      color,
      size,
      price,
      salePrice: salePrice || null,
      images: images || [],
      isActive: true,
    });
    
    res.status(201).json(variation);
  } catch (error) {
    console.error('Error creating product variation:', error);
    res.status(500).json({ message: 'Error creating variation', error: (error as Error).message });
  }
};

// Update a variation
export const updateProductVariation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { color, size, price, salePrice, images, isActive } = req.body;
    
    const variation = await ProductVariation.findByPk(String(id));
    if (!variation) {
      res.status(404).json({ message: 'Variation not found' });
      return;
    }
    
    await variation.update({
      color: color !== undefined ? color : variation.color,
      size: size !== undefined ? size : variation.size,
      price: price !== undefined ? price : variation.price,
      salePrice: salePrice !== undefined ? salePrice : variation.salePrice,
      images: images !== undefined ? images : variation.images,
      isActive: isActive !== undefined ? isActive : variation.isActive,
    });
    
    res.json(variation);
  } catch (error) {
    console.error('Error updating product variation:', error);
    res.status(500).json({ message: 'Error updating variation', error: (error as Error).message });
  }
};

// Delete a variation
export const deleteProductVariation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const variation = await ProductVariation.findByPk(String(id));
    if (!variation) {
      res.status(404).json({ message: 'Variation not found' });
      return;
    }
    
    await variation.destroy();
    res.json({ message: 'Variation deleted successfully' });
  } catch (error) {
    console.error('Error deleting product variation:', error);
    res.status(500).json({ message: 'Error deleting variation', error: (error as Error).message });
  }
};

// Bulk create/update variations for a product
export const bulkUpsertVariations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { variations } = req.body;
    
    // Verify product exists
    const product = await Product.findByPk(String(productId));
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    if (!Array.isArray(variations)) {
      res.status(400).json({ message: 'Variations must be an array' });
      return;
    }
    
    const results = [];
    
    for (const varData of variations) {
      const { id, color, size, price, salePrice, images, isActive } = varData;
      
      if (id) {
        // Update existing
        const variation = await ProductVariation.findByPk(String(id));
        if (variation) {
          await variation.update({
            color,
            size,
            price,
            salePrice: salePrice || null,
            images: images || [],
            isActive: isActive !== undefined ? isActive : true,
          });
          results.push(variation);
        }
      } else {
        // Create new
        const variation = await ProductVariation.create({
          productId: Number(productId),
          color,
          size,
          price,
          salePrice: salePrice || null,
          images: images || [],
          isActive: isActive !== undefined ? isActive : true,
        });
        results.push(variation);
      }
    }
    
    res.json(results);
  } catch (error) {
    console.error('Error bulk upserting variations:', error);
    res.status(500).json({ message: 'Error updating variations', error: (error as Error).message });
  }
};
