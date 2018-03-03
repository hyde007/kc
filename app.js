var express = require('express');
var app = express();
var routes = require('./routes');
var dotenv = require('dotenv').config({path: 'devData.env'});
var Twitter = require('twitter');
var HashMap = require('hashmap');
var winston = require('winston');
require('winston-daily-rotate-file');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
mcache = require('memory-cache');

var hdhelper = require('./views/helper/hbshelper.js');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

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

var hbsengine = hbs.create({defaultLayout: 'index'});

app.engine('handlebars',hbsengine.engine);


app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

/**
 * Instantiate the logger
 */
var logger = new ( winston.Logger )({
  transports: [
    new ( winston.transports.Console )(
      { 
        level: 'error'
      }
    ),
    new ( winston.transports.DailyRotateFile )(
      { 
        filename: 'logs/kc-client.log',
        datePattern: '.yyyy-MM-dd'
      }
    )
  ]
});

app.post ('/api/logger', function( req, res, next ) {
  logger.log('error','Client: ' + req.body.data);
  return res.send( 'OK' );
});

app.get('sitemap.xml',function(req,res){
  res.sendFile(path.join(__dirname, '../public', 'sitemap.xml'));
});

var server = app.listen(8081,function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("App running on Host:"+host+" and port "+port);
})