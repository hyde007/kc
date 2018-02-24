
	newsHelper = function(news){
		var html = '<ul>';
		for(var i=0;i<news.length;i++){
		    html = html + '<li>'+news[i].imageurl+'</li>'
		}
		html = html + '</ul>';
	  	return html;
	}

