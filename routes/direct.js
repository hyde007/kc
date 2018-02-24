var router = require('express').Router();
var path = require('path');
var Client = require('node-rest-client').Client;
var client = new Client();
var mcache = require('memory-cache');
var Handlebars = require('handlebars');

// Handlebar Helpers
Handlebars.registerHelper('newsHelper', function(news){
   var html = '<div class="card-deck">';
   var counter = 0;
   for(var i=0;i<news.length;i++){
    var publishedDate = new Date(news[i].published_on*1000);

    if(counter == 2){
      html = html + '<div class="card col-lg-4" style="padding:5px;"><img class="card-img-top" src="'+news[i].imageurl+'" alt="Card image cap"><div class="card-block"><h4 class="card-title block-text">'+news[i].title+'</h4><p class="card-text block-ellipsis">'+news[i].body+'</p><p class="card-text"><small class="text-muted"><div>Published: '+publishedDate.getDate()+'/'+publishedDate.getMonth()+'/'+publishedDate.getFullYear()+'</div> <div id="source">Source: '+news[i].source+'</div></small></p></div></div>';
      html = html + '</div>';
      counter = 0;
    }else if(counter == 0){
      html = html + '<div class="row" style="margin:5px;">';
      html = html + '<div class="card col-lg-4" style="padding:5px;"><img class="card-img-top" src="'+news[i].imageurl+'" alt="Card image cap"><div class="card-block"><h4 class="card-title block-text">'+news[i].title+'</h4><p class="card-text block-ellipsis">'+news[i].body+'</p><p class="card-text"><small class="text-muted"><div>Published: '+publishedDate.getDate()+'/'+publishedDate.getMonth()+'/'+publishedDate.getFullYear()+'</div> <div id="source">Source: '+news[i].source+'</div></small></p></div></div>';
      counter = counter + 1;
    }else{
      html = html + '<div class="card col-lg-4" style="padding:5px;"><img class="card-img-top" src="'+news[i].imageurl+'" alt="Card image cap"><div class="card-block"><h4 class="card-title block-text">'+news[i].title+'</h4><p class="card-text block-ellipsis">'+news[i].body+'</p><p class="card-text"><small class="text-muted"><div>Published: '+publishedDate.getDate()+'/'+publishedDate.getMonth()+'/'+publishedDate.getFullYear()+'</div> <div id="source">Source: '+news[i].source+'</div></small></p></div></div>';  
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


// Get Subreddit
router.get('/coin/:id1/:id2',function(req,res){
  if(configVal.get('NODE_ENV') == 'Prod'){
  	var domainName = 'http://koincontrol.com';
  }else{
  	var domainName = 'http://localhost:8081';
  }
  res.render('home',{domain:domainName,coin:req.params.id1,name:req.params.id2,homepage:false});
});

router.get('/',cache(6000),function(req,res){
  if(configVal.get('NODE_ENV') == 'Prod'){
  	var domainName = 'http://koincontrol.com';
  }else{
  	var domainName = 'http://localhost:8081';
  }
  client.get("https://min-api.cryptocompare.com/data/news/",function (data, response) {
      res.render('home',{domain:domainName,coin:'BTC',name:'Bitcoin',homepage:true,news:data});
  });
  
});

module.exports = router;