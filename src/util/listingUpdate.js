require('../db/mongoose')
const Listing = require('../models/listing')
const realtor = require('realtorca')

//iterate through all listings and update with realtorca

const listingUpdateJob = async () =>{
    //get all listings
    try {
        const listings = await Listing.find()
        
        for (const listing of listings){
        console.log(listing.MLS)
        
        const opts = {ReferenceNumber:listing.MLS}
        const data = await realtor.post(opts)
            if (data.Results[0]){
                await listing.updateOne({
                    listingData:data.Results[0], 
                    longitude: data.Results[0].Property.Address.Longitude,
                    latitude: data.Results[0].Property.Address.Latitude
                })  
            }else{
                //listing no longer valid, remove from db
                await listing.remove()
            }
        }
    } catch (e) {
        console.log(e)    
    }
}

module.exports = listingUpdateJob