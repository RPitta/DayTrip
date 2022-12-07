const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { checkReturnTo, isLoggedIn } = require('../middleware');
const passport = require('passport');
const users = require("../controllers/users");
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(checkReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), users.login)

router.route('/photo')
    .get(isLoggedIn, users.renderPhoto)
    .post(isLoggedIn, upload.single('avatar'), catchAsync(users.uploadPhoto));

router.get('/logout', users.logout)

router.post('/save/:city', isLoggedIn, users.saveCity);

router.get('/:id', users.renderProfile);



module.exports = router;


