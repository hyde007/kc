var mcache = require('memory-cache');
var Client = require('node-rest-client').Client;
var client = new Client();
var router = require('express').Router();


// Caching setup
var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      console.log('Cached Response');
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        console.log('Making API call');
        res.sendResponse(body)
      }
      next()
    }
  }
}

// Home Page hit
router.get('/',function(req,res){
	console.log('Site hit');
	res.send('Hello World');
});

// Price Data for Histogram in Minutes
router.get('/histominute/:id',cache(10),function(req,res){
	console.log(req.params.id);
	getHistoMinData(req.params.id,res);
});

// Rest Call to cryptocompare to get price data
getHistoMinData = function(coin,res){
	client.get("https://min-api.cryptocompare.com/data/histominute?fsym="+coin+"&tsym=USD&limit=60&aggregate=1", function (data, response) {
    	res.send(data.Data);
    });
}



module.exports = router;