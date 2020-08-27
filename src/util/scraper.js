const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
require('../db/mongoose')
const Listing = require('../models/listing');
const { model } = require('../models/listing');

const url1 = 'http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=85610d6dd6ac43da8cc256fd8e6bd7ce&App=TREB'; //multilist condo
const url2 = 'http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=a73e6e2779a54a9d8112dce842541694&App=TREB' //single listing house
const url3 = 'http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=85610d6dd6ac43da8cc256fd8e6bd7ce&App=TREB'

const getListingData = (url) => {
return new Promise((resolve, reject)=>{
  puppeteer
    .launch()
    .then(browser => browser.newPage())
    .then(page => {
      return page.goto(url).then(function () {
        return page.content();
      });
    })
    .then(html => {
      const $ = cheerio.load(html);

      const urlElems = $('div.formitem.form.viewform') //div.formitem.form.viewform seems to be the common container for each listing report
      for (let i = 0; i < urlElems.length; i++) {
        const listingData = {
          //since there's no label for address need to find it by exact position
          address: $(urlElems[i]).find('div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > div > div > span:nth-child(1) > span').text(),
          //for data with labels we find the exact label string then get the next element for the label data
          price: $(urlElems[i]).find('label').filter(function () {
            return $(this).text().trim() === 'List:';
          }).next().text(),
          taxes: $(urlElems[i]).find('label').filter(function () {
            return $(this).text().trim() === 'Taxes:';
          }).next().text(),
          forsale: $(urlElems[i]).find('label').filter(function () {
            return $(this).text().trim() === 'For:';
          }).next().text(),
          MLS: $(urlElems[i]).find('label').filter(function () {
            return $(this).text().trim() === 'MLS#:';
          }).next().text(),
          //there are different data and formats dending on the style of listing (detached, condo, etc... need to build cases for each type of style)
          style: $(urlElems[i]).find('div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(5) > div.formitem.formgroup.horizontal > div:nth-child(1) > span:nth-child(1) > span').text(),
          acre: $(urlElems[i]).find('div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(5) > div.formitem.formgroup.vertical > span:nth-child(4) > span').text(),
          Rms: $(urlElems[i]).find('label').filter(function () {
            return $(this).text().trim() === 'Rms:';
          }).next().text(),
          Bedrooms: $(urlElems[i]).find('label').filter(function () {
            return $(this).text().trim() === 'Bedrooms:';
          }).next().text(),
          Washrooms: $(urlElems[i]).find('label').filter(function () {
            return $(this).text().trim() === 'Washrooms:';
          }).next().text()
        }

        //TODO
        //check API first, see if this data is in there already.
        
        //populate condo depended data

        //populate detached depended data

        //populate for sale data

        //populate for rent data
        const listingImages = JSON.parse($(urlElems[i]).find('img').attr('data-multi-photos'))

        //console.log(listingData, images)

        resolve({listingData, listingImages})
      }
    })
    .catch((error) => {
       return reject("unable to get response from url" + error.text())
    });
  })
}

const saveListing = async (url) => {
  try {
    const listingPageData = await getListingData(url)
    if (!listingPageData){
      throw new Error("unable to obtain listing info from webpage")
    }
    const {listingData, listingImages} = listingPageData
    const listing = await Listing.findOne({url})
    if (!listing){
      const newListing = new Listing({url, listingData, listingImages: listingImages['multi-photos'], MLS:listingData.MLS})
      await newListing.save()
    }else{
      await listing.updateOne({listingData, listingImages: listingImages['multi-photos'], MLS:listingData.MLS})
    }
  } catch (e) {
    console.log(e)
  }
}


//todo: call save listing for each link in mailbox
//stub
const scrapingJob = () =>{ 
    saveListing(url1)
    saveListing(url2)
    saveListing(url3)
    console.log('scraping job complete')
}

module.exports = scrapingJob