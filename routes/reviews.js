const express = require('express');
const router = express.Router();
const Place = require("../models/review")
const reviews = require("../controllers/reviews")
const { isLoggedIn, isAuthor } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.route('/:city').get(catchAsync(reviews.index));
router.route('/new/:city').get(isLoggedIn, catchAsync(reviews.renderReview));
router.route('/edit/:city/:reviewId').get(isLoggedIn, catchAsync(reviews.renderEditReview))
    .put(isLoggedIn, catchAsync(reviews.editReview));


router.route('/:city')
    .post(catchAsync(reviews.createReview))

    .delete(isLoggedIn, catchAsync(reviews.deleteReview));

router.route('/vote/:id').post(catchAsync(reviews.vote));
// TODO: Add edit for reviews
module.exports = router;
