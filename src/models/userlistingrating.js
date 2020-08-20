const mongoose = require('mongoose')
const validator = require('validator')
const ObjectId = require('mongoose').Types.ObjectId;

const listRatingSchema = new mongoose.Schema({
    userID: {
        type: ObjectId,
        required: true
    },
    listingID: {
        type: ObjectId,
        required: true
    },
    rating: {
        type: boolean, //like/unlike?
        required:true
    }
})

const ListingRating = mongoose.model('listing_ratings', listRatingSchema)

module.exports = ListingRating