import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { listSlides, getSlideById, createSlide, updateSlide, deleteSlide } from '../controllers/heroSlideController';

const router = Router();

// Public listing
router.get('/', listSlides);
router.get('/:id', getSlideById);

// Admin operations
router.post('/', authenticateToken, requireAdmin, createSlide);
router.put('/:id', authenticateToken, requireAdmin, updateSlide);
router.delete('/:id', authenticateToken, requireAdmin, deleteSlide);

export default router;


