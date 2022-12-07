const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    zip: String,
    name: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    state: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

module.exports = mongoose.model("City", CitySchema);
