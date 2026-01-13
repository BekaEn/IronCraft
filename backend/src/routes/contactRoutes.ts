import { Router } from 'express';
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats
} from '../controllers/contactController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public route - Create new contact form submission
router.post('/', createContact);

// Admin only routes
router.get('/', authenticateToken, requireAdmin, getAllContacts);
router.get('/stats', authenticateToken, requireAdmin, getContactStats);
router.get('/:id', authenticateToken, requireAdmin, getContactById);
router.put('/:id', authenticateToken, requireAdmin, updateContactStatus);
router.delete('/:id', authenticateToken, requireAdmin, deleteContact);

export default router;
