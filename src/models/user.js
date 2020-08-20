const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0){
                throw new Error('Age must be postive number')
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is not valid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.length < 6){
                throw new Error('Password must be more than 6 characters')
            }
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain the world "password"')
            }
        }
    },
    address: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            //validate using mapbox search result?
        }
    },
    coordinates: {
        type: Object,
        required:false
    },
    userType: {
        type: String,
        required: true,
        default: "buyer",
        validate(value){
            if(!['buyer','realtor'].includes(value.toLowerCase())){
                throw new Error ('invalid user type')
            }
        }
        
    }
})

const User = mongoose.model('users', userSchema)

module.exports = User