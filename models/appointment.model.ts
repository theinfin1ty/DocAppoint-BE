import { Schema, model } from 'mongoose';

const appointmentSchema = new Schema({
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
  date: {
    type: Date,
    required: true,
  },
  slot: {
    type: String,
    enum: ['morning', 'evening'],
    required: true,
  },
  purpose: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'rejected'],
    default: 'active',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  remark: {
    type: String,
  },
});

const Appointment = model('Appointment', appointmentSchema);

export default Appointment;
