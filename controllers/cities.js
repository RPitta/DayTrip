const axios = require('axios');
const yelp = require('yelp-fusion');
const apiKey = 'lWGEnmQU2dyRKRVAJ-r9GjpWCGoubYXcoV9ynkdVn4Mai7MTTacgk9vVVJ5Cj9zAxDdzLQkxrl_7JzZqR-fV7882sJxWNOC0edpGtU239kk5HdGkaJFj_byZvPpOY3Yx';
const api_key = 'AIzaSyCykUarIq_FigSPJZTDQ_HHWfzXdlhjsw0';

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
    let { name } = req.params;
    name = name.replace(/\s/g, "");

    getAllBusinesses(name)
        .then(businesses => {
            arr = name.split(',');
            city = { name: arr[0], state: arr[1], country: arr[2] };
            if (!businesses.restaurants) {
                return res.render('cities/error', { name });
            } else {
                return res.render('cities/show', { city, businesses });
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
            key: api_key
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
