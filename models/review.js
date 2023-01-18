const { string } = require('joi');
const mongoose = require('mongoose')
const Place = require('./place');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    body: String,
    time: { type: Date, default: Date.now },
    dateVisited: Date,
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

ReviewSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {

        await Place.updateMany(
            {
                _id: {
                    $in: doc.places
                }
            }

            ,
            {

                $inc: {
                    recommendations: -1
                }

            }
        )

    }
})

module.exports = mongoose.model("Review", ReviewSchema);
