import { Schema, model } from 'mongoose';

const appointmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
    },
    phone: {
      type: Number,
    },
    address: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    slot: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
    },
    type: {
      type: String,
      enum: ['new', 'follow-up'],
      default: 'new',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected', 'missed'],
      default: 'pending',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    remark: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = model('Appointment', appointmentSchema);

export default Appointment;
