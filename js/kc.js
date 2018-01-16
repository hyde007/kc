function onLoadData(){

	$.get( "https://api.coinmarketcap.com/v1/ticker/?limit=50", function( data ) {
	  	for(var i=0;i<50;i++){
	  		$('#allCoins').append('<li class="nav-item"><a class="nav-link" href="javascript:load(\''+data[i]['symbol']+'\',\''+data[i]['name']+'\');">'+data[i]['name']+'</a></li>');
	  	}
	});

	var url = window.location.href;
	if(url.indexOf('name') != -1){
		var params = url.split("?");
		var param = params[1].split("&");
		var name = param[1].split("=")[1];
		$.get( "https://www.reddit.com/r/"+name+"/hot.json", function( data ) {
	  		for(var j=1;j<data.data.children.length;j++){
  				$('#redditnews').append('<li class="nav-item border"><a class="ml-2" href="https://reddit.com'+data.data.children[j].data.permalink+'" target="_blank">'+data.data.children[j].data.title+'</a></li>');
	  		}
	  		
		});
		$('#selectedCoin').append(name);
	}
	

}


 function load(coin,name){

 		

        var url = window.location.href;
        if(url.indexOf('?') ==  '-1'){
          url = "?coin="+coin+'&name='+name;
        }else{
          url = url.split("?");
          url = url[0];
          url = url + "?coin="+coin+"&name="+name;
        }
        window.location.href=url;


        

}