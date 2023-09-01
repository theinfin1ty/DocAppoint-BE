import { Request, Response } from 'express';
import moment from 'moment-timezone';
import Appointment from '../models/appointment.model';

const getAllAppointments = async (req: any, res: Response) => {
  try {
    const { today } = req.headers;
    const appointments = await Appointment.find({
      ...(req.user?.role === 'client' && { user: req.user?._id }),
      ...(today && { date: moment().startOf('day').toISOString() }),
    });
    return res.status(200).send(appointments);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Something went wrong!' });
  }
};

const createAppointment = async (req: any, res: Response) => {
  try {
    const appointment: any = new Appointment(req.body.appointment);
    appointment.user = req.user?._id;
    await appointment.save();
    return res.status(200).send(appointment);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Something went wrong!' });
  }
};

const getAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).send({ error: 'Appointment not found!' });
    }
    return res.status(200).send(appointment);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Something went wrong!' });
  }
};

const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (appointment?.status != 'active') {
      return res.status(400).send({ error: 'Appointment is not Active' });
    }

    await Appointment.findByIdAndUpdate(id, {
      ...req.body.appointment,
    });
    return res.status(200).send(appointment);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Something went wrong!' });
  }
};

export default {
  getAllAppointments,
  createAppointment,
  getAppointment,
  updateAppointment,
};
