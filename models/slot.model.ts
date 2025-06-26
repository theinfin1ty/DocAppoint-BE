import { Schema, model } from 'mongoose';

const slotSettingsSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    slotDuration: {
      type: Number,
      default: 30,
      enum: [15, 30, 45, 60],
    },
    startTime: {
      type: String,
      default: '09:00',
    },
    endTime: {
      type: String,
      default: '17:00',
    },
    breakStart: {
      type: String,
      default: '13:00',
    },
    breakEnd: {
      type: String,
      default: '14:00',
    },
    workingDays: {
      type: [Number],
      default: [1, 2, 3, 4, 5, 6],
    },
  },
  {
    timestamps: true,
  }
);

const blockedSlotSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    slot: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

blockedSlotSchema.index({ doctor: 1, date: 1, slot: 1 }, { unique: true });

export const SlotSettings = model('SlotSettings', slotSettingsSchema);
export const BlockedSlot = model('BlockedSlot', blockedSlotSchema);
