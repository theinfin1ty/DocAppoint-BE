const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin } = require('../middleware');
const User = require('../models/user');

router.get('/', isLoggedIn, isAdmin, (req, res) => {
    res.render('admin/index');
})

router.get('/register', isLoggedIn, isAdmin, (req, res) => {
    res.render('admin/register');
})

router.post('/register', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    try{
        const { name, userType, email, password } = req.body;
        const user = new User({ name: name, email: email, userType: userType, username: email });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Account created successfully');
        res.redirect('/admin');
    } catch(e){
        req.flash('error', e.message);
        res.redirect('/admin/register');
    }
}))

module.exports = router;