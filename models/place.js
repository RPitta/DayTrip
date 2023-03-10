const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    name: String,
    address: String,
    city: String,
    state: String,
    yelpId: String,
    url: String,
    image_url: String,
    rating: Number,
    title: String,
    country: String,
    recommendations: { type: Number, default: 1 },
})

module.exports = mongoose.model("Place", PlaceSchema);
