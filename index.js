const express = require('express');
const app = express();
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: false }); 
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Scrappy';

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
};

app.get('/scrappy/native-instruments', asyncMiddleware(async (req, res, next) => {
  await nightmare
    .goto('https://www.native-instruments.com/en/career-center/')
    .wait('.job')
    .evaluate(function () {
      var medata = [];
      var myHost = 'https://www.native-instruments.com/'
      var nameNodes = document.querySelectorAll('.job')
      var list = [].slice.call(nameNodes); // Why did I have to do this?
      return list.map(function(node){ 
        return {
            "jobtitle": node.innerText,
            "joblink": myHost + node.getElementsByTagName('a')[0].getAttribute('href')
          }
      });
    })
    .end()
    .then(function (result) {
      res.json(result);
      console.log(result);
    })
    .catch(function (error) {
      console.error('Search failed:', error);
    });
}));

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});