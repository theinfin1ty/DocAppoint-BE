const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin } = require('../middleware');
const User = require('../models/user');

router.get('/', isLoggedIn, isAdmin, (req, res) => {
    res.render('admin/index');
})

router.get('/users', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    if(req.query.userType == 'admin' || req.query.userType == 'client' || req.query.userType == 'doctor'){
    const { userType } = req.query;
    const users = await User.find({ userType: userType });
    res.render('admin/users', { users, userType });
    }
    else{
        req.flash('error', 'Please select a valid user type!');
        return res.redirect('/admin');
    }
}))

router.get('/users/:id', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user){
        req.flash('error', 'Cannot find the requested user');
        return res.redirect('/admin');
    }
    res.render('admin/show', { user });
}));

router.get('/users/:id/edit', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if(!user){
        req.flash('error', 'Cannot find that appointment');
        return res.redirect(`/admin`);
    }
    res.render('admin/edit', { user });
}))

router.put('/users/:id', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const { id } = req.params;
    const { userType } = req.body;
    const user = await User.findByIdAndUpdate(id, { userType });
    req.flash('success', 'Successfully updated user!');
    res.redirect(`/admin/users/${user._id}`);
}))

router.delete('/users/:id', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    await User.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted user!');
    res.redirect(`/admin/users?userType=${user.userType}`);
}))

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