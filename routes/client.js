const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Appointment = require('../models/appointments');
const { isLoggedIn, isClient, validateAppointment } = require('../middleware');

router.get('/', isLoggedIn, isClient, catchAsync(async (req, res) => {
    const appointments = await Appointment.find({ user: req.user.id });
    res.render('appointments/index', { appointments });
}))

router.get('/new', isLoggedIn, isClient, (req, res) => {
    res.render('appointments/new');
})

router.post('/', isLoggedIn, isClient, validateAppointment, catchAsync(async (req, res) => {
    const appointment = new Appointment(req.body.appointment);
    appointment.user = req.user.id;
    await appointment.save();
    req.flash('success', 'Successfully made a new appointment');
    res.redirect(`/client/${appointment._id}`);
}));

router.get('/:id', isLoggedIn, isClient, catchAsync(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id).populate('remark');
    if(!appointment){
        req.flash('error', 'Cannot find the requested appointment');
        return res.redirect('/client');
    }
    res.render('appointments/show', { appointment });
}));

router.get('/:id/edit', isLoggedIn, isClient, catchAsync(async (req, res) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if(appointment.status != 'Active')
    {
        req.flash('error', 'Requested appointment is not Active');
        return res.redirect(`/client/${id}`);
    }
    if(!appointment){
        req.flash('error', 'Cannot find that appointment');
        return res.redirect('/client');
    }
    res.render('appointments/edit', { appointment });
}))

router.put('/:id', isLoggedIn, isClient, validateAppointment, catchAsync(async (req, res) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if(appointment.status != 'Active')
    {
        req.flash('error', 'Requested appointment is not Active');
        return res.redirect(`/client/${id}`);
    }
    appointment.update({ $set: {...req.body.appointment} }).exec();
    req.flash('success', 'Successfully updated appointment!');
    res.redirect(`/client/${appointment._id}`);
}))

router.put('/:id/cancel', isLoggedIn, isClient, catchAsync(async (req, res) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if(appointment.status != 'Active')
    {
        req.flash('error', 'Requested appointment is not Active');
        return res.redirect(`/client/${id}`);
    }
    //TODO: update() is deprecated replace with an alternative
    appointment.update({ $set: { status: 'Cancelled' } }).exec();
    req.flash('success', 'Successfully cancelled appointment!');
    res.redirect(`/client/${appointment._id}`);
}))

module.exports = router;