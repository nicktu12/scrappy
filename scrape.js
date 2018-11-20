var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: false }); // this opens a browser. Normally we don't want that to happen, as it slows things down

var medata = []

nightmare
  .goto('https://www.native-instruments.com/en/career-center/')
  .wait('.job')
  .evaluate(function () {
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
    medata = result;
    console.log(result);
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });

  module.exports = medata;
