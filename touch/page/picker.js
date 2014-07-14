(function(){
	var index = 0;
	var picker = function(option){
	   index++;
	   var me = this;
	   var option = option||{};
	   me.el = $(option.el);
	   me.onclick = option.onclick || function(){};
	   var currentValue = me.el.next().val();
	   var type = me.type = option.type;
       var tplhtml = '<div class="area-list date-list" id="picker_'+index+'">\
					   <p class="first"><em class="data-corner-left" style="display:none"></em><span class="picker_title">选择日期</span><em class="data-corner-right" style="display:none"></em></p>\
					  <ul>\
						<%=container%>\
					  </ul>\
					</div>';
	  var container = $('body');
	 

	  if(type == 'zone'){
			M.get('route.php?mod=order&action=get_region', {}, function(d) {
				var html = '';
				for (var i = 0; i < d.length; i++) {
				  var checked = '';
				  if (d[i].region_id == 571 || d[i].region_id == 572) {
					d[i].region_name += '*';
				  }
				  
				  if(d[i].region_id == currentValue){
				     checked = 'current';
				  }
				  html += '<li class="pos-r '+checked+'" data-id="'+d[i].region_id+'"  style="position:relative">' + d[i].region_name + '</li>';
				}
				tplhtml = tplhtml.replace('<%=container%>',html);
				container.append(tplhtml);
				
				me.defaultEvent();
				me.setTitle('选择区');
			 });
		}else if(type == 'street'){
			var d = option.data;
			var html = '';
			for (var i in d) {
				  var checked = '';
				  if(i == currentValue){
				     checked = 'current';
				  }
				  html += '<li class="pos-r '+checked+'" data-id="'+i+'"  style="position:relative">' + d[i].name + '<em class="wap-radio wap-radio-item current '+checked+'"></em></li>';
			}
			tplhtml = tplhtml.replace('<%=container%>',html);
			container.append(tplhtml);
			
			me.defaultEvent();
			me.setTitle('选择街道');
		}else if(type == 'date'){
			var html='';
			var startTime = parseInt(window.server_date);
			currentValue = $('#month_sel').val()+$('#day_sel').val();
		
			for (var i = 0; i < 30; i++) {
				  var _date = new Date(startTime);
				  var year = _date.getFullYear();
				  var month = _date.getMonth()+1;
				  var day = _date.getDate();
				  startTime=startTime+(3600*24*1000);
				  var display = month+'月'+day+'日';
				  var checked = '';
				  if(month+''+day == currentValue){
				     checked = 'current';
				  }
				  html += '<li class="pos-r '+checked+'" data-day="'+day+'" data-month="'+month+'" data-year="'+year+'"  style="position:relative">' + display + '</li>';
			}
			tplhtml = tplhtml.replace('<%=container%>',html);
			container.append(tplhtml);
			
			me.defaultEvent();
			me.setTitle('选择送货日期');
		}else if(type == 'time'){
			var html='';
			currentValue = $('#hour_sel').val()+$('#minute_sel').val();
			var begin = option.beginHour;
			var end = option.endHour;
			
			for (var i = begin; i <= end; i++) {
				var hour = i;
				var minute = 0;
				var display = i+':'+'00';
				var checked = '';
				if(hour+''+'0' == currentValue){
				     checked = 'current';
				}
				html += '<li class="pos-r '+checked+'" data-hour="'+hour+'" data-minute="'+minute+'"  style="position:relative">' + display + '</li>';
				if(i<22){

					var display = i+':'+'30';
					minute = 30;
					checked = '';
					if(hour+''+minute == currentValue){
				     checked = 'current';
					}
					html += '<li class="pos-r '+checked+'" data-hour="'+hour+'" data-minute="'+minute+'" style="position:relative">' + display + '</li>';
				}
			}
			tplhtml = tplhtml.replace('<%=container%>',html);
			container.append(tplhtml);
			
			me.defaultEvent();
			me.setTitle('选择送货时间');
		}

		container.append('<div class="gray-bg pick_bg" style="z-index:10;"></div>');
		$('#scroll_container').css('overflow','hidden');
		$('.pick_bg')[CLICK](function(){
			me.destory();
		});
  }
  picker.prototype.defaultEvent = function(){
    var me = this;
	me.listContainer = $('#picker_'+index);
	me.listContainer.delegate('li',CLICK,function(){
			var _this = $(this);
			me.el.next().val(_this.data('id'));
			me.el.val(_this.text());
			me.destory();
			if(me.type == 'date'){
			  me.onclick(_this.data('year'),_this.data('month'),_this.data('day'));
			}else if(me.type == 'time'){
			  me.onclick(_this.data('hour'),_this.data('minute'),_this.data('day'));
			}else{
			  me.onclick(_this.data('id'));
			}
			
	});
  }
  picker.prototype.close = function(){
	 $('#scroll_container').css('overflow','auto');
     this.listContainer.hide();
	 $('.pick_bg').remove();
  }

  picker.prototype.destory = function(){
	 $('#scroll_container').css('overflow','auto');
     this.listContainer.remove();
	 $('.pick_bg').remove();
  }

  picker.prototype.setTitle = function(title){
     this.listContainer.find('.picker_title').html(title);
  }

  
  window.Picker = picker
})();