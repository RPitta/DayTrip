const axios = require('axios');
const yelp = require('yelp-fusion');
const city = require('../models/city');
const Place = require('../models/place');
const Review = require('../models/review');
const user = require('../models/user');

function getBusinesses(location, term, limit = 10) {
    // Get top 10 best matched business results for specified term
    // and return them as js object
    const searchRequest = {
        term: term,
        location: location,
        limit: limit
    };

    const client = yelp.client(process.env.YELP_APIKEY);

    return client.search(searchRequest).then(response => {
        const res = response.jsonBody.businesses;
        return res;
    }).catch(e => {
        console.log(e);
    });
}

async function getAllBusinesses(name) {
    const businesses = {};
    businesses.restaurants = await getBusinesses(name, "restaurants");
    businesses.hotels = await getBusinesses(name, "hotels");
    businesses.pois = await getBusinesses(name, "point of interest");
    return businesses;
}

module.exports.showCity = async (req, res) => {
    let { name } = req.params;
    name = name.replace(/\s/g, "");
    arr = name.split(',');
    let city = { name: arr[0], state: arr[1], country: arr[2] };
    const userId = req.user ? req.user._id : "";
    let rev = null;

    if (userId) {
        const reviews = await Review.find({ authorId: userId });
        for (let review of reviews) {
            if (review.city === city.name && review.state === city.state) {
                rev = review;
                break;
            }
        }
    }

    let userFavs = await Place.find({
        $and: [
            { city: { $eq: city.name } },
            { state: { $eq: city.state } },
            { recommendations: { $gte: 1 } }
        ]
    }).sort({ 'recommendations': -1 }).limit(10);

    getAllBusinesses(name)
        .then(businesses => {
            if (!businesses.restaurants) {
                return res.render('cities/error', { name });
            } else {

                return res.render('cities/show', { city, businesses, userFavs, rev });
            }
        }).catch(e => {
            return res.redirect("/")
        });
}

module.exports.showCityError = async (req, res) => {
    let name = req.params.searchTerm;

    axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
            address: name,
            key: process.env.GEOCODE_APIKEY
        }
    })
        .then(function (response) {
            let addr = response.data.results[0].formatted_address;
            let addrArr = addr.split(",")

            // if address is has more than 3 parts, only keep the
            // last three e.g. "Bloomfield, Pittsburgh, PA, USA" -> "Pittsburgh, PA, USA"
            // in order to satisfy city validation in citySearch.js
            if (addrArr.length > 3) {
                addr = addrArr.slice(addrArr.length - 3).join(",").trim();
            }

            return res.render("cities/error", { name, addr });

        })
        .catch(function (error) {
            let addr = null;
            return res.render("cities/error", { name, addr });

        });
}
