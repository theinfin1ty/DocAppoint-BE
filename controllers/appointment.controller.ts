import { Request, Response } from 'express';
import moment from 'moment-timezone';
import Appointment from '../models/appointment.model';

const getAllAppointments = async (req: any, res: Response) => {
  const { today } = req.headers;
  const appointments = await Appointment.find({
    ...(req.user?.role === 'client' && { user: req.user?._id }),
    ...(today && { date: moment().startOf('day').toISOString() }),
  });
  return res.status(200).send(appointments);
};

const createAppointment = async (req: any, res: Response) => {
  const appointment: any = new Appointment(req.body.appointment);
  appointment.user = req.user?._id;
  await appointment.save();
  return res.status(200).send(appointment);
};

const getAppointment = async (req: Request, res: Response) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).send({ error: 'Appointment not found!' });
  }
  return res.status(200).send(appointment);
};

const updateAppointment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (appointment?.status != 'active') {
    return res.status(400).send({ error: 'Appointment is not Active' });
  }

  await Appointment.findByIdAndUpdate(id, {
    ...req.body.appointment,
  });
  return res.status(200).send(appointment);
};

export default {
  getAllAppointments,
  createAppointment,
  getAppointment,
  updateAppointment,
};
