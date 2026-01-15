import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import {
  getProducts,
  getProductById,
  getProductSpecsRaw,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} from '../controllers/productController';
import {
  getProductVariations,
  createProductVariation,
  updateProductVariation,
  deleteProductVariation,
  bulkUpsertVariations
} from '../controllers/productVariationController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Get upload directory - use Railway Volume if available
const getUploadDir = () => {
  const volumePath = process.env.RAILWAY_VOLUME_MOUNT_PATH;
  if (volumePath) {
    return path.join(volumePath, 'products');
  }
  return path.join(__dirname, '../../uploads/products');
};

// Configure multer for image uploads - same approach as gallery
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = getUploadDir();
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// Image upload endpoint - returns the uploaded file path
router.post('/upload-image', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    // Return the path that can be used in the frontend
    const imagePath = `/uploads/products/${req.file.filename}`;
    console.log('Product image uploaded:', imagePath);
    
    return res.json({
      message: 'Image uploaded successfully',
      imagePath,
      filename: req.file.filename
    });
  } catch (error: any) {
    console.error('Error uploading product image:', error);
    return res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
});

// Admin routes (PUT and DELETE must come before GET /:id to avoid conflicts)
// Accept multipart for product creation (robust: any fields/files)
router.post('/', authenticateToken, requireAdmin, upload.any(), createProduct);
router.put('/:id', authenticateToken, requireAdmin, upload.any(), updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

// Product variation routes (must come before /:id to avoid conflicts)
router.get('/:productId/variations', getProductVariations);
router.post('/:productId/variations', authenticateToken, requireAdmin, upload.any(), createProductVariation);
router.post('/:productId/variations/bulk', authenticateToken, requireAdmin, bulkUpsertVariations);
router.put('/variations/:id', authenticateToken, requireAdmin, updateProductVariation);
router.delete('/variations/:id', authenticateToken, requireAdmin, deleteProductVariation);

// Public routes
router.get('/', getProducts);
router.get('/categories/list', getCategories);
router.get('/:id', getProductById);
// Debug route to inspect raw JSON stored in DB for specs
router.get('/:id/specs-raw', authenticateToken, requireAdmin, getProductSpecsRaw);

export default router;
