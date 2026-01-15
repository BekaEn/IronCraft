import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import GalleryImage from '../models/GalleryImage';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Configure multer for image upload - same as custom orders
const getUploadDir = () => {
  const volumePath = process.env.RAILWAY_VOLUME_MOUNT_PATH;
  if (volumePath) {
    return path.join(volumePath, 'gallery');
  }
  return path.join(__dirname, '../../uploads/gallery');
};

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
    cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
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

// Get all gallery images (public)
router.get('/', async (req, res) => {
  try {
    const { includeInactive } = req.query;
    
    const whereClause: any = {};
    if (!includeInactive) {
      whereClause.isActive = true;
    }

    const images = await GalleryImage.findAll({
      where: whereClause,
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
    });

    return res.json(images);
  } catch (error: any) {
    console.error('Error fetching gallery images:', error);
    return res.status(500).json({ message: 'Failed to fetch gallery images', error: error.message });
  }
});

// Upload new gallery image (admin only)
router.post('/', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Get the highest sort order
    const maxSortOrder = await GalleryImage.max('sortOrder') || 0;

    const imagePath = `/uploads/gallery/${req.file.filename}`;

    const galleryImage = await GalleryImage.create({
      title,
      description,
      imagePath,
      sortOrder: (maxSortOrder as number) + 1,
      isActive: true
    });

    return res.status(201).json({
      message: 'Gallery image uploaded successfully',
      image: galleryImage
    });
  } catch (error: any) {
    console.error('Error uploading gallery image:', error);
    return res.status(500).json({ message: 'Failed to upload gallery image', error: error.message });
  }
});

// Update gallery image (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, sortOrder, isActive } = req.body;
    
    const image = await GalleryImage.findByPk(String(req.params.id));
    
    if (!image) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }

    await image.update({
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(sortOrder !== undefined && { sortOrder }),
      ...(isActive !== undefined && { isActive })
    });

    return res.json({
      message: 'Gallery image updated successfully',
      image
    });
  } catch (error: any) {
    console.error('Error updating gallery image:', error);
    return res.status(500).json({ message: 'Failed to update gallery image', error: error.message });
  }
});

// Reorder gallery images (admin only)
router.put('/reorder/bulk', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, sortOrder }

    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ message: 'Orders array is required' });
    }

    for (const order of orders) {
      await GalleryImage.update(
        { sortOrder: order.sortOrder },
        { where: { id: order.id } }
      );
    }

    return res.json({ message: 'Gallery order updated successfully' });
  } catch (error: any) {
    console.error('Error reordering gallery:', error);
    return res.status(500).json({ message: 'Failed to reorder gallery', error: error.message });
  }
});

// Delete gallery image (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const image = await GalleryImage.findByPk(String(req.params.id));
    
    if (!image) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }

    // Delete the image file
    const filename = path.basename(image.imagePath);
    const imagePath = path.join(getUploadDir(), filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await image.destroy();

    return res.json({ message: 'Gallery image deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting gallery image:', error);
    return res.status(500).json({ message: 'Failed to delete gallery image', error: error.message });
  }
});

export default router;
