const express = require('express') 
const router = express.Router() 
const catchAsync = require('../utils/catchAsync') 
const Appointment = require('../models/appointments') 
const { isLoggedIn, isClient, validateAppointment } = require('../middleware') 
const controller = require('../controllers/client')

router.get('/', isLoggedIn, isClient, catchAsync(controller.renderIndexPage))

router.get('/new', isLoggedIn, isClient, controller.renderCreateAppointmentPage)

router.post('/', isLoggedIn, isClient, validateAppointment, catchAsync(controller.createAppointment)) 

router.get('/:id', isLoggedIn, isClient, catchAsync(controller.getAppointment))

router.get('/:id/edit', isLoggedIn, isClient, catchAsync(controller.renderEditAppointmentPage))

router.put('/:id', isLoggedIn, isClient, validateAppointment, catchAsync(controller.updateAppointment))

router.put('/:id/cancel', isLoggedIn, isClient, catchAsync(controller.cancelAppointment))

module.exports = router 