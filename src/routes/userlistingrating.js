const express = require('express')
const router = new express.Router()
const ListingRating = require('../models/userlistingrating')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Listing = require('../models/listing')
const ObjectId = require('mongoose').Types.ObjectId

//new ratings would be created through listing view, with listing id provided
router.post('/ratings', auth, async (req, res)=>{
    //listing param
    const {listing} = req.body
    if (!listing){
        return res.send({error: 'missing listing id'})
    }
    listingID = new ObjectId(listing)

    //... is es6 notation for copying the object, adds the owner property
    const listingrating = new ListingRating({
        ...req.body,
        user: req.user._id,
        listing: listingID
    })
    try{
        await listingrating.save()
        res.status(201).send(listingrating)
    }
    catch(e){
        res.status(400).send(e)
    }
})

//user getting all the listings previously looked at/rated
router.get('/ratings', auth, async (req, res)=>{
    const sort = {}

    if (req.query.sortBy){
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 //-1 sort by desc
    }

    try{
    await req.user.populate({
        path: 'Ratings',
        populate: {path:'listing'},
        options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }
    }).execPopulate()
    
    res.send({rating: req.user.Ratings, listing: req.user.Ratings.listing})//send listing too?
    }
    catch(e){
        res.status(500).send()
    }
})

//fetch listingrating, called by listing view
router.get('/ratings/:id', auth, async (req, res)=>{
    const _id = req.params.id
    if (!ObjectId.isValid(_id)){
        return res.status(404).send()
    }
    try{
        const listingrating = await ListingRating.findOne( { _id, user:req.user._id} )
        if (!listingrating){
            return res.status(404).send()
        }
        res.send(listingrating)
    }
    catch(e){
        res.status(500).send()
    }
})

//listingrating update
router.patch('/ratings/:id', auth, async (req,res)=>{
    //listing param
    const listing = req.query.listing
    if (!listingID){
        return res.send({error: 'missing listing id'})
    }
    listingID = new ObjectId(listing)

    const updates = Object.keys(req.body)
    const allowedUpdates = ['rating']
    const isValidUpdate = updates.every((update)=> allowedUpdates.includes(update))

    if (!isValidUpdate){
        return res.status(400).send({error: 'invalid update'})
    }

    try{

        const listingrating = await ListingRating.findOne({_id: req.params.id, user: req.user._id, listing: listingID})
        if(!listingrating){
            return res.status(404).send()
         }
        updates.forEach((update)=>{
            listingrating[update] = req.body[update]
        })

        await listingrating.save()

        res.send(listingrating)
    }
    catch(e){
        res.status(400).send(e)
    }
    
})

//delete listingrating

router.delete('/ratings/:id', auth, async (req,res)=>{
    const listing = req.query.listing
    if (!listingID){
        return res.send({error: 'missing listing id'})
    }
    listingID = new ObjectId(listing)
    try {
        const listingrating = await listingrating.findOneAndDelete({_id: req.params.id, user: req.user._id, listing: listingID})
        if (!listingrating){
            return res.status(404).send()
        }
        res.send(listingrating)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router