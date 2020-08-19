const express = require('express')
const cron = require('node-cron')
const saveListing = require('./scraper')
const scrapingJob = require('./scraper')
require('./db/mongoose')
require('./scraper')

const app = express()
const port = process.env.PORT || 3000

// schedule the scrape job to store link data to mongoDB
cron.schedule("0 * * * *", () => {
  const testurl = 'http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=00df01ca43e3426d91487697c76755b8&App=TREB#C4835471'
    scrapingJob()
    //console.log("running scrape job every hour");
  });

app.use(express.json())

app.listen(port, ()=> {
    console.log('server is up')
})