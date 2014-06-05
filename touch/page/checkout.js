  (function(){
	   var CURRENT_ADDRESS_ID;
       var address_container = $('#address_container');
	   var addressTmpl = '<%for(var i=0;i<data.length;i++){%>\
						<div <%if(i>0){%>style="display:none"<%}%>class="ama-item address_item <%if(i==0){%>ama-item-current<%}%>" id="address_<%=data[i].address_id%>"\
							data-id="<%=data[i].address_id%>"\
							data-address="<%=data[i].address%>"\
							data-tel="<%=data[i].mobile%>"\
							data-contact="<%=data[i].consignee%>"\
							data-city="<%=data[i].city%>"\
							data-district="<%=data[i].district%>"\
						>\
						  <p class="ama-name-area"><b class="fl-l"><%=data[i].consignee%></b><span class="fl-r"><%=data[i].mobile%></span></p>\
						  <p class="address-area">\
							<span class="city">北京市</span>\
							<span class="area"><%=data[i].cityName%> <%=data[i].districtName%></span><br>\
							<span class="address"><%=data[i].address%></span>\
						  </p>\
						  <div class="clearfix handle-area">\
							<a href="#" class="ama-edit fl-l addr_edit hide" data-id="<%=data[i].address_id%>">修改</a>\
							<a href="#" class="ama-delete fl-r addr_del" data-id="<%=data[i].address_id%>">删除</a>\
						  </div>\
						</div>\
						<% }　%>';
  M.checklogin(function(isLogin){
  if(isLogin){
	  window.IS_LOGIN = true;
	  M.get('route.php?mod=order&action=get_order_address', {}, function(d) {
		var html = M.mstmpl(addressTmpl, {
		  data : d
		});
		if(d.length){
			CURRENT_ADDRESS_ID = d[0].address_id;
		}

		if(d.length>1){
			$('#more_address_btn').show().click(function(){
				$('.address_item').show();
				$('#more_address_btn').hide();
			});
		}
		$('#new_address_btn').show();
		$('#new_address_btn')[CLICK](function(){
			location.href = '/newaddress';
		});
		
		address_container.html(html);
	  });
	  }else{
		$('#new_address_container').show();
		
	  }
  });	
  
 var payLock = false;
  $('body').delegate('.pay_container',CLICK,function(){
	if(payLock){
		return;
	}
	payLock = true;
	var _this = $(this);
	var payId = _this.data('id');
	_this.find('em').trigger(CLICK);
	$('#pay_id').val(payId);
	setTimeout(function(){
		payLock = false;
	},20);

  })
  //地址选择

  var ifAddressNeedFee = function(){
		M.get('route.php?mod=order&action=if_address_need_fee',{
				 'address_id':CURRENT_ADDRESS_ID
		},function(d){
			if(d.code == 0){
						if(parseInt(d.fee)){
							jq.shipping_fee_display.show();
						}else{
							jq.shipping_fee_display.hide();
						}
						jq.shipping_fee.val(d.fee);
						updateTotalPriceDisplay(d);
					} 	 
		});				
  }
  address_container.delegate('.address_item', CLICK, function() {

    var _this = $(this);
    address_container.find('.address_item').removeClass('ama-item-current');
    _this.addClass('ama-item-current');

    //set current id
    CURRENT_ADDRESS_ID = _this.data('id');

    //计算一个地址是否需要运送费
    ifAddressNeedFee();

  }).delegate('.addr_del', CLICK, function() {
    //delete an address info if you want
    var _this = $(this);
    var id = _this.data('id');
    M.confirm('确认删除这个地址信息吗？', function() {
      M.post('route.php?mod=order&action=del_order_address', {
        id : id
      }, function(d) {
        if (d.code == 0) {
          //把当前选中的送货地址删除了 就要更新这个id
          if (window.CURRENT_ADDRESS_ID == id) {
            window.CURRENT_ADDRESS_ID = null;
          }
          //remove it from UI
          $('#address_' + id).remove();
        }
      });
    })
    return false;
  }).delegate('.addr_edit', CLICK, function() {
    //edit address info
    var _this = $(this);
    var id = _this.data('id');
    _this = $('#address_' + id);
    //update current mod ID
    CURRENT_ID = id;
    require(['ui/newaddress'], function(newaddress) {
      newaddress.show({
        mod : true,
        id : id,
        data : {
          city : _this.data('city'),
          address : _this.data('address'),
          tel : _this.data('tel'),
          contact : _this.data('contact'),
          district : _this.data('district')
        },
        callback : function(id) {
          JQ.address_container.find('.address_item').removeClass('ama-item-current');
          CURRENT_ADDRESS_ID = id;
          $('#address_' + id).addClass('ama-item-current');
          ifAddressNeedFee();
        }
      });
    });
    return false;
  });

  //日期选择
  var time = (new Date(server_date * 1));
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var day = time.getDate();
  var hour = time.getHours();
  var minutes = time.getMinutes();
  var monthHtml = '';
  var dayHtml = '';
  var jq = {
    year_sel : $('#year_sel'),
    month_sel : $('#month_sel'),
    day_sel : $('#day_sel'),
    hour_sel : $('#hour_sel'),
    minute_sel : $('#minute_sel'),
    region_sel : $('#region_sel'),
    dis_district:$('#district_sel'),
	message_input:$('#message_input'),
	shipping_fee_display:$('#shipping_fee_display'),
	shipping_fee:$('#shipping_fee')
  }
  var getSelDate = function() {
    return jq.year_sel.val() + '-' + jq.month_sel.val() + '-' + jq.day_sel.val();
  }
  var getCurDate = function() {
    return year + '-' + month + '-' + day;
  }
  var renderMonth = function(month) {
    var monthHtml = '';
    for (var i = month; i <= 12; i++) {
      monthHtml += '<option value="' + i + '">' + i + '月</option>'
    }
    jq.month_sel.html(monthHtml);
    jq.month_sel.prev().html(month + '月');
  }
  var renderDay = function(day) {
    var dayHtml = '';
    for (var i = day; i <= 31; i++) {
      dayHtml += '<option value="' + i + '">' + i + '日</option>'
    }
    jq.day_sel.html(dayHtml);
    jq.day_sel.prev().html(day + '日');
  }
  var renderHour = function(begin, end, text) {
    var dayHtml = '';
    if (text) {
      jq.hour_sel.html('<option>' + text + '</option>');
      jq.hour_sel.prev().html(text);
    } else {
      for (var i = begin; i <= end; i++) {
        dayHtml += '<option value="' + i + '">' + i + '时</option>'
      }
      jq.hour_sel.html(dayHtml);
      jq.hour_sel.prev().html(begin + '时');
    }
  }
  var renderMinute = function(type) {
    var Html_1 = '<option value="0">0</option>';
    var Html_2 = '<option value="30">30</option>';
    var Html_3 = '<option value="0">0</option><option value="30">30</option>';
    var html = '';
    var begin = 0;
    if (type == 1) {
      html = Html_1;
    } else if (type == 2) {
      html = Html_2;
      begin = 30;
    } else if (type == 3) {
      html = Html_3;
    }
    jq.minute_sel.html(html);
    jq.minute_sel.prev().html(begin + '分');

  }
  var calTime = function() {
    var selDate = getSelDate();
    var currentDate = getCurDate();
    var currHour = hour;
    var currTime = (new Date(currentDate)).getTime();
    var selTime = (new Date(selDate)).getTime();
    var _html = '<option value="0">小时</option>';
    jq.minute_sel.parent().show();
	jq.hour_sel.parent().css({'width':'26%'});
    if (window.HAS_BIG_STAFF || window.HAS_NO_SUGAR_STAFF) {
      if (selTime - currTime > 3600 * 1000 * 24) {
        for (var i = 14; i <= 22; i++) {
          _html += '<option value="' + i + '">' + i + '</option>';
        }
      } else {
        if (window.HAS_NO_SUGAR_STAFF) {
          _html = ('<option value="0">无糖蛋糕制作需要24小时，所选择日期不能送货</option>');
        } else {
          _html = ('<option value="0">大于5磅蛋糕制作需要24小时，所选择日期不能送货</option>');
        }

        jq.minute_sel.parent().hide();
		jq.hour_sel.parent().css({'width':'90%'});
      }
    } else {
      //10点以后了 选择第二天的订单 只能是14点之后的
      if ((selTime - currTime == 3600 * 1000 * 24 && currHour > 21) || (selTime == currTime && currHour < 10)) {
        renderHour(14, 22);
      } else {
        //其他时间点下单
        var endHour = 22;
        var beginHour = 10;
        var _hour = hour;
        var minute = minutes;
        _hour += 5;
        if (currentDate == selDate) {
          if (minute >= 30) {
            _hour += 1;
          }
          if (hour > endHour) {
            renderHour(beginHour, endHour, '制作需要5小时，今天已不能送货');
            jq.minute_sel.parent().hide();
			jq.hour_sel.parent().css({'width':'90%'});
          } else if (hour < beginHour) {
            renderHour(beginHour, endHour);
          } else {
            renderHour(hour, endHour);
          }
        } else {
          renderHour(beginHour, endHour);
        }
      }

    }

  }
  var calMinutes = function() {
    var val = jq.hour_sel.val();
    var selDate = getSelDate();
    var currentDate = getCurDate();
    if (val == 22) {
      renderMinute(1);
    } else if (currentDate == selDate) {
      //下当日订单且当前时间不超过半点，送货时间最早为五小时以后的30分的节点，超过半点送货时间最早为六小时以后00分的时间节点
      if (minutes < 30 && jq.hour_sel.val() == hour + 5) {
        renderMinute(2);
      } else {
        renderMinute(3);
      }
    } else {
      renderMinute(3);
    }
  }
  

  jq.year_sel.change(function() {
    var monthHtml = '';
    if ($(this).val() > year) {
      renderMonth(1);
      renderDay(1);
    } else {
      renderMonth(month);
      renderDay(day);
    }
    calTime();
  });

  jq.month_sel.change(function() {
    var selYear = jq.year_sel.val();
    var selMonth = jq.month_sel.val();
    if (selYear > year || (selYear == year && selMonth > month)) {
      renderDay(1);
    } else {
      renderDay(day);
    }
    calTime();
  });

  jq.day_sel.change(function() {
    calTime();
  });

  jq.hour_sel.change(function() {
    calMinutes();
  });

  renderMonth(month);
  renderDay(day);
  calTime();
  calMinutes();
  $('.date-select').find('select').change(function() {
    var _this = $(this);
    var val = _this.val();
    var type = _this.attr('type');
    var prefix = '';
    switch(type) {
      case 'year':
        prefix = '年';
        break;
      case 'month':
        prefix = '月';
        break;
      case 'day':
        prefix = '日';
        break;
      case 'hour':
        prefix = '时';
        break;
      case 'minute':
        prefix = '分';
        break;
      case 'region':
        prefix = '';
        val = val.split('_')[1];
        break;
       case 'district':
        prefix = '';
        val = val.split('_')[1];
        break;
        
    }
    _this.prev().html(val + prefix);
  });

  

  jq.region_sel.change(function() {

    var _val = $(this).val().split('_')[0];
    //默认没有选择
    if (_val == 0) {
      return;
    }

    M.get('route.php?mod=order&action=get_district', {
      city : _val
    }, function(d) {
      if (d.code == 0) {
        var html = '<option value="0">选择送货街道</option>';
        if (d.data) {
          for (var i in d.data) {
            var name = d.data[i].name;
            if (!d.data[i].free) {
              if (name.indexOf('*') < 0) {
                name = '*' + name;
              }
            }
            html += '<option value="' + i + '_'+name+'">' + name + '</option>'
          }
          jq.dis_district.html(html);
          jq.dis_district.parent().show();
        } else {
          jq.dis_district.html(html);
          jq.dis_district.parent().hide();
        }
      }
    }); 
  });


  jq.dis_district.change(function(){
				M.get('route.php?mod=order&action=shipping_fee_cal',{
						city:jq.region_sel.val().split('_')[0],
						district:$(this).val().split('_')[0]
					},function(d){
						//没有登录的情况下 这里才需要重新结算运费
						if(d.code == 0&&!window.IS_LOGIN){
							if(d.fee!=0){
								jq.shipping_fee_display.show();
							}else{
								jq.shipping_fee_display.hide();
							}
							jq.shipping_fee.val(d.fee);
							updateTotalPriceDisplay(d);
						}
					});
			});
  
  M.get('route.php?mod=order&action=get_region', {}, function(d) {
    var html = '<option value="0">选择地区</option>';
    for (var i = 0; i < d.length; i++) {
      if (d[i].region_id == 571 || d[i].region_id == 572) {
        d[i].region_name += '*';
      }
      html += '<option value="' + d[i].region_id + '_' + d[i].region_name + '">' + d[i].region_name + '</option>'
    }
    jq.region_sel.append(html);
  });
  


  //提交相关
  var checkout =  function(){
			//直接提交数据到订购表单
			M.post('route.php?mod=order&action=checkout',{
					card_message:'',
					vaild_code:''
				},function(d){
					var jqInput = jq.message_input;
					$('#leaving_message').val(jqInput.val());
					if(d.code == 0){
					   $('#submit_form').submit();
					}else {
						submitFail();
					}
			});
				
  }
  var vaildDate = function(){
    if(!getSelDate()){
				return false;
			}
			
			var hour = jq.hour_sel.val();
			if(hour>22||hour<10){
				return false;
			}
			

			var minute = jq.minute_sel.val();
			if(minute!=0&&minute!=30){
				return false;
			}
			return true;
  }
  var submitFail = function(){
    M.loadingEnd();
  }
  
  var inputVaildError = function(jqObj,t){
	  var _p =jqObj.parent();
	  _p.addClass('animated flash');
	  jqObj.addClass('error-border');
	  $('#scroll_container').scrollTop(t);
	  _p[0].addEventListener('webkitAnimationEnd',function(){
		_p.removeClass('animated flash');
		jqObj.removeClass('error-border');
	  });
  }

  var addressInfoVaild = function(){
	if($('#new_address').val()==''){
	   inputVaildError($('#new_address'),300);
	   return false;
	}

	if($('#new_contact').val()==''){
	   inputVaildError($('#new_contact'),350);
	   return false;
	}

	if(!M.IS_MOBILE($('#new_tel').val())){
	   inputVaildError($('#new_tel'),400);
	   return false;
	}
	return true;
  }

  var regionVaild = function(){
	if(jq.region_sel.val()=='0'){
		inputVaildError(jq.region_sel,300);
		return false;
	}
	if(jq.dis_district.val()=='0'&&jq.dis_district.parent().css('display')!='none'){
		inputVaildError(jq.dis_district,300);
		return false;
	}
	return true;
  }

  var saveconsignee = function(_this) {
    var me = this;
    var addressObj;	

	if(CURRENT_ADDRESS_ID){
	   addressObj = $('#address_'+CURRENT_ADDRESS_ID);
	}else{
		if(!addressInfoVaild()){
			return false;
		}

		if(!regionVaild()){
			return false;
		}
	}
	if(jq.hour_sel.css('display')=='none'){
		return false;
	}

    var data = {
		address_id:CURRENT_ADDRESS_ID||0,
        consignee :addressObj?addressObj.data('contact'):$('#new_contact').val(),
        country : 441,
        city : addressObj?addressObj.data('city'):jq.region_sel.val().split('_')[0],
        address : addressObj?addressObj.data('address'):$('#new_address').val(),
        district : addressObj?addressObj.data('district'):jq.dis_district.val().split('_')[0],
        mobile : addressObj?addressObj.data('tel'):$('#new_tel').val(),
        bdate : getSelDate(),
        hour : jq.hour_sel.val(),
        minute : jq.minute_sel.val(),
        message_input : jq.message_input.val().substring(0, 140),
		inv_payee:'',
		inv_content:''
      };


    if (!vaildDate()) {
        M.confirm('您选择的送货时间或日期不正确，请重新选择');
        submitFail();
        return;
    }

    M.loading();
    //保存订单
    M.post('route.php?action=save_consignee&mod=order',data || {},function(d){
		if (d.msg == 'time error') {
            M.confirm('您所选择的送货时间距离制作时间不能少于5小时!');
        }

		if (d.code != 0) {
          M.confirm('收货信息填写不完整，重新填写后再提交');
          submitFail();
          return;
        }

		if (window.IS_LOGIN) {
           checkout();
        }else{
		  var username = $('#new_tel').val();
          if (!M.IS_MOBILE(username)) {
            M.inputError('new_tel_error');
            return;
          }

		  M.get('route.php?action=check_user_exsit&mod=account',{username : username},function(d){
			  if (d.exsit) {
				  M.confirm('您所使用的手机号已经被注册，请登录后再继续订购', function() {
					location.href = '/login';
				  });
                  submitFail();
              }else{
			    var username = data.mobile;
				M.post('route.php?action=auto_register&mod=account',{username:username},function(d){
					if(d.code == 0){
						//注册成功后给这个用户结帐
						setTimeout(function(){
							checkout();
						},100);
					}else{
						submitFail();
					}
				});
			  }
		  });
		}

	});
  }

  $('#done_button')[CLICK](function() {
	saveconsignee();
  });

  $('.pay_sel')[CLICK](function(){
	 $('.pay_sel').removeClass('checked');
	 $(this).addClass('checked');
  });
 })(); 