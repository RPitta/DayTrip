const mongoose = require('mongoose')
const Place = require('./place');
const Schema = mongoose.Schema;

// No city model but have a path for city
// TODO: Add timestamp for review and date of visit like Tripadvsior
const ReviewSchema = new Schema({
    body: String,
    time: { type: Date, default: Date.now },
    city: String,
    state: String,
    useful: { type: Number, default: 0 },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    authorId: String,
    places: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Place'
        }
    ]
})

module.exports = mongoose.model("Review", ReviewSchema);
