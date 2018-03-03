function onLoadData(coin,name,onLoad){

	if($('#homepage').val() == 'true'){
		return;
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
	if($("#navbarSupportedContent").is(":visible")){
		$("#navbarSupportedContent").collapse('hide');
	}
	// Load subreddits

	$.get( "/genericData/subreddits/"+coin, function( subreddit ) {
				console.log("subreddit:"+subreddit);
				if(subreddit.length > 0){
					$('#redditHeader').show();
					$.get( "https://www.reddit.com/r/"+subreddit+"/hot.json?limit=5", function( subredditdata ) {
			  			try{
				  			for(var j=1;j<subredditdata.data.children.length;j++){
					  			 var createdDate = timeAgo(subredditdata.data.children[j].data.created_utc);
				  				$('#redditnews').append('<a class="list-group-item list-group-item-action list-group-item-light" href="https://reddit.com'+subredditdata.data.children[j].data.permalink+'" target="_blank"> <div class="d-flex w-100 justify-content-between"><h5 class="mb-1">'+subredditdata.data.children[j].data.title+'</h5></div><small>'+createdDate+'</small><small> Comments :'+subredditdata.data.children[j].data.num_comments+'</small> </a>');
					  		}
					  		checkProgressBar();
					  		if(subredditdata.data.children.length > 0){
					  			$('#redditnews').show();
					  		}else{
					  			$('#redditnews').hide();
					  		}
				  		}catch(err){
				  			log(err, "Error URL: https://www.reddit.com/r/"+subreddit+"/hot.json?limit=5");
				  			checkProgressBar();
				  		}
					}).fail(function() {
		   			 checkProgressBar();
				  	});
				}else{
					$('#redditHeader').hide();
					checkProgressBar();
				}
	  		
	}).fail(function() {
   			 checkProgressBar();
	});
		$('#selectedCoin').append(name);

		// Main Account Data
		$.get( "/twitterData/twMainAcc/"+coin, function( maincoindata ) {
			try{	
				for(var j=0;j<maincoindata.length;j++){
		  			if(maincoindata[j].entities!= undefined && maincoindata[j].entities.urls.length > 0){
		  				$('#twitternews1').append('<a class="list-group-item list-group-item-action list-group-item-light" href="'+maincoindata[j].entities.urls[0].url+'" target="_blank"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">'+maincoindata[j].text+'</h5></div><small>Reweeted '+maincoindata[j].retweet_count+' </small><small>Favorite '+maincoindata[j].favorite_count+'</small></a>');	
		  			}
	  			}
	  			checkProgressBar();
	  			if(maincoindata.length>0){
	  				$('#OfficalTweet').show();
	  			}else{
	  				$('#OfficalTweet').hide();
	  			}
	  		}catch(err){
	  			log(err, "Error: /twitterData/twMainAcc/"+coin);
	  			checkProgressBar();
	  		}
  		}).fail(function() {
   			 checkProgressBar();
		});

		// HashTag Data
		$.get( "/twitterData/twitterData/"+coin, function( hashtagdata ) {
			try{
				if(hashtagdata != undefined){
				for(var j=0;j<hashtagdata.statuses.length;j++){
					if(hashtagdata.statuses[j].entities.urls[0]!= undefined){
						$('#twitternews2').append('<a class="list-group-item list-group-item-action list-group-item-light" href="'+hashtagdata.statuses[j].entities.urls[0].url+'" target="_blank"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">'+hashtagdata.statuses[j].text+'</h5></div></a>');	
					}
		  		}
		  		checkProgressBar();
		  		if(hashtagdata.statuses.length>0){
	  				$('#pplTweets').show();
	  			}else{
	  				$('#pplTweets').hide();
	  			}
	  		  }
  			}catch(err){
  				log(err, "Error: /twitterData/twitterData/"+coin);
  				checkProgressBar();
  			}
		}).fail(function() {
   			 checkProgressBar();
		});

		$.get( "/priceData/histominute/"+coin, function( priceData) {
			drawChart(priceData,coin);
			checkProgressBar();
        }).fail(function() {
   			 checkProgressBar();
		});
	
}

function load(coin,name){ 		
	$('#currentCoin')[0].value=coin;
	window.history.replaceState(window.history.state,'','/');
	window.history.pushState(window.history.state,'','/coin/'+coin+'/'+name);
	checkProgressBar();
	onLoadData(coin,name);
}

var drawChart = function(priceData){
	if(priceData != null && priceData.length == 0){
		return;
		checkProgressBar();
	}
	try{
		    var ctx = document.getElementById("myChart");
		    var timeData = [];
		    var valueData = [];
		    var priceDataLength = priceData.length;
		    for(var i=0;i<priceDataLength;i++){
		      timeData.push(new Date(priceData[i].time*1000));
		      valueData.push(priceData[i].high);
		    }

		    var currentPrice = priceData[priceDataLength-1].high;
		    var maxPrice = Math.max(...valueData);
		    var minPrice = Math.min(...valueData);

		    document.getElementsByClassName('current-price')[0].innerHTML = '$'+currentPrice;
		    document.getElementsByClassName('24hr-high')[0].innerHTML = '$'+maxPrice;
		    document.getElementsByClassName('24hr-low')[0].innerHTML = '$'+minPrice;
		    var coin = $('#currentCoin')[0].value;
		    var today = new Date();
		    myLineChart = new Chart(ctx, {
		        type: 'line',
		        data: {
		            datasets: [{
		                label: coin,
		                data: valueData,
		                fill: false,
		                pointRadius: 0,
		                borderColor: '#3CBA9F'
		            }],
		            labels: timeData
		        },
		        options: {
		        	maintainAspectRatio: false,
		            scales: {
		                xAxes: [{
		                    type: 'time',
		                    time: {
		                     displayFormats: {
			                        hour: 'hA'
			                   	}
		                    },
		                    scaleLabel: {
		                    	display: true,
		                    	labelString: today.getDate() + '/' + Number(today.getMonth()+1) + '/' + today.getFullYear()
		                    }
		                }],
		                yAxes: [{
		                	scaleLabel: {
		                    	display: true,
		                    	labelString: 'USD'
		                    }
		                }]
		            }
		        }
		    });
		    checkProgressBar();
	}catch(err){
		log(err, 'Error: Chart');
		checkProgressBar();
	}
}

checkProgressBar = function(){
	return;
	console.log("checkProgressBar");
	if(typeof count == 'undefined'){
		count = 0;
	}
	if(count > 4){
		console.log(count);
	}
	if($('#progress').is(':visible')){
		var widthPercent = $("#progress").width() / $('#progressBar').width() * 100;
		if(widthPercent < 100){
	   			if((widthPercent + 20) == 100){
	   				count = 0;
	   				$('#progress').width('100%');
	   				//$('#progressBar').hide();
	   			}else{
	   				if(count != 5){
	   				newWidth = newWidth + '%';
	   				var currentWidth = ($("#progress").width() / $('#progressBar').width() * 100);
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

 log =function(data, level) {
  $.post(
    '/api/logger',
    {
      context   :   navigator.userAgent,
      level     :   level || 'error',
      data       :   data
    }
  );
}