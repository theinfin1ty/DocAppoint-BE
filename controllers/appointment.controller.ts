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
      where.status = { $in: ['pending', 'confirmed'] };
    }
    if (req.user?.role === 'client') {
      where.user = req.user?._id;
    } else if (req.user?.role === 'doctor') {
      where.doctor = req.user?._id;
    }
    const appointments = await Appointment.find(where).skip(skip).limit(limit).sort({ date: 1 });

    const response = {
      data: appointments,
      pagination: {
        total: await Appointment.countDocuments(where),
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
    // For now, assign to first doctor found or leave empty
    // In a real system, you'd have logic to assign to specific doctors
    const User = require('../models/user.model').default;
    const doctor = await User.findOne({ role: 'doctor' });
    if (doctor) {
      appointment.doctor = doctor._id;
    }
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

    if (!appointment) {
      return res.status(404).send({ error: 'Appointment not found!' });
    }

    if (!['pending', 'confirmed'].includes(appointment?.status as string)) {
      return res.status(400).send({ error: 'Appointment cannot be modified' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['status', 'slot', 'name', 'age', 'weight', 'date', 'purpose', 'remark'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }

    for (let update of updates) {
      appointment[update] = req.body[update];
    }

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
