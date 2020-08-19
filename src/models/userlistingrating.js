const mongoose = require('mongoose')
const validator = require('validator')
const ObjectId = require('mongoose').Types.ObjectId;

const ListingRating = mongoose.model('listing_ratings', {
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

module.exports = ListingRating