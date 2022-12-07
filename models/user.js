const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// TODO: Add picture field for user
// TODO: Add images for reviews
const UserSchema = new Schema({
    city: String,
    zip: String,
    state: String,
    avatar: { url: String, filename: String },
    bookmarks: [
        {
            city: String,
            state: String
        }
    ],
    isLocalGuide: { type: Boolean, default: false }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
