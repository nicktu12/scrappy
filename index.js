const express = require('express');
const app = express();
var Nightmare = require('nightmare');
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Scrappy';

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
};

app.get('/scrapi/native-instruments', asyncMiddleware(async (req, res, next) => {
  var nightmare = Nightmare({ show: false }); 
  await nightmare
    .goto('https://www.native-instruments.com/en/career-center')
    .wait(7777)
    .evaluate(function () {
      var myHost = 'https://www.native-instruments.com'
      var nameNodes = document.querySelectorAll('.job')
      var list = [].slice.call(nameNodes);
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

app.get('/scrapi/splice', asyncMiddleware(async (req, res, next) => {
  var nightmare = Nightmare({ show: false }); 
  await nightmare
    .goto('https://boards.greenhouse.io/splice')
    .wait(7777)
    .evaluate(function () {
      var myHost = 'https://boards.greenhouse.io'
      var nameNodes = document.querySelectorAll('.opening')
      var list = [].slice.call(nameNodes);
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
