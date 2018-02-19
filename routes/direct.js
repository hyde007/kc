var router = require('express').Router();
var path = require('path');
var Client = require('node-rest-client').Client;
var client = new Client();

// Get Subreddit
router.get('/coin/:id1/:id2',function(req,res){
  if(configVal.get('NODE_ENV') == 'Prod'){
  	var domainName = 'http://koincontrol.com';
  }else{
  	var domainName = 'http://localhost:8081';
  }
  res.render('index',{domain:domainName,coin:req.params.id1,name:req.params.id2,coindata:true,homepage:false});
});

router.get('/',function(req,res){
  if(configVal.get('NODE_ENV') == 'Prod'){
  	var domainName = 'http://koincontrol.com';
  }else{
  	var domainName = 'http://localhost:8081';
  }
  client.get("https://min-api.cryptocompare.com/data/news/", function (data, response) {
      res.render('index',{domain:domainName,homepage:true,coindata:false,news:data});
  });
  
});

module.exports = router;