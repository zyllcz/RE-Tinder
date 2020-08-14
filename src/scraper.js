    const cheerio = require('cheerio');
    const puppeteer = require('puppeteer');

    const url = 'http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=00df01ca43e3426d91487697c76755b8&App=TREB#C4835471';

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
        //console.log(html);
        const items = [];

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
            const address = $(urlElems[i]).find('div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > div > div > span:nth-child(1) > span').text()

            var price = $(urlElems[i]).find('label').filter(function() {
              return $(this).text().trim() === 'List:';
            }).next().text();

            const taxes = $(urlElems[i]).find('label').filter(function() {
              return $(this).text().trim() === 'Taxes:';
            }).next().text();

            
            const images = JSON.parse($(urlElems[i]).find('img').attr('data-multi-photos'))
            
            console.log(address, price,taxes, images)
          
        }
        
        

      })
      .catch(console.error);