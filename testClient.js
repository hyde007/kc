var Client = require('node-rest-client').Client;
var client = new Client();

client.get("https://min-api.cryptocompare.com/data/histominute?fsym=BTC&tsym=USD&limit=1&aggregate=1", function (data, response) {
    // parsed response body as js object 
    	console.log(data.Data[0]);
	});