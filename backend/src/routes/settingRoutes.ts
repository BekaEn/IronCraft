import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getSettings);
router.put('/', authenticateToken, requireAdmin, updateSettings);

export default router;

