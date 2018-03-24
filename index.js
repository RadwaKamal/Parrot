const rp = require('request-promise');
const cheerio = require('cheerio');
const secret = require('./secret')

const packt_uri = `https://www.packtpub.com/packt/offers/free-learning`;
const telegram_uri = `https://api.telegram.org/bot${secret.auth_token}/sendMessage`;

const packt_options = {
  uri: `${packt_uri}`,
  transform: function (body) {
    return cheerio.load(body);
  }
};

setInterval(() => {
  rp(packt_options)
    .then(($) => {
      book_title = $('.dotd-title').text().trim();
      if(book_title)
        rp.post({
          uri: `${telegram_uri}`,
          body: {
              chat_id: '@pmacaw',
              text: `Today's book from packtpub: ${book_title} \n Get it now at ${packt_uri}`,
              disable_web_page_preview: true
          },
          json: true 
      })
      else
        console.log(`Book title is empty`)
    })
    .catch((err) => {
      console.log(err);
  });	
}, 88200000)
