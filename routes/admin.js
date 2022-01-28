const express = require('express') 
const router = express.Router() 
const catchAsync = require('../utils/catchAsync') 
const { isLoggedIn, isAdmin } = require('../middleware') 
const User = require('../models/user') 
const controller = require('../controllers/admin')

router.get('/', isLoggedIn, isAdmin, controller.renderIndexPage)

router.get('/users', isLoggedIn, isAdmin, catchAsync(controller.getAllUsers))

router.get('/users/:id', isLoggedIn, isAdmin, catchAsync(controller.getUser)) 

router.get('/users/:id/edit', isLoggedIn, isAdmin, catchAsync(controller.renderEditUserPage))

router.put('/users/:id', isLoggedIn, isAdmin, catchAsync(controller.updateUser))

router.delete('/users/:id', isLoggedIn, isAdmin, catchAsync(controller.deleteUser))

router.get('/register', isLoggedIn, isAdmin, controller.renderRegisterPage)

router.post('/register', isLoggedIn, isAdmin, catchAsync(controller.addUser))

module.exports = router 