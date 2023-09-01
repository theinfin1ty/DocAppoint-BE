import { Router } from 'express';
import userRoutes from './user.routes';
import appointmentRoutes from './appointment.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/appointments', appointmentRoutes);

export default router;
