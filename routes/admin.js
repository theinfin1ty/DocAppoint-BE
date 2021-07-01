const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin } = require('../middleware');

router.get('/', isLoggedIn, isAdmin, (req, res) => {
    res.render('admin/index');
})

module.exports = router;