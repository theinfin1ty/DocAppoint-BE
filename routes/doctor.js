const express = require('express') 
const router = express.Router() 
const catchAsync = require('../utils/catchAsync') 
const Appointment = require('../models/appointments') 
const Remark = require('../models/remarks') 
const { isLoggedIn, isDoctor, validateAppointment } = require('../middleware') 
const controller = require('../controllers/doctor')

router.get('/', isLoggedIn, isDoctor, catchAsync(controller.renderIndexPage)) 

router.get('/all', isLoggedIn, isDoctor, catchAsync(controller.getAllAppointments)) 

router.get('/:id', isLoggedIn, isDoctor, catchAsync(controller.getAppointment))

router.post('/:id', isLoggedIn, isDoctor, catchAsync(controller.completeAppointment))

router.put('/:id', isLoggedIn, isDoctor, catchAsync(controller.rejectAppointment))

module.exports = router 