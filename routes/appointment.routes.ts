import { Router } from 'express';
import catchAsync from '../utils/catchAsync';
import controller from '../controllers/appointment.controller';

const router = Router();

const { getAllAppointments, getAppointment, createAppointment, updateAppointment } = controller;

router.get('/', catchAsync(getAllAppointments));
router.get('/:id', catchAsync(getAppointment));

router.post('/', catchAsync(createAppointment));

router.patch('/:id', catchAsync(updateAppointment));

export default router;
