var router = require('express').Router();
var mcache = require('memory-cache');


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

// Get Subreddit
router.get('/subreddits/:id',cache(600),function(req,res){
  var subreddits = configVal.get('REDDIT_'+req.params.id);
  res.send(subreddits);
});

module.exports = router;