    const cheerio = require('cheerio');
    const puppeteer = require('puppeteer');

    //const url = 'http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=00df01ca43e3426d91487697c76755b8&App=TREB#C4835471'; //multilist condo
    const url = 'http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=a73e6e2779a54a9d8112dce842541694&App=TREB' //single listing house
    
    puppeteer
      .launch()
      .then(browser => browser.newPage())
      .then(page => {
        return page.goto(url).then(function() {
          return page.content();
        });
      })
      .then(html => {
        const $ = cheerio.load(html);

        //#C4835471 > span

        //$([data-deferred-loaded]) gets the reports on the page
        // $("div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > div > div > span:nth-child(1) > span")
        // .each(function() {
        //   items.push({
        //     value: $(this).text()
        //   });
        // });

        // $("div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div > span:nth-child(1) > span")
        // .each(function() {
        //   items.push({
        //     value: $(this).text()
        //   });
        // });
        //console.log(items);

        const urlElems = $('div.formitem.form.viewform')
          for (let i = 0; i < urlElems.length; i++) {
            const listingData = {
            address : $(urlElems[i]).find('div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > div > div > span:nth-child(1) > span').text(),
            price : $(urlElems[i]).find('label').filter(function() {
              return $(this).text().trim() === 'List:';
            }).next().text(),
            taxes : $(urlElems[i]).find('label').filter(function() {
              return $(this).text().trim() === 'Taxes:';
            }).next().text(),
            forsale : $(urlElems[i]).find('label').filter(function() {
              return $(this).text().trim() === 'For:';
            }).next().text(),
            MLS : $(urlElems[i]).find('label').filter(function() {
              return $(this).text().trim() === 'MLS#:';
            }).next().text(),
            style : $(urlElems[i]).find('div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(5) > div.formitem.formgroup.horizontal > div:nth-child(1) > span:nth-child(1) > span').text(),
            acre : $(urlElems[i]).find('div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(5) > div.formitem.formgroup.vertical > span:nth-child(4) > span').text(),
            Rms : $(urlElems[i]).find('label').filter(function() {
              return $(this).text().trim() === 'Rms:';
            }).next().text(),
            Bedrooms : $(urlElems[i]).find('label').filter(function() {
              return $(this).text().trim() === 'Bedrooms:';
            }).next().text(),
            Washrooms : $(urlElems[i]).find('label').filter(function() {
              return $(this).text().trim() === 'Washrooms:';
            }).next().text()
          }

            const images = JSON.parse($(urlElems[i]).find('img').attr('data-multi-photos'))
            
            console.log(listingData, images)
        }
      })
      .catch(console.error);