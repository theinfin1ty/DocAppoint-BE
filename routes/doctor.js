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

    const appointments = await Appointment.find({ date: today }).sort({ slot: -1 });
    res.render('doctor/index', { appointments });
}));

router.get('/all', isLoggedIn, isDoctor, catchAsync(async (req, res) => {
    const appointments = await Appointment.find().sort({ date: -1, slot: -1 });
    res.render('doctor/all', { appointments });
}));

router.get('/:id', isLoggedIn, isDoctor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if(!appointment){
        req.flash('error', 'Cannot find that appointment');
        return res.redirect('/doctor');
    }
    res.render('doctor/show', { appointment });
}))

module.exports = router;