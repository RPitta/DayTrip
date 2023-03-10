const express = require('express');
const router = express.Router();
const cities = require("../controllers/cities")
const City = require("../models/city");

router.route("/error/:searchTerm").get(cities.showCityError);

router.route("/:name").get(cities.showCity);

module.exports = router;