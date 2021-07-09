const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Appointment = require('../models/appointments');
const { isLoggedIn, isDoctor, validateAppointment } = require('../middleware');

router.get('/', isLoggedIn, isDoctor, catchAsync(async (req, res) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    const appointments = await Appointment.find({ date: today });
    res.render('doctor/index', { appointments });
}));

module.exports = router;