const express = require('express')
const router = new express.Router()
const Listing = require('../models/listing')
const auth = require('../middleware/auth')
const User = require('../models/user')
const ObjectId = require('mongoose').Types.ObjectId

//dont need for now since listings are created by batch job
// router.post('/listings', auth, async (req, res)=>{
//     //create listing, only realtor user should be able to
//     const listing = new Listing({
//         ...req.body,
//         addedBy: req.user._id
//     })
//     try{
//         await listing.save()
//         res.status(201).send(listing)
//     }
//     catch(e){
//         res.status(400).send(e)
//     }
// })


//get available listings
router.get('/listings', auth, async (req, res)=>{
    //todo:
    //add sorting and filtering
    //by geographic location
    //by listing attributes

    try{
    const listings = await Listing.find()
    
    res.send(listings)
    }
    catch(e){
        res.status(500).send()
    }
})

//delete listing, done by batch job for now

// router.delete('/listings/:id', auth, async (req,res)=>{
//     try {
//         const listing = await Listing.findOneAndDelete({_id: req.params.id, addedBy: req.user._id})
//         if (!listing){
//             return res.status(404).send()
//         }
//         res.send(listing)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

module.exports = router