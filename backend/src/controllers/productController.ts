import { Request, Response } from 'express';
import Product from '../models/Product';
import ProductVariation from '../models/ProductVariation';
import { Op, fn, col } from 'sequelize';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const category = (req.query.category as string) || '';
    const search = (req.query.search as string) || '';
    
    const where: any = { isActive: true };
    if (category && category !== 'all') {
      where.category = category;
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows: products } = await Product.findAndCountAll({
      limit,
      offset,
      where,
      order: [['createdAt', 'DESC']],
      include: [{
        model: ProductVariation,
        as: 'variations',
        where: { isActive: true },
        required: false,
      }],
    });
    
    const totalPages = Math.ceil(count / limit);
    
    const sanitized = products.map((p) => {
      const obj = p.toJSON() as any;
      if (obj.salePrice === null) delete obj.salePrice;
      return obj;
    });

    res.json({
      products: sanitized,
      currentPage: page,
      totalPages,
      totalProducts: count,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: (error as Error).message });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idStr = String(id);
    
    // Check if id is numeric or a slug
    let product;
    const includeOptions = {
      include: [{
        model: ProductVariation,
        as: 'variations',
        where: { isActive: true },
        required: false,
      }],
    };
    
    if (/^\d+$/.test(idStr)) {
      // Numeric ID
      product = await Product.findByPk(idStr, includeOptions);
    } else {
      // Slug
      product = await Product.findOne({ 
        where: { slug: idStr },
        ...includeOptions,
      });
    }
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    const obj = (product.toJSON ? product.toJSON() : product) as any;
    if (obj.salePrice === null) delete obj.salePrice;
    res.json(obj);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: (error as Error).message });
  }
};

// DEBUG: Return raw DB value of specifications for a product
export const getProductSpecsRaw = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { sequelize } = require('../config/database');
    const [rows] = await sequelize.query('SELECT specifications FROM products WHERE id = ?', {
      replacements: [parseInt(String(id))],
    });
    const row = Array.isArray(rows) && rows.length ? rows[0] : null;
    res.json({ rawSpecifications: row ? row.specifications : null });
  } catch (error) {
    console.error('Error fetching raw specifications:', error);
    res.status(500).json({ message: 'Error fetching raw specifications', error: (error as Error).message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    console.log('Create Product - Content-Type:', req.headers['content-type']);
    const isMultipart = (req.headers['content-type'] || '').includes('multipart/form-data');
    // When using upload.any(), fields may come via req.body but files can be any field name.
    const body = (req as any).body || {};

    let features: any[] = [];
    let detailedDescription: any[] = [];
    let images: string[] = [];
    let specifications: any = {
      unlockMethods: [],
      material: '',
      batteryLife: '',
      installation: '',
      compatibility: []
    };

    if (isMultipart) {
      try { features = body.features ? JSON.parse(body.features) : []; } catch { features = []; }
      try { detailedDescription = body.detailedDescription ? JSON.parse(body.detailedDescription) : []; } catch { detailedDescription = []; }
      try { specifications = body.specifications ? JSON.parse(body.specifications) : specifications; } catch { /* keep defaults */ }
      try { images = body.images ? JSON.parse(body.images) : []; } catch { images = []; }

      if ((req as any).files && Array.isArray((req as any).files)) {
        const uploaded = ((req as any).files as Express.Multer.File[]).map(f => `/uploads/${f.filename}`);
        images = [...images, ...uploaded];
      }
    } else {
      features = body.features || [];
      detailedDescription = body.detailedDescription || [];
      specifications = body.specifications || specifications;
      images = body.images || [];
    }

    // Auto-generate slug from name if not provided
    const slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const product = await Product.create({
      name: body.name,
      slug,
      description: body.description,
      detailedDescription,
      price: Number(body.price),
      category: body.category,
      thumbnail: body.thumbnail || null,
      features,
      specifications,
      images,
      isActive: true,
      isOnSale: body.isOnSale === 'true' || body.isOnSale === true || false,
      salePrice: body.salePrice !== undefined && body.salePrice !== null && body.salePrice !== ''
        ? Number(body.salePrice)
        : null,
    });

    // Handle variations if provided
    let variations = [];
    if (body.variations) {
      try {
        const variationsData = isMultipart ? JSON.parse(body.variations) : body.variations;
        if (Array.isArray(variationsData) && variationsData.length > 0) {
          const ProductVariation = require('../models/ProductVariation').default;
          for (const varData of variationsData) {
            // Filter out empty image URLs
            const filteredImages = Array.isArray(varData.images) 
              ? varData.images.filter((img: string) => img && img.trim() !== '')
              : [];
            
            const variation = await ProductVariation.create({
              productId: product.id,
              color: varData.color,
              size: varData.size,
              price: varData.price,
              salePrice: varData.salePrice || null,
              images: filteredImages,
              isActive: true,
            });
            variations.push(variation);
          }
          console.log(`Created ${variations.length} variations for product ${product.id}`);
        }
      } catch (varError) {
        console.error('Error creating variations:', varError);
      }
    }

    const response = product.toJSON ? product.toJSON() : product;
    res.status(201).json({ ...response, variations });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: (error as Error).message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idNum = parseInt(String(id));
    
    console.log('=== UPDATE PRODUCT ===');
    console.log('ID:', id);
    console.log('Request body:', req.body);

    // Get existing product first
    const existingProduct = await Product.findByPk(idNum);
    if (!existingProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Update specifications via instance save to ensure JSON change detection
    if (req.body.specifications !== undefined) {
      const specs = req.body.specifications;
      console.log('Updating full specifications object');
      try {
        const { sequelize } = require('../config/database');
        const [result] = await sequelize.query(
          'UPDATE products SET specifications = CAST(? AS JSON), updatedAt = NOW() WHERE id = ?;',
          { replacements: [JSON.stringify(specs), idNum] }
        );
        console.log('RAW SQL update result:', result);
      } catch (e) {
        console.warn('RAW SQL update failed, falling back to instance.save()', e);
        existingProduct.set('specifications', specs);
        await existingProduct.save({ fields: ['specifications'] });
      }
      // Optionally update sale fields in the same request
      if (req.body.isOnSale !== undefined || req.body.salePrice !== undefined) {
        const saleData: any = {};
        if (req.body.isOnSale !== undefined) {
          saleData.isOnSale = req.body.isOnSale === 'true' || req.body.isOnSale === true;
        }
        if (req.body.salePrice !== undefined) {
          saleData.salePrice = req.body.salePrice !== '' ? Number(req.body.salePrice) : null;
        }
        if (Object.keys(saleData).length) {
          await existingProduct.update(saleData);
        }
      }
      await existingProduct.reload();
    }

    // Handle all field updates including specifications
    const updateData: any = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.detailedDescription !== undefined) updateData.detailedDescription = req.body.detailedDescription;
    if (req.body.price !== undefined) updateData.price = Number(req.body.price);
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.thumbnail !== undefined) updateData.thumbnail = req.body.thumbnail || null;
    if (req.body.features !== undefined) updateData.features = req.body.features;
    if (req.body.images !== undefined) {
      console.log('Updating images from:', existingProduct.get('images'), 'to:', req.body.images);
      updateData.images = req.body.images;
    }

    // Merge individual specification fields if provided
    const hasSpecPart = ['material','batteryLife','installation','compatibility','unlockMethods']
      .some((k) => Object.prototype.hasOwnProperty.call(req.body, k));
    if (hasSpecPart) {
      const currentSpecs = (existingProduct.get('specifications') as any) || {
        unlockMethods: [],
        material: '',
        batteryLife: '',
        installation: '',
        compatibility: []
      };
      const merged = {
        unlockMethods: req.body.unlockMethods ?? currentSpecs.unlockMethods,
        material: req.body.material ?? currentSpecs.material,
        batteryLife: req.body.batteryLife ?? currentSpecs.batteryLife,
        installation: req.body.installation ?? currentSpecs.installation,
        compatibility: req.body.compatibility ?? currentSpecs.compatibility,
      };
      console.log('Merging partial specifications:', merged);
      updateData.specifications = merged;
    }

    // Sale fields can be updated alone
    const saleData: any = {};
    if (req.body.isOnSale !== undefined) {
      saleData.isOnSale = req.body.isOnSale === 'true' || req.body.isOnSale === true;
    }
    if (req.body.salePrice !== undefined) {
      saleData.salePrice = req.body.salePrice !== '' ? Number(req.body.salePrice) : null;
    }

    if (Object.keys(updateData).length > 0 || Object.keys(saleData).length > 0) {
      console.log('Updating product with data:', { ...updateData, ...saleData });
      await existingProduct.update({ ...updateData, ...saleData });
      await existingProduct.reload();
      console.log('Product after update:', existingProduct.get('images'));
    }

    // Handle variations if provided
    let variations = [];
    console.log('=== VARIATION UPDATE DEBUG ===');
    console.log('req.body.variations exists:', !!req.body.variations);
    console.log('req.body.variations type:', typeof req.body.variations);
    console.log('req.body.variations value:', JSON.stringify(req.body.variations, null, 2));
    
    if (req.body.variations) {
      try {
        const variationsData = Array.isArray(req.body.variations) ? req.body.variations : JSON.parse(req.body.variations);
        console.log('Parsed variationsData length:', variationsData?.length);
        
        if (Array.isArray(variationsData) && variationsData.length > 0) {
          const ProductVariation = require('../models/ProductVariation').default;
          
          // Delete existing variations for this product
          console.log('Deleting existing variations for product:', idNum);
          const deleteResult = await ProductVariation.destroy({ where: { productId: idNum } });
          console.log('Deleted variations count:', deleteResult);
          
          // Create new variations
          for (const varData of variationsData) {
            // Filter out empty image URLs
            const filteredImages = Array.isArray(varData.images) 
              ? varData.images.filter((img: string) => img && img.trim() !== '')
              : [];
            
            console.log(`Creating variation: ${varData.color}-${varData.size} with ${filteredImages.length} images`);
            
            const variation = await ProductVariation.create({
              productId: idNum,
              color: varData.color,
              size: varData.size,
              price: varData.price,
              salePrice: varData.salePrice || null,
              images: filteredImages,
              isActive: true,
            });
            variations.push(variation);
          }
          console.log(`✅ Updated ${variations.length} variations for product ${idNum}`);
        }
      } catch (varError) {
        console.error('❌ Error updating variations:', varError);
      }
    } else {
      console.log('⚠️ No variations in request body');
    }

    const obj2 = (existingProduct.toJSON ? existingProduct.toJSON() : existingProduct) as any;
    if (obj2.salePrice === null) delete obj2.salePrice;
    res.json({ ...obj2, variations });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: (error as Error).message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const deleted = await Product.destroy({
      where: { id },
    });
    
    if (deleted === 0) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: (error as Error).message });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await Product.findAll({
      attributes: [
        'category',
        [fn('COUNT', col('category')), 'count']
      ],
      where: { isActive: true },
      group: ['category'],
      order: [['category', 'ASC']],
    });
    const categories = rows.map((r: any) => ({
      category: r.get('category'),
      count: Number(r.get('count') || 0),
    })).filter(c => !!c.category);
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: (error as Error).message });
  }
};
