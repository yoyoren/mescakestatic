(function(){
	win = $(window);
	window.CANDLE = 61;
    window.NUM_CANDLE = 67;
    window.CAT_CAKE = 68;
    window.FORK = 60;
   
	
	M = window.M||{};
	var IS_MOBILE = /^1[3|4|5|8|9]\d{9}$/;
	M.IS_MOBILE = function(num){
	 return IS_MOBILE.test(num);
    }
    M.mainDomain = 'http://www.mescake.com/';
	M.touchDomain = 'http://touch.mescake.com/';
	M.staticDomain = 'http://s1.static.mescake.com/';
	if(location.host =='touch.n.mescake.com'){
		M.mainDomain = 'http://test.mescake.com/';
		M.touchDomain = 'http://touch.n.mescake.com/';
		M.staticDomain = 'http://static.n.mescake.com/';
	}

	M.inputError = function(id){
		var el = $('#'+id);
		el.show();
		setTimeout(function(){
			el.hide();
		},2000);
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
	M.checklogin = function(callback){
		M.get('route.php?mod=account&action=check_login',{},function(d){
			callback(d.res);
		});
	}
	M.doLogin = function(username,password,callback){
		M.post('route.php?mod=account&action=login',{
			username:username,
			password:password
		},function(d){
			callback(d);
		});
	}
	M.mstmpl = function(str, data) {
		if (!data) {
			return false;
		}
		var cache = {};
		var _inner = function(str, data) {
			var fn = !/\W/.test(str) ? cache[str] = cache[str] || this.$_MSTMPL(document.getElementById(str).innerHTML) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
			return data ? fn(data) : fn;
		};

		return _inner(str, data);
	}
	
	M.checkLogout = function(callback){
		M.get('route.php?mod=account&action=logout',{},function(d){
			callback&&callback();
		});
    }

	M.getShopcarGoodsNum = function(callback){
		M.get('route.php?mod=account&action=get_order_count_by_sid',{},function(d){
			callback&&callback(d.count);
		});
	}
   var dialogIndex=0;
   M.confirm = function(text,onconfirm,oncancel){
	dialogIndex++;
	var width = win.width()*0.8;
	if(width>300){
		width = 300;
	}
	var html = '<div class="dialog dia-sub-tip" id="dialog_'+dialogIndex+'" style="width:'+width+'px;position:absolute;z-index:9998;min-height:150px;" >\
				  <div class="dialog-con">\
					<form>\
					<p class="dia-st-tip">'+text+'</p>\
					<input class="btn status1-btn confirm" type="button" value="确定">\
					<input class="btn cancel" type="button" value="取消">\
				  </form>\
				  </div>\
				</div><div class="gray-bg dialog_bg" style="opacity:0.6;z-index: 9997; height:'+win.height()+'px;"></div>';
		$('body').append(html);
		var dialog = $('#dialog_'+dialogIndex);
		dialog.css({top:((win.height()-dialog.height())/2)});
		dialog.show();
		dialog.find('.confirm').click(function(){
			onconfirm&&onconfirm();
			dialog.remove();
			$('.dialog_bg').remove();
		});

		dialog.find('.cancel').click(function(){
			oncancel&&oncancel();
			dialog.remove();
			$('.dialog_bg').remove();
		});
   }
   M.loading = function(){
	var html = '<div class="loading" id="g_loading" style="box-shadow:0 0 1px #333;border-radius:10px;z-index:9999;position:absolute;top:10px;left:10px;height:100px;width:100px;background-color:#fff"></div>\
				<div class="gray-bg" id="loading_bg" style="opacity:0.6;z-index: 9997; height:'+win.height()+'px;"></div>';
	if($('#g_loading').length){
		$('#g_loading').show();
		$('#loading_bg').show();
	}else{
		$('body').append(html);
	}	
	
	$('#g_loading').css({
		top:(win.height()-100)/2,
		left:(win.width()-100)/2
	});
   }

   M.loadingEnd = function(){
		$('#g_loading').hide();
		$('#loading_bg').hide();
   }

})();