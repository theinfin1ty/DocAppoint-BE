require('dotenv').config();
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const User = require('../models/user');
const nodemailer = require('nodemailer');

var data = null;
var verified = false;
var sent = false;


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASS
    }
});

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res, next) => {
    try{
        const { name, email, password } = req.body;
        const user = new User({ name: name, email: email, username: email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome!');
            res.redirect('/client');
        })
    } catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    if(req.user.userType == 'admin'){
        req.flash('success', `Welcome, ${req.user.name}. This is Admin's Panel!`);
        res.redirect('/admin');
    }
    if(req.user.userType == 'client'){
        req.flash('success', `Welcome, ${req.user.name}`);
        res.redirect('/client');
    }
    if(req.user.userType == 'doctor'){
        req.flash('success', `Welcome, Dr. ${req.user.name}. This is Doctor's Panel!`);
        res.redirect('/doctor');
    }
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/login');
})

router.get('/forgot', (req, res) => {
    res.render('users/forgot');
})

router.post('/forgot', catchAsync(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if(!user){
        req.flash('error', 'Requested email address is not registered');
        return res.redirect('/forgot');
    }
    res.redirect(`/forgot/${user._id}`);
}))

router.get('/forgot/reset/:id', (req, res) => {
    if(!verified){
        req.flash('error', 'Email not verified');
        return res.redirect('/forgot');
    }
    const { id } = req.params;

    res.render('users/reset', { id });
})

router.put('/forgot/reset/:id', catchAsync(async (req, res) => {
    if(!verified){
        req.flash('error', 'Email not verified');
        return res.redirect('/forgot');
    }
    const { id } = req.params;
    const { password } = req.body;
    const user = await User.findById(id);
    if(!user){
        req.flash('error', 'User not found!');
        return res.redirect('/register');
    }
    await user.setPassword(password);
    await user.save();
    req.flash('success', 'Password reset successful. LogIn with your new password');
    res.redirect('/login');
}))

router.get('/forgot/:id', catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user){
        req.flash('error', 'Requested email address is not registered');
        return res.redirect('/forgot');
    }
    if(!sent){
        var OTP = (Math.floor(100000 + Math.random() * 900000));
        data = OTP;
        const mailOptions = {
            from: 'no-reply@DocAppoint.com',
            to: `${user.email}`,
            subject: 'OTP to reset password at DocAppoint',
            text: `${OTP}`
        };
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            sent = true;
            }
        });
    }
    const { id } = req.params;
    res.render('users/OTP', { id });
}))

router.post('/forgot/:id', catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user){
        req.flash('error', 'Requested email address is not registered');
        return res.redirect('/forgot');
    }
    const { OTP } = req.body;
    if(OTP == data){
        verified = true;
        res.redirect(`/forgot/reset/${req.params.id}`);
        data = null;
    }
    else{
        req.flash('error', 'Try Again!');
        res.redirect(`/forgot/${req.params.id}`)
    }
}))


module.exports = router;