const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    weight: {
        type: Number
    },
    date: {
        type: Date,
        required: true
    },
    slot: {
        type: String,
        enum: ['Morning', 'Evening'],
        required: true
    },
    purpose: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Appointment', appointmentSchema);