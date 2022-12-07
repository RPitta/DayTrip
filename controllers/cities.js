const axios = require('axios');
const yelp = require('yelp-fusion');
const apiKey = 'lWGEnmQU2dyRKRVAJ-r9GjpWCGoubYXcoV9ynkdVn4Mai7MTTacgk9vVVJ5Cj9zAxDdzLQkxrl_7JzZqR-fV7882sJxWNOC0edpGtU239kk5HdGkaJFj_byZvPpOY3Yx';

function getBusinesses(location, term, limit = 10) {
    // Get top 10 best matched business results for specified term
    // and return them as js object
    const searchRequest = {
        term: term,
        location: location,
        limit: limit
    };

    const client = yelp.client(apiKey);

    return client.search(searchRequest).then(response => {
        const res = response.jsonBody.businesses;
        return res;
    }).catch(e => {
        // console.log(e);
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
    // TODO Add view for invalid city name "We couldn't find anything for <name>"
    // Or just display all reviews with that city name
    let { name } = req.params;
    name = name.replace(/\s/g, "");

    getAllBusinesses(name)
        .then(businesses => {
            arr = name.split(',');
            city = { name: arr[0], state: arr[1], country: arr[2] };
            // let userId = 'null'
            // if (req.user) userId = req.user._id;
            if (!businesses.restaurants) {
                return res.render('cities/error', { name });
            } else {
                return res.render('cities/show', { city, businesses });
            }
        }).catch(e => {
            // console.log(e);
            return res.redirect("/")
        });
}