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
        type: String,
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
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Cancelled', 'Rejected'],
        default: 'Active'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    remark: {
        type: Schema.Types.ObjectId,
        ref: 'Remark'
    }
})

module.exports = mongoose.model('Appointment', appointmentSchema);