var router = require('express').Router();
var mcache = require('memory-cache');
var Client = require('node-rest-client').Client;
var client = new Client();


// Caching setup
var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    console.log('cache method:'+key+" size:"+mcache.size());
    if (cachedBody) {
      res.send(cachedBody);
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

// Get Subreddit
router.get('/subreddits/:id',cache(600),function(req,res){
  var subreddits = configVal.get('REDDIT_'+req.params.id);
  res.send(subreddits);
});


// Get Subreddit
router.get('/allcoins',cache(6000),function(req,res){
  client.get("https://api.coinmarketcap.com/v1/ticker/", function (data, response) {
      res.send(data);
  });
});


module.exports = router;