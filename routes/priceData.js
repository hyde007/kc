var Client = require('node-rest-client').Client;
var client = new Client();
var router = require('express').Router();
var mcache = require('memory-cache');
var HashMap = require('hashmap');

// Caching setup
var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    console.log('cache method:'+key+" size:"+mcache.size());
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

// Price Data for Histogram in Minutes
router.get('/histominute/:id',cache(60),function(req,res){
	getHistoMinData(req.params.id,res);
});

// Rest Call to cryptocompare to get price data
getHistoMinData = function(coin,res){
	client.get("https://min-api.cryptocompare.com/data/histominute?fsym="+coin+"&tsym=USD&aggregate=1", function (data, response) {
    	res.send(data.Data);
    });
}



module.exports = router;