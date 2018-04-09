const rp = require('request-promise');
const cheerio = require('cheerio');

const packt_uri = `https://www.packtpub.com/packt/offers/free-learning`;
const telegram_uri = `https://api.telegram.org/bot${process.env.AUTH_TOKEN}/sendMessage`;

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
      countdown_to = $('.packt-js-countdown').data('countdown-to');
      remaining_seconds = countdown_to - Math.floor(Date.now() / 1000);
      time_remaining = simpleFormatter(remaining_seconds)
      if(book_title)
        rp.post({
          uri: `${telegram_uri}`,
          body: {
              chat_id: '@pmacaw',
              text: `Today's book from packtpub: ${book_title} \ntime remaining: ${time_remaining}\nGet it now at ${packt_uri}`,
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

let simpleFormatter = (seconds) => {
  seconds = parseInt(seconds);
  let hh = Math.floor(seconds / 3600);
  let mm = Math.floor((seconds - (hh * 3600)) / 60);
  let ss = seconds - (hh * 3600) - (mm * 60);

  if (hh < 10) {hh = '0' + hh}
  if (mm < 10) {mm = '0' + mm}
  if (ss < 10) {ss = '0' + ss}

  return hh + ':' + mm + ':' + ss;
};
