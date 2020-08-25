const mongoose = require('mongoose')
const validator = require('validator')
const ObjectId = require('mongoose').Types.ObjectId;

const listRatingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Listing'
    },
    rating: {
        type: Boolean, //like/unlike?
        required:true
    }
}, {
    timestamps: true
})

const ListingRating = mongoose.model('Listing_Rating', listRatingSchema)

module.exports = ListingRating