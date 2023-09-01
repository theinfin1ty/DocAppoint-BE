import { Router } from 'express';
import controller from '../controllers/appointment.controller';
import auth from '../middlewares/auth.middleware';

const router = Router();

const { getAllAppointments, getAppointment, createAppointment, updateAppointment } = controller;

router.get('/', auth({ roles: ['doctor', 'client'] }), getAllAppointments);
router.get('/:id', auth({ roles: ['doctor', 'client'] }), getAppointment);

router.post('/', auth({ roles: ['doctor', 'client'] }), createAppointment);

router.patch('/:id', auth({ roles: ['doctor', 'client'] }), updateAppointment);

export default router;
