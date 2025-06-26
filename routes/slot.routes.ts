import { Router } from 'express';
import slotController from '../controllers/slot.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, slotController.getDoctorSlots);
router.get('/available', authMiddleware, slotController.getAvailableSlots);
router.put('/settings', authMiddleware, slotController.updateSlotSettings);
router.post('/block', authMiddleware, slotController.blockSlot);
router.post('/unblock', authMiddleware, slotController.unblockSlot);

export default router;