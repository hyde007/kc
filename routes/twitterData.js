var Twitter = require('twitter');
var router = require('express').Router();
var mcache = require('memory-cache');
var HashMap = require('hashmap');
var dotenv = require('dotenv').config({path: './devData.env'});

var client = new Twitter({
  consumer_key: process.env.TW_CONSUMER_KEY,
  consumer_secret: process.env.TW_CONSUMER_SECRET,
  bearer_token: process.env.TW_BEARER_TOKEN
});

var hashTag = new HashMap();
hashTag.set('BTC','#BTC,#Bitcoin,#crypto');
hashTag.set('XRP','#XRP,#Ripple');
hashTag.set('NEO','#NEO');

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
router.get('/twitterData/:id',cache(60),function(req,res){
	getTWData(req.params.id,res);
});

getTWData = function(req,res){
	req = hashTag.get(req);
	console.log('req:'+req);
	client.get('search/tweets', {q: req,count:15,result_type:'popular'}, function(error, tweets, response) {
   		res.send(tweets);
	});
}

module.exports = router;