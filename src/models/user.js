const mongoose = require('mongoose')
const validator = require('validator')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const ListingRating = require('./userlistingrating')

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
        
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
}, {timestamps: true})

userSchema.virtual('Ratings', {
    ref: 'Listing_Rating',
    localField: '_id',
    foreignField: 'user'
})

userSchema.statics.findByCredentials = async(email, password) =>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
        throw new Error('Unable to login')
    }
    return user
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.AuthSecretString)
    
    user.tokens = user.tokens.concat({token})
    await user.save()
    
    return token 
}

//toJSON returns the user without password and tokens array
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens

    return userObject
}

//hash plain text before saving 
userSchema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password')){ //test if password is already created/hashed
        user.password = await bcrypt.hash(user.password, 8)
    }

    next() //indicate that pre is over
})

//delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await ListingRating.deleteMany({user: user._id})
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User