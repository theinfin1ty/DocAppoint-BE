import { Router } from 'express';
import userRoutes from './user.routes';
import appointmentRoutes from './appointment.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/appointments', appointmentRoutes);

export default router;
