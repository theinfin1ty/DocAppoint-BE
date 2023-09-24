import { Request, Response } from 'express';
import moment from 'moment-timezone';
import Appointment from '../models/appointment.model';

const getAllAppointments = async (req: any, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { type } = req.query;
    const where: any = {};

    if (type === 'upcoming') {
      where.date = {
        $gte: moment().startOf('day').toDate(),
      };
      where.status = 'active';
    }
    if (req.user?.role === 'client') {
      where.user = req.user?._id;
    }
    const appointments = await Appointment.find(where).skip(skip).limit(limit).sort({ date: 1 });

    const response = {
      data: appointments,
      pagination: {
        total: await Appointment.countDocuments({}),
        page,
        count: appointments.length,
      },
    };

    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Something went wrong!' });
  }
};

const createAppointment = async (req: any, res: Response) => {
  try {
    const appointment: any = new Appointment({ ...req.body });
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
    const { status, slot, name, age, weight, date, purpose } = req.body;
    const appointment = await Appointment.findById(id);
    if (appointment?.status != 'active') {
      return res.status(400).send({ error: 'Appointment is not Active' });
    }

    appointment.status = status;
    appointment.slot = slot;
    appointment.name = name;
    appointment.age = age;
    appointment.weight = weight;
    appointment.date = date;
    appointment.purpose = purpose;

    await appointment.save();
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
