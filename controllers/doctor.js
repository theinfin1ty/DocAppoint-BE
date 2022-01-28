const CONFIG = require('../config/config')
const Appointment = require('../models/appointments')
const Remark = require('../models/remarks')

const renderIndexPage = async (req, res) => {
  var today = new Date() 
  var dd = String(today.getDate()).padStart(2, '0') 
  var mm = String(today.getMonth() + 1).padStart(2, '0')  //January is 0!
  var yyyy = today.getFullYear() 

  today = yyyy + '-' + mm + '-' + dd 

  const appointments = await Appointment.find({ date: today }).sort({ slot: -1 }) 
  res.render('doctor/index', { appointments }) 
}

module.exports.renderIndexPage = renderIndexPage

const getAllAppointments = async (req, res) => {
  const appointments = await Appointment.find().sort({ date: -1, slot: -1 }) 
  res.render('doctor/all', { appointments }) 
}

module.exports.getAllAppointments = getAllAppointments

const getAppointment = async (req, res) => {
  const { id } = req.params 
  const appointment = await Appointment.findById(id).populate('remark') 
  if(!appointment){
      req.flash('error', 'Cannot find that appointment') 
      return res.redirect('/doctor') 
  }
  res.render('doctor/show', { appointment }) 
}

module.exports.getAppointment = getAppointment

const completeAppointment = async (req, res) => {
  var today = new Date() 
  var dd = String(today.getDate()).padStart(2, '0') 
  var mm = String(today.getMonth() + 1).padStart(2, '0')  //January is 0!
  var yyyy = today.getFullYear() 

  today = yyyy + '-' + mm + '-' + dd 
  const appointmentId = req.params.id 
  const remarks = req.body.remark 
  const remark = new Remark({ remark: remarks, appointment: appointmentId }) 
  await remark.save() 
  const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status: 'Completed', remark: remark._id }) 
  
  req.flash('success', 'Appointment completed successfully!') 
  if(appointment.date == today){
      res.redirect(`/doctor`) 
  }
  else{
      res.redirect('/doctor/all') 
  }
}

module.exports.completeAppointment = completeAppointment

const rejectAppointment = async (req, res) => {
  var today = new Date() 
  var dd = String(today.getDate()).padStart(2, '0') 
  var mm = String(today.getMonth() + 1).padStart(2, '0')  //January is 0!
  var yyyy = today.getFullYear() 

  today = yyyy + '-' + mm + '-' + dd 
  const { id } = req.params 
  const appointment = await Appointment.findByIdAndUpdate(id, { status: 'Rejected' }) 
  req.flash('info', 'Appointment Rejected!') 
  if(appointment.date == today){
      res.redirect(`/doctor`) 
  }
  else{
      res.redirect('/doctor/all') 
  }
}

module.exports.rejectAppointment = rejectAppointment