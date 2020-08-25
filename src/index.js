const express = require('express')
const cron = require('node-cron')
const scrapingJob = require('./util/scraper')
const userRouter = require('./routes/user')
const listingRouter = require('./routes/listing')
const ratingRouter = require('./routes/userlistingrating')

require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000


//setup routes
debugger
app.use(express.json())
app.use(userRouter)
app.use(listingRouter)
app.use(ratingRouter)

app.listen(port, ()=> {
    console.log('server is up')
})

// schedule the scrape job to store link data to mongoDB
cron.schedule("* * * * *", () => {
  scrapingJob()

  //add job for removing listings no longer active
});