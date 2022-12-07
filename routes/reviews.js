const express = require('express');
const router = express.Router();
const Place = require("../models/review")
const reviews = require("../controllers/reviews")
const { isLoggedIn, isAuthor } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.route('/:city').get(catchAsync(reviews.index));
router.route('/new/:city').get(isLoggedIn, catchAsync(reviews.renderReview));

router.route('/:city').post(catchAsync(reviews.createReview));
router.route('/vote/:id').post(catchAsync(reviews.vote));



module.exports = router;
