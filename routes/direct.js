var router = require('express').Router();
var path = require('path');
var Client = require('node-rest-client').Client;
var client = new Client();
var Handlebars = require('handlebars');

// Handlebar Helpers
Handlebars.registerHelper('newsHelper', function(news){
   var html = '<div class="card-deck">';
   var counter = 0;
   for(var i=0;i<news.length;i++){
    var publishedDate = new Date(news[i].published_on*1000);

    if(counter == 2){
      html = html + '<div class="card col-lg-4" style="padding:5px;"><a href="'+news[i].url+'" target="_blank"><img class="card-img-top" src="'+news[i].imageurl+'" alt="Card image cap"></a><div class="card-block"><h4 class="card-title block-text">'+news[i].title+'</h4><p class="card-text block-ellipsis">'+news[i].body+'</p><p class="card-text"><small class="text-muted"><div>Published: '+publishedDate.getDate()+'/'+publishedDate.getMonth()+'/'+publishedDate.getFullYear()+'</div> <div id="source">Source: '+news[i].source+'</div></small></p></div></div>';
      html = html + '</div>';
      counter = 0;
    }else if(counter == 0){
      html = html + '<div class="row" style="margin:5px;">';
      html = html + '<div class="card col-lg-4" style="padding:5px;"><a href="'+news[i].url+'" target="_blank"><img class="card-img-top" src="'+news[i].imageurl+'" alt="Card image cap"></a><div class="card-block"><h4 class="card-title block-text">'+news[i].title+'</h4><p class="card-text block-ellipsis">'+news[i].body+'</p><p class="card-text"><small class="text-muted"><div>Published: '+publishedDate.getDate()+'/'+publishedDate.getMonth()+'/'+publishedDate.getFullYear()+'</div> <div id="source">Source: '+news[i].source+'</div></small></p></div></div>';
      counter = counter + 1;
    }else{
      html = html + '<div class="card col-lg-4" style="padding:5px;"><a href="'+news[i].url+'" target="_blank"><img class="card-img-top" src="'+news[i].imageurl+'" alt="Card image cap"></a><div class="card-block"><h4 class="card-title block-text">'+news[i].title+'</h4><p class="card-text block-ellipsis">'+news[i].body+'</p><p class="card-text"><small class="text-muted"><div>Published: '+publishedDate.getDate()+'/'+publishedDate.getMonth()+'/'+publishedDate.getFullYear()+'</div> <div id="source">Source: '+news[i].source+'</div></small></p></div></div>';
      counter = counter + 1;
    }
   }
   if(counter == 2){
    console.log('counter is 1');
    html = html + '<div class="col-lg-4"></div></div>'
   }
   html = html + '</div>';
  return html;
});


// Caching setup
var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
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


// Get List of coins
getCoinsList = function(){
  console.log('call to get coins list');
  var cachedCoins = mcache.get('allCoinList');
  if(cachedCoins){
    console.log('Got from cache');
    return cachedCoins;
  }else{
    console.log('Getting from call');
    client.get("https://api.coinmarketcap.com/v1/ticker/", function (data, response) {
          mcache.put('allCoinList', data, 60000 * 1000);
          return data;
    });
  }
}

gotoHomePage = function(req,res){

  if(configVal.get('NODE_ENV') == 'Prod'){
    var domainName = 'http://koincontrol.com';
  }else{
    var domainName = 'http://localhost:8081';
  }
  var news = '';
  var allCoinList = '';
  client.get("https://min-api.cryptocompare.com/data/news/",function (data, response) {
      news = data;
      allCoinList = getCoinsList();
      res.render('home',{domain:domainName,coin:'BTC',name:'Bitcoin',homepage:true,news:news,allCoins:allCoinList});
  });

}

// Get Subreddit
router.get('/coin/:id1/:id2',function(req,res){
  if(configVal.get('NODE_ENV') == 'Prod'){
  	var domainName = 'http://koincontrol.com';
  }else{
  	var domainName = 'http://localhost:8081';
  }
  var allCoinList = getCoinsList();
  res.render('home',{domain:domainName,coin:req.params.id1,name:req.params.id2,homepage:false,allCoins:allCoinList});
});

router.get('/',function(req,res){
  gotoHomePage(req,res);
});

module.exports = router;