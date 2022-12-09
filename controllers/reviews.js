const User = require('../models/user');
const Place = require('../models/place');
const Review = require('../models/review');
const cities = require('./cities.js')
const yelp = require('yelp-fusion');
const review = require('../models/review');
const apiKey = 'lWGEnmQU2dyRKRVAJ-r9GjpWCGoubYXcoV9ynkdVn4Mai7MTTacgk9vVVJ5Cj9zAxDdzLQkxrl_7JzZqR-fV7882sJxWNOC0edpGtU239kk5HdGkaJFj_byZvPpOY3Yx';

// Does a yelp business search for a recommendation
function getPlace(location, term, limit = 1) {
    const searchRequest = {
        term: term,
        location: location,
        limit: limit
    };

    const client = yelp.client(apiKey);

    return client.search(searchRequest).then(response => {
        const res = response.jsonBody.businesses[0];
        return res;
    }).catch(e => {
        console.log(e);
    });
}

module.exports.index = async (req, res) => {
    const state = req.params.city.split(',')[1].trim();
    const city = req.params.city.split(',')[0];
    const reviews = await Review.find({ city: city, state: state }).populate("places").populate("author");
    res.render('reviews/index', { reviews, city, state });
}

module.exports.renderReview = (req, res) => {
    const userId = req.user._id;
    const { city } = req.params;
    // const {city, state} =  req.body;
    // res.render('reviews/new', { userId, city, state });
    res.render('reviews/new', { userId, city });
}


module.exports.createReview = async (req, res) => {
    // For autocomplete places: if place is mispelled flash an error:
    // "Unable to find one of your recommendations. Please check if you misspelled an 
    // establishment name"
    const userId = req.user._id;
    const username = req.user.username;
    const { recommendation } = req.body;
    const location = req.body.city;
    const state = location.split(',')[1].trim();
    const city = location.split(',')[0];

    const review = new Review({
        body: req.body.reviewBody,
        city: city,
        state: state,
        author: userId,
        authorId: userId
    })

    for (r of recommendation) {
        if (r.length !== 0) {
            r = r.split(',')[0];
            const business = await getPlace(location, r); // getPlace() might return an empty array

            let place = await Place.findOneAndUpdate(
                { yelpId: business.id },
                { $inc: { recommendations: 1 } },
                { returnOriginal: false }
            );

            if (!place) {
                place = new Place({
                    name: r,
                    address: business.location.address1,
                    city: city,
                    state: state,
                    yelpId: business.id,
                    url: business.url,
                });

                await place.save();
            }

            review.places.push(place);
        }
    }

    await review.save();

    req.flash('success', 'Created new review!');
    res.redirect(`/reviews/${location}`);
}

module.exports.vote = async (req, res) => {
    const { id } = req.params;
    const { vote } = req.body;

    let review;
    if (vote) {
        review = await Review.findByIdAndUpdate(id, { $inc: { useful: 1 } });
    } else {
        review = await Review.findByIdAndUpdate(id, { $inc: { useful: -1 } });
    }

    await review.save();
}

// TODO: Delete review route
// Also decrement number of recommendations if recommendations > 1
// else remove the entire Place
module.exports.deleteReview = async (req, res) => {
    const { reviewId } = req.body;
    await Review.findByIdAndDelete(reviewId);
    res.send(reviewId);
}









