function onLoadData(coin,name,onLoad){
	
	if(onLoad == 1){
			$.get( "https://api.coinmarketcap.com/v1/ticker/", function( data ) {
			checkProgressBar();
			for(var i=0;i<50;i++){
		  		$('#allCoins').append('<li class="nav-item"><a class="nav-link" href="javascript:load(\''+data[i]['symbol']+'\',\''+data[i]['name']+'\');">'+data[i]['name']+'</a></li>');
		  	}
		});	
	}
	
	//Clear the data
	$('#redditnews').empty();
	$('#selectedCoin').empty();
	$('#twitternews1').empty();
	$('#twitternews2').empty();
	if(typeof myLineChart!=='undefined'){
		myLineChart.destroy();
	}
	$('#currentCoin')[0].value=coin;
	// Load subreddits

	$.get( "/genericData/subreddits/"+coin, function( subreddit ) {
				if(subreddit.length > 0){
					$('#redditHeader').show();
				}else{
					$('#redditHeader').hide();
				}
	  		$.get( "https://www.reddit.com/r/"+subreddit+"/hot.json?limit=5", function( data ) {
	  			for(var j=1;j<data.data.children.length;j++){
		  			 var createdDate = timeAgo(data.data.children[j].data.created_utc);
	  				$('#redditnews').append('<a class="list-group-item list-group-item-action list-group-item-light" href="https://reddit.com'+data.data.children[j].data.permalink+'" target="_blank"> <div class="d-flex w-100 justify-content-between"><h5 class="mb-1">'+data.data.children[j].data.title+'</h5></div><small>'+createdDate+'</small><small> Comments :'+data.data.children[j].data.num_comments+'</small> </a>');
		  		}
		  		checkProgressBar();
		  		if(data.data.children.length > 0){
		  			$('#redditnews').show();
		  		}else{
		  			$('#redditnews').hide();
		  		}
		  		
			});
		  });
		$('#selectedCoin').append(name);

		// Main Account Data
		$.get( "/twitterData/twMainAcc/"+coin, function( data ) {	
			for(var j=0;j<data.length;j++){
	  			if(data[j].entities.urls[0]!= undefined){
	  				$('#twitternews1').append('<a class="list-group-item list-group-item-action list-group-item-light" href="'+data[j].entities.urls[0].url+'" target="_blank"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">'+data[j].text+'</h5></div><small>Reweeted '+data[j].retweet_count+' </small><small>Favorite '+data[j].favorite_count+'</small></a>');	
	  			}
  			}
  			checkProgressBar();
  			if(data.length>0){
  				$('#OfficalTweet').show();
  			}else{
  				$('#OfficalTweet').hide();
  			}
  		});

		// HashTag Data
		$.get( "/twitterData/twitterData/"+coin, function( data ) {	
			for(var j=0;j<data.statuses.length;j++){
				if(data.statuses[j].entities.urls[0]!= undefined){
					$('#twitternews2').append('<a class="list-group-item list-group-item-action list-group-item-light" href="'+data.statuses[j].entities.urls[0].url+'" target="_blank"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">'+data.statuses[j].text+'</h5></div></a>');	
				}
	  		}
	  		checkProgressBar();
	  		if(data.statuses.length>0){
  				$('#pplTweets').show();
  			}else{
  				$('#pplTweets').hide();
  			}
		});

		$.get( "/priceData/histominute/"+coin, function( priceData) {
			drawChart(priceData,coin);
			checkProgressBar();
        });
	
}

function load(coin,name){ 		
	$('#currentCoin')[0].value=coin;
	checkProgressBar();
	onLoadData(coin,name);
}

var drawChart = function(priceData){
    var ctx = document.getElementById("myChart");
    var timeData = [];
    var valueData = [];
    for(var i=0;i<priceData.length;i++){
      timeData.push(new Date(priceData[i].time*1000));
      valueData.push(priceData[i].high);
    }
    var coin = $('#currentCoin')[0].value;
    myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: coin,
                data: valueData,
                backgroundColor: '#3CBA9F'
            }],
            labels: timeData
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                     unit: 'minute'
                    }
                }]
            }

        }
    });
    checkProgressBar();

}

checkProgressBar = function(){
	if(typeof count == 'undefined'){
		count = 0;
	}
	if($('#progress').is(':visible')){
		var widthPercent = $("#progress").width() / $('#progress').parent().width() * 100;
		if(widthPercent < 100){
	   			if((widthPercent + 20) == 100){
	   				count = 0;
	   				$('#progress').width('100%');
	   				//$('#progressBar').hide();
	   			}else{
	   				if(count != 5){
	   				newWidth = newWidth + '%';
	   				var currentWidth = ($("#progress").width() / $('#progress').parent().width() * 100);
	   				var newWidth = (100-currentWidth)/(5-count);
	   				newWidth = newWidth + '%';
	   				$('#progress').width(newWidth);
	   				count = count + 1;
	   			}else{
	   				count = 0;
	   				$('#progress').width('0%');
	   			}
   			}
   		}else{
   			//$('#progressBar').hide();
   		}
	}else{
		count = 1;
		$('#progressBar').show();
		$('#progress').width('20%');
	}
		
}

timeAgo = function(prevDate){
	var prevDate = new Date(prevDate*1000);
	return prevDate.getDate()+' '+months[prevDate.getMonth()];
}

 var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Mov", "Dec"];