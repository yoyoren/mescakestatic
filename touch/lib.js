(function(){
	
	M = window.M||{};
    M.mainDomain = 'http://www.mescake.com/';
	M.touchDomain = 'http://touch.mescake.com/';
	if(location.host =='touch.n.mescake.com'){
		M.mainDomain = 'http://test.mescake.com/';
		M.touchDomain = 'http://touch.n.mescake.com/';
	}
	M.ajax = function(method,url,param,callback){
		var proxyFrame = $('#proxy_frame');
		if(!proxyFrame.length){
			
			var proxyFrame = document.createElement('iframe');
			proxyFrame.onload = function(){
				proxyFrame.contentWindow.$[method](M.mainDomain+url,param||{},function(d){
					callback(d);
				},'json');
			}
			proxyFrame.src = M.mainDomain+'proxy.php';
			proxyFrame.border = 0;
			proxyFrame.width = 1;
			proxyFrame.height = 1;
			$('body').append(proxyFrame);
		}else{
			proxyFrame[0].contentWindow.$[method](M.mainDomain+url,param||{},function(d){
				callback(d);
			},'json');
		}
	}
	M.get=function(url,param,callback){
		M.ajax('get',url,param,callback);
	}

	M.post=function(url,param,callback){
		M.ajax('post',url,param,callback);
	}
})()