var router = require('express').Router();
var path = require('path');

// Get Subreddit
router.get('/coin/:id1/:id2',function(req,res){
  if(configVal.get('NODE_ENV') == 'Prod'){
  	var domainName = 'http://koincontrol.com';
  }else{
  	var domainName = 'http://localhost:8081';
  }
  res.render('index',{domain:domainName,coin:req.params.id1,name:req.params.id2,homepage:false});
});

router.get('/',function(req,res){
  if(configVal.get('NODE_ENV') == 'Prod'){
  	var domainName = 'http://koincontrol.com';
  }else{
  	var domainName = 'http://localhost:8081';
  }
  res.render('index',{domain:domainName,coin:'BTC',name:'Bitcoin',homepage:true});
});

module.exports = router;