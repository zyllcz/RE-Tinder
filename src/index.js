const express = require('express')
const cron = require('node-cron')
const scrapingJob = require('./scraper')
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

// schedule the scrape job to store link data to mongoDB
cron.schedule("0 * * * *", () => {
    scrapingJob()
    //console.log("running scrape job every hour");
  });

app.use(express.json())

app.listen(port, ()=> {
    console.log('server is up')
})