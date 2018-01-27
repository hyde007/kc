var express = require('express');
var app = express();
var routes = require('./routes');
var dotenv = require('dotenv').config({path: 'devData.env'});
var Twitter = require('twitter');
var HashMap = require('hashmap');

app.use('/',routes);

twClient = new Twitter({
  consumer_key: process.env.TW_CONSUMER_KEY,
  consumer_secret: process.env.TW_CONSUMER_SECRET,
  bearer_token: process.env.TW_BEARER_TOKEN
});

configVal = new HashMap();
for(k in process.env){
	configVal.set(k,process.env[k]);
}

app.use(express.static('public'));
var server = app.listen(8081,function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("App running on Host:"+host+" and port "+port);
})