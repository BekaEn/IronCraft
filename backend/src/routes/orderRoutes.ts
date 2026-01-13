import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrderStats
} from '../controllers/orderController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/', createOrder); // Create order (no auth required for guest orders)

// Protected routes (admin only)
router.get('/', authenticateToken, requireAdmin, getAllOrders);
router.get('/stats', authenticateToken, requireAdmin, getOrderStats);
router.get('/:id', authenticateToken, requireAdmin, getOrderById);
router.put('/:id', authenticateToken, requireAdmin, updateOrderStatus);
router.delete('/:id', authenticateToken, requireAdmin, deleteOrder);

export default router;
