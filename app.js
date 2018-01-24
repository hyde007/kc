var express = require('express');
var app = express();
var routes = require('./routes');
var dotenv = require('dotenv').config({path: 'devData.env'});

app.use('/',routes);

app.use(express.static('public'));
var server = app.listen(8081,function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("App running on Host:"+host+" and port "+port);
})