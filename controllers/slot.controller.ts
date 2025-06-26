import { Request, Response } from 'express';
import { SlotSettings, BlockedSlot } from '../models/slot.model';
import Appointment from '../models/appointment.model';

const getDoctorSlots = async (req: any, res: Response) => {
  try {
    const doctorId = req.user?._id;

    const settings = await SlotSettings.findOne({ doctor: doctorId });
    const blockedSlots = await BlockedSlot.find({ doctor: doctorId });
    const appointments = await Appointment.find({
      doctor: doctorId,
      status: { $in: ['pending', 'confirmed'] },
    });

    const slots = blockedSlots.map((slot) => ({
      date: slot.date,
      slot: slot.slot,
      blocked: true,
      booked: false,
    }));

    appointments.forEach((apt) => {
      const dateStr = apt.date.toISOString().split('T')[0];
      slots.push({
        date: dateStr,
        slot: apt.slot,
        blocked: false,
        booked: true,
      });
    });

    return res.status(200).send({
      settings: settings || {},
      slots,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Something went wrong!' });
  }
};

const updateSlotSettings = async (req: any, res: Response) => {
  try {
    const doctorId = req.user?._id;
    const settings = req.body;

    await SlotSettings.findOneAndUpdate(
      { doctor: doctorId },
      { ...settings, doctor: doctorId },
      { upsert: true, new: true }
    );

    return res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Something went wrong!' });
  }
};

const blockSlot = async (req: any, res: Response) => {
  try {
    const doctorId = req.user?._id;
    const { date, slot } = req.body;

    await BlockedSlot.create({
      doctor: doctorId,
      date,
      slot,
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Something went wrong!' });
  }
};

const unblockSlot = async (req: any, res: Response) => {
  try {
    const doctorId = req.user?._id;
    const { date, slot } = req.body;

    await BlockedSlot.deleteOne({
      doctor: doctorId,
      date,
      slot,
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Something went wrong!' });
  }
};

const getAvailableSlots = async (req: any, res: Response) => {
  try {
    const { date, doctorId } = req.query;
    let targetDoctorId = doctorId || req.user?._id;
    
    // If no doctorId provided and user is not a doctor, find first doctor
    if (!targetDoctorId || req.user?.role !== 'doctor') {
      const User = require('../models/user.model').default;
      const doctor = await User.findOne({ role: 'doctor' });
      if (!doctor) {
        return res.status(200).send({ slots: [] });
      }
      targetDoctorId = doctor._id;
    }

    const settings = await SlotSettings.findOne({ doctor: targetDoctorId });
    if (!settings) {
      // Return default settings if no custom settings found
      const defaultSettings = {
        slotDuration: 30,
        startTime: '09:00',
        endTime: '17:00',
        breakStart: '13:00',
        breakEnd: '14:00',
        workingDays: [1, 2, 3, 4, 5, 6]
      };
      
      const dayOfWeek = new Date(date as string).getDay();
      if (!defaultSettings.workingDays.includes(dayOfWeek)) {
        return res.status(200).send({ slots: [] });
      }
      
      const generateDefaultSlots = () => {
        const slots: any = [];
        const start = new Date(`2000-01-01T${defaultSettings.startTime}`);
        const end = new Date(`2000-01-01T${defaultSettings.endTime}`);
        const breakStart = new Date(`2000-01-01T${defaultSettings.breakStart}`);
        const breakEnd = new Date(`2000-01-01T${defaultSettings.breakEnd}`);

        let current = new Date(start);
        while (current < end) {
          const timeStr = current.toTimeString().slice(0, 5);
          const isBreakTime = current >= breakStart && current < breakEnd;
          
          if (!isBreakTime) {
            slots.push(timeStr);
          }
          
          current.setMinutes(current.getMinutes() + defaultSettings.slotDuration);
        }
        return slots;
      };
      
      return res.status(200).send({ slots: generateDefaultSlots() });
    }

    const dayOfWeek = new Date(date as string).getDay();
    if (!settings.workingDays.includes(dayOfWeek)) {
      return res.status(200).send({ slots: [] });
    }

    const blockedSlots = await BlockedSlot.find({ doctor: targetDoctorId, date });
    const appointments = await Appointment.find({
      doctor: targetDoctorId,
      date: new Date(date as string),
      status: { $in: ['pending', 'confirmed'] },
    });

    const generateTimeSlots = () => {
      const slots: any = [];
      const start = new Date(`2000-01-01T${settings.startTime}`);
      const end = new Date(`2000-01-01T${settings.endTime}`);
      const breakStart = new Date(`2000-01-01T${settings.breakStart}`);
      const breakEnd = new Date(`2000-01-01T${settings.breakEnd}`);

      let current = new Date(start);
      while (current < end) {
        const timeStr = current.toTimeString().slice(0, 5);
        const isBreakTime = current >= breakStart && current < breakEnd;
        const isBlocked = blockedSlots.some((bs) => bs.slot === timeStr);
        const isBooked = appointments.some((apt) => apt.slot === timeStr);

        if (!isBreakTime && !isBlocked && !isBooked) {
          slots.push(timeStr);
        }

        current.setMinutes(current.getMinutes() + settings.slotDuration);
      }
      return slots;
    };

    return res.status(200).send({ slots: generateTimeSlots() });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Something went wrong!' });
  }
};

export default {
  getDoctorSlots,
  updateSlotSettings,
  blockSlot,
  unblockSlot,
  getAvailableSlots,
};
