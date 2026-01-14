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

    const product = await Product.create({
      name: body.name,
      slug: body.slug,
      description: body.description,
      detailedDescription,
      price: Number(body.price),
      category: body.category,
      features,
      specifications,
      images,
      isActive: true,
      isOnSale: body.isOnSale === 'true' || body.isOnSale === true || false,
      salePrice: body.salePrice !== undefined && body.salePrice !== null && body.salePrice !== ''
        ? Number(body.salePrice)
        : null,
    });
    res.status(201).json(product);
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
      const obj = (existingProduct.toJSON ? existingProduct.toJSON() : existingProduct) as any;
      if (obj.salePrice === null) delete obj.salePrice;
      res.json(obj);
      return;
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
      existingProduct.set('specifications', merged);
      await existingProduct.save({ fields: ['specifications'] });
      await existingProduct.reload();
      res.json(existingProduct);
      return;
    }

    // Handle other field updates
    const updateData: any = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.detailedDescription !== undefined) updateData.detailedDescription = req.body.detailedDescription;
    if (req.body.price !== undefined) updateData.price = Number(req.body.price);
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.features !== undefined) updateData.features = req.body.features;
    if (req.body.images !== undefined) updateData.images = req.body.images;

    // Sale fields can be updated alone
    const saleData: any = {};
    if (req.body.isOnSale !== undefined) {
      saleData.isOnSale = req.body.isOnSale === 'true' || req.body.isOnSale === true;
    }
    if (req.body.salePrice !== undefined) {
      saleData.salePrice = req.body.salePrice !== '' ? Number(req.body.salePrice) : null;
    }

    if (Object.keys(updateData).length > 0 || Object.keys(saleData).length > 0) {
      await existingProduct.update({ ...updateData, ...saleData });
    }

    const obj2 = (existingProduct.toJSON ? existingProduct.toJSON() : existingProduct) as any;
    if (obj2.salePrice === null) delete obj2.salePrice;
    res.json(obj2);
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
