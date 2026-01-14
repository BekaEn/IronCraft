import express from 'express';
import multer from 'multer';
import path from 'path';
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

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
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

// Admin routes (PUT and DELETE must come before GET /:id to avoid conflicts)
// Accept multipart for product creation (robust: any fields/files)
router.post('/', authenticateToken, requireAdmin, upload.any(), createProduct);
router.put('/:id', authenticateToken, requireAdmin, updateProduct);
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
