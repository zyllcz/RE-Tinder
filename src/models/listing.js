const mongoose = require('mongoose')
const validator = require('validator')

const Listing = mongoose.model('listings', {
    url:{
        type: String,
        required:true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error ("link URL is not valid: "+value)
            }
        }
    },
    listingData:{
        type:Map, //nested documents with arbitrary keys
        required:true
    },
    listingImages:{
        type:Array,
        required:false
    },
    coordinates: {
        type: Array,
        required:false
    }

})

module.exports = Listing
