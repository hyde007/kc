var router = require('express').Router();
var mcache = require('memory-cache');
var HashMap = require('hashmap');
var dotenv = require('dotenv').config({path: './devData.env'});



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

// Fetch popular tweets using hashtags
router.get('/twitterData/:id',cache(60),function(req,res){
	var coin = configVal.get('TW_'+req.params.id+'_POPULAR');
  twClient.get('search/tweets', {q: coin,count:15,result_type:'popular'}, function(error, tweets, response) {
      res.send(tweets);
  });
});

// Fetch timelines tweets from official accounts
router.get('/twMainAcc/:id',cache(60),function(req,res){
  var mainAcc = configVal.get('TW_'+req.params.id+'_MA');
  twClient.get('statuses/user_timeline', {screen_name: mainAcc,count:5,include_rts:true}, function(error, tweets, response) {
      res.send(tweets);
  });
});
module.exports = router;