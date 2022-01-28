require('dotenv').config() 
const express = require('express') 
const passport = require('passport') 

const catchAsync = require('../utils/catchAsync') 
const CONFIG = require('../config/config') 
const sendEmail = require('../utils/email')

const User = require('../models/user')
const controller = require('../controllers/users') 

const router = express.Router() 

var data = null 
var verified = false 
var sent = false 

router.get('/register', controller.renderRegisterPage)

router.post('/register', catchAsync(controller.register))

router.get('/login', controller.renderLoginPage)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), controller.login)

router.get('/logout', controller.logout)

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] })) 

router.get('/google/callback', passport.authenticate('google', { failureFlash: true, failureRedirect: '/login' }), controller.googleLoginCallback) 

router.get('/forgot', controller.renderForgotPasswordPage)

router.post('/forgot', catchAsync(controller.existingEmail))

router.get('/forgot/reset/:id', controller.renderResetPasswordPage)

router.put('/forgot/reset/:id', catchAsync(controller.resetPassword))

router.get('/forgot/:id', catchAsync(controller.sendOTP))

router.post('/forgot/:id', catchAsync(controller.verifyOTP))


module.exports = router 