const CONFIG = require('../config/config') 
const sendEmail = require('../utils/email')

const User = require('../models/user') 

var data = null 
var verified = false 
var sent = false 

const renderRegisterPage = (req, res) => {
  res.render('users/register') 
}

module.exports.renderRegisterPage = renderRegisterPage

const register = async (req, res, next) => {
  try{
      const { name, email, password } = req.body 
      const user = new User({ name: name, email: email, username: email }) 
      const registeredUser = await User.register(user, password) 
      req.login(registeredUser, err => {
          if(err) return next(err) 
          req.flash('success', 'Welcome!') 
          res.redirect('/client') 
      })
  } catch(e){
      req.flash('error', e.message) 
      res.redirect('/register') 
  }
}

module.exports.register = register

const renderLoginPage = (req, res) => {
  res.render('users/login') 
}

module.exports.renderLoginPage = renderLoginPage

const login = (req, res) => {
  if(req.user.userType == 'admin'){
      req.flash('success', `Welcome, ${req.user.name}. This is Admin's Panel!`) 
      res.redirect('/admin') 
  }
  if(req.user.userType == 'client'){
      req.flash('success', `Welcome, ${req.user.name}`) 
      res.redirect('/client') 
  }
  if(req.user.userType == 'doctor'){
      req.flash('success', `Welcome, Dr. ${req.user.name}. This is Doctor's Panel!`) 
      res.redirect('/doctor') 
  }
}

module.exports.login = login

const logout = (req, res) => {
  req.logout() 
  req.flash('success', 'Goodbye!') 
  res.redirect('/login') 
}

module.exports.logout = logout

const googleLoginCallback = (req, res) => {
  if(req.user.userType == 'admin'){
      req.flash('success', `Welcome, ${req.user.name}. This is Admin's Panel!`) 
      res.redirect('/admin') 
  }
  if(req.user.userType == 'client'){
      req.flash('success', `Welcome, ${req.user.name}`) 
      res.redirect('/client') 
  }
  if(req.user.userType == 'doctor'){
      req.flash('success', `Welcome, Dr. ${req.user.name}. This is Doctor's Panel!`) 
      res.redirect('/doctor') 
  }
}

module.exports.googleLoginCallback = googleLoginCallback

const renderForgotPasswordPage = (req, res) => {
  res.render('users/forgot') 
}

module.exports.renderForgotPasswordPage = renderForgotPasswordPage

const existingEmail = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }) 
  if(!user){
      req.flash('error', 'Requested email address is not registered') 
      return res.redirect('/forgot') 
  }
  res.redirect(`/forgot/${user._id}`) 
}

module.exports.existingEmail = existingEmail

const renderResetPasswordPage = (req, res) => {
  if(!verified){
      req.flash('error', 'Email not verified') 
      return res.redirect('/forgot') 
  }
  const { id } = req.params 

  res.render('users/reset', { id }) 
}

module.exports.renderResetPasswordPage = renderResetPasswordPage

const resetPassword = async (req, res) => {
  if(!verified){
      req.flash('error', 'Email not verified') 
      return res.redirect('/forgot') 
  }
  const { id } = req.params 
  const { password } = req.body 
  const user = await User.findById(id) 
  if(!user){
      req.flash('error', 'User not found!') 
      return res.redirect('/register') 
  }
  await user.setPassword(password) 
  await user.save() 
  req.flash('success', 'Password reset successful. LogIn with your new password') 
  res.redirect('/login') 
}

module.exports.resetPassword = resetPassword

const sendOTP = async (req, res) => {
  const user = await User.findById(req.params.id) 
  if(!user){
      req.flash('error', 'Requested email address is not registered') 
      return res.redirect('/forgot') 
  }
  if(!sent){
      var OTP = (Math.floor(100000 + Math.random() * 900000)) 
      data = OTP
      const details = {otp: OTP} 
      sendEmail(details)
  }
  const { id } = req.params 
  res.render('users/OTP', { id }) 
}

module.exports.sendOTP = sendOTP

const verifyOTP = async (req, res) => {
  const user = await User.findById(req.params.id) 
  if(!user){
      req.flash('error', 'Requested email address is not registered') 
      return res.redirect('/forgot') 
  }
  const { OTP } = req.body 
  if(OTP == data){
      verified = true 
      res.redirect(`/forgot/reset/${req.params.id}`) 
      data = null 
  }
  else{
      req.flash('error', 'Try Again!') 
      res.redirect(`/forgot/${req.params.id}`)
  }
}

module.exports.verifyOTP = verifyOTP