import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import CustomOrder from '../models/CustomOrder';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/custom-orders');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'custom-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Create a new custom order
router.post('/', upload.single('designImage'), async (req, res) => {
  try {
    const { customerName, email, phone, width, height, quantity, additionalDetails } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Design image is required' });
    }

    if (!customerName || !email || !phone || !width || !height || !quantity) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const designImage = `/uploads/custom-orders/${req.file.filename}`;

    const customOrder = await CustomOrder.create({
      customerName,
      email,
      phone,
      designImage,
      width,
      height,
      quantity: parseInt(quantity),
      additionalDetails,
      status: 'pending'
    });

    return res.status(201).json({
      message: 'Custom order submitted successfully',
      order: customOrder
    });
  } catch (error: any) {
    console.error('Error creating custom order:', error);
    return res.status(500).json({ message: 'Failed to submit custom order', error: error.message });
  }
});

// Get all custom orders (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);
    
    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await CustomOrder.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      orders: rows,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
      totalOrders: count
    });
  } catch (error: any) {
    console.error('Error fetching custom orders:', error);
    return res.status(500).json({ message: 'Failed to fetch custom orders', error: error.message });
  }
});

// Get a single custom order by ID (admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const order = await CustomOrder.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Custom order not found' });
    }

    return res.json(order);
  } catch (error: any) {
    console.error('Error fetching custom order:', error);
    return res.status(500).json({ message: 'Failed to fetch custom order', error: error.message });
  }
});

// Update custom order status and details (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, estimatedPrice, adminNotes } = req.body;
    
    const order = await CustomOrder.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Custom order not found' });
    }

    await order.update({
      ...(status && { status }),
      ...(estimatedPrice !== undefined && { estimatedPrice }),
      ...(adminNotes !== undefined && { adminNotes })
    });

    return res.json({
      message: 'Custom order updated successfully',
      order
    });
  } catch (error: any) {
    console.error('Error updating custom order:', error);
    return res.status(500).json({ message: 'Failed to update custom order', error: error.message });
  }
});

// Delete custom order (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const order = await CustomOrder.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Custom order not found' });
    }

    // Delete the image file
    const imagePath = path.join(__dirname, '../..', order.designImage);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await order.destroy();

    return res.json({ message: 'Custom order deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting custom order:', error);
    return res.status(500).json({ message: 'Failed to delete custom order', error: error.message });
  }
});

export default router;
