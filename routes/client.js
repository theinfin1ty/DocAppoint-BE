const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Appointment = require('../models/appointments');
const { isLoggedIn, validateAppointment } = require('../middleware');

router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const appointments = await Appointment.find({ user: req.user.id });
    res.render('appointments/index', { appointments });
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('appointments/new');
})

router.post('/', isLoggedIn, validateAppointment, catchAsync(async (req, res) => {
    const appointment = new Appointment(req.body.appointment);
    appointment.user = req.user.id;
    await appointment.save();
    req.flash('success', 'Successfully made a new appointment');
    res.redirect(`/client/${appointment._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id).populate('user');
    if(!appointment){
        req.flash('error', 'Cannot find the requested appointment');
        return res.redirect('/client');
    }
    res.render('appointments/show', { appointment });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if(!appointment){
        req.flash('error', 'Cannot find that appointment');
        return res.redirect('/client');
    }
    res.render('appointments/edit', { appointment });
}))

router.put('/:id', isLoggedIn, validateAppointment, catchAsync(async (req, res) => {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndUpdate(id, {...req.body.appointment});
    req.flash('success', 'Successfully updated appointment!');
    res.redirect(`/client/${appointment._id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Appointment.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted appointment');
    res.redirect('/client');
}))

module.exports = router;