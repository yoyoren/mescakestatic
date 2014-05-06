//var CURRENT_TIME = '2014-04-02 01:12:00';
(function(){

	$('#message_container').show();
   window.addressTmpl = '<%for(var i=0;i<data.length;i++){%>\
						<div class="ama-item address_item <%if(i==0){%>ama-item-current<%}%>" id="address_<%=data[i].address_id%>"\
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
							<a href="#" class="ama-edit fl-l addr_edit" data-id="<%=data[i].address_id%>">修改</a>\
							<a href="#" class="ama-delete fl-r addr_del" data-id="<%=data[i].address_id%>">删除</a>\
						  </div>\
						</div>\
						<% }　%>'
  
   //current selected address id
   window.CURRENT_ADDRESS_ID=null;

   //current modifiy address id
   var CURRENT_ID;
   var Serect = false;
   var orderAlert;
   var SubmitLock = false;
   var JQ = {
   		new_address_form:$('#new_address_form'),
		address_container:$('#address_container'),
		submit_order_btn:$('#submit_order_btn'),
		minute_picker:$('#minute_picker'),
		hour_picker:$('#hour_picker'),
		date_picker:$('#date_picker'),
		order_charge:$('#order_charge'),
		code_image:$('#code_image'),
		dis_district:$('#dis_district'),
		shipping_fee_display:$('#shipping_fee_display'),
		shipping_fee:$('#shipping_fee'),
		my_phone_title:$('#my_phone_title'),
		my_phone_frame:$('#my_phone_frame'),
		region_sel:$('#region_sel'),
		serect_check:$('#serect_check'),
		personal:$('#personal'),
		add_new_address:$('#add_new_address'),
		cancel_address:$('#cancel_address'),
		mod_address:$('#mod_address'),
		new_contact:$('#new_contact'),
		new_address:$('#new_address'),
		new_tel:$('#new_tel'),
		message_input:$('#message_input'),
		fapiao_form:$('#fapiao_form'),
		fapiao_chk:$('#fapiao_chk'),
		person_name:$('#person_name'),
		company_name:$('#company_name'),
		my_phone_input:$('#my_phone_input'),
		money_card_frame:$('#money_card_frame'),
		login_tip:$('#login_tip'),
		cash_code:$('#cash_code')
   }
   var Order = {

		delegate:function(){
			var me = this;
			//UI changed when you select an address
			JQ.address_container.delegate('.address_item','click',function(){
				
				var _this = $(this);
				JQ.address_container.find('.address_item').removeClass('ama-item-current');
				_this.addClass('ama-item-current');
			
				//set current id
				CURRENT_ADDRESS_ID = _this.data('id');
				
				//计算一个地址是否需要运送费
				me.ifAddressNeedFee();
				
			}).delegate('.address_item','mouseover',function(){
				//给ie6加上hover效果来修改地址等操作
                $(this).addClass('hover');
            }).delegate('.address_item','mouseleave',function(){
                $(this).removeClass('hover');
			}).delegate('.addr_del','click',function(){
				//delete an address info if you want
				var _this =$(this);
				var id = _this.data('id');
					
				//we need some UI plugin
				require(['ui/confirm'],function(confirm){
					new confirm('确认删除这个地址信息吗？',function(){
						$.post('route.php?mod=order&action=del_order_address',{
							id:id
						},function(d){
							if(d.code == 0){
								//把当前选中的送货地址删除了 就要更新这个id
								if( window.CURRENT_ADDRESS_ID == id){
									window.CURRENT_ADDRESS_ID = null;
								}
								//remove it from UI
								$('#address_'+id).remove();
							}
						},'json');
					});
				});
				return false;
			}).delegate('.addr_edit','click',function(){
				//edit address info
				var _this =$(this);
				var id = _this.data('id');
				_this = $('#address_'+id);
				//update current mod ID
				CURRENT_ID = id;
				require(['ui/newaddress'],function(newaddress){
					newaddress.show({
						mod:true,
						id:id,
						data:{
							city:_this.data('city'),
							address:_this.data('address'),
							tel:_this.data('tel'),
							contact:_this.data('contact'),
							district:_this.data('district')
						},
						callback:function(id){
							JQ.address_container.find('.address_item').removeClass('ama-item-current');
							CURRENT_ADDRESS_ID = id;
							$('#address_'+id).addClass('ama-item-current');
							me.ifAddressNeedFee();
						}
					});
				});
				return false;
			});
		},
		_submitFail:function(){
			var jqButton = JQ.submit_order_btn;
				jqButton.addClass('green-btn');
				jqButton.val('提交订单');
				SubmitLock = false;
			if(orderAlert){
				orderAlert.close();
			}
		},
		bind:function(){
			var me = this;
			var jqDate = JQ.date_picker;
			var jqHour = JQ.hour_picker;
			var oldDate;

			JQ.order_charge.click(function(){
				MES.actionCheckLogin(function(){
					require(['ui/chargepopup'],function(dialog){
						dialog.show();
					});
				});
				return false;
			});
			jqHour.mousedown(function(){

				var html = ''
				if(!/\d{4}-\d{2}-\d{2}/.test(jqDate.val())){
					require(['ui/confirm'],function(confirm){
						new confirm('选择送货时间前，请先选择送货日期！');
					});
					return false;
				}
			});

			JQ.minute_picker.mousedown(function(){
				if(!/\d{4}-\d{2}-\d{2}/.test(jqDate.val())){
					require(['ui/confirm'],function(confirm){
						new confirm('选择送货时间前，请先选择送货日期！');
					});
					return false;
				}
			});

			JQ.code_image.click(function(){
				$(this).attr('src','captcha.php?tc='+Math.random());
			});

			//对于没有登录的用户 可以使用这个
			JQ.serect_check.click(function(){
				var chkbox = $('#serect_checkbox')[0];
				if(chkbox.checked){
					Serect = true;
					JQ.my_phone_title.show();
					JQ.my_phone_frame.show();
				}else{
					Serect = false;
					JQ.my_phone_title.hide();
					JQ.my_phone_frame.hide();
				}
				
			});


			JQ.region_sel.change(function(){
				var _val = $(this).val();
				//默认没有选择
				if(_val==0){
					return;
				}
				MES.get({
					mod:'order',
					action:'get_district',
					param:{
						city:_val
					},
					callback:function(d){
						//没有登录的情况下 这里才需要重新结算运费
						if(d.code == 0){
							var html = '<option value="0">选择送货街道</option>';
							if(d.data){
								for(var i in d.data){
									var name = d.data[i].name;
									if(!d.data[i].free){
										if(name.indexOf('*')<0){
											name = '*'+name;
										}
									}
									html+='<option value="'+i+'">'+name+'</option>'
								}
								JQ.dis_district.html(html).show();
							}else{
								JQ.dis_district.html(html).hide();
							}
						}	
					}
				});
			});

			//需要在未登录的时候重新计算运费
			JQ.dis_district.change(function(){
				MES.get({
					mod:'order',
					action:'shipping_fee_cal',
					param:{
						city:JQ.region_sel.val(),
						district:$(this).val()
					},
					callback:function(d){
						//没有登录的情况下 这里才需要重新结算运费
						if(d.code == 0&&!window.IS_LOGIN){
							if(d.fee!=0){
								JQ.shipping_fee_display.show();
							}else{
								JQ.shipping_fee_display.hide();
							}
							JQ.shipping_fee.val(d.fee);
							MES.updateTotalPriceDisplay(d);
						}
					}
				});
			});

			


			//tax ticket 
			JQ.fapiao_chk.click(function(){
				var _this = $(this);
				if(_this[0].checked){
					JQ.fapiao_form.show();
					JQ.personal.get(0).checked=true;
 					$("#cake")[0].checked=true;
 					$('#p_name_container').show();
 					$('#c_name_container').hide();
				}else{
					JQ.fapiao_form.hide();
 					JQ.personal.get(0).checked=false;
 					$("#company")[0].checked=false;
 					$("#cake")[0].checked=false;
 					$("#food")[0].checked=false;
 					JQ.company_name.val("");
 					JQ.person_name.val("");
				}
			});

			JQ.personal.click(function(){
 				var _this = $(this);
 				if(_this[0].checked){
					$('#p_title').show();
					$('#p_name_container').show();
					$('#c_name_container').hide();
					JQ.company_name.val("");
  				}
  			});
			
			$('#company').click(function(){
				var _this = $(this);
  				if(_this[0].checked){
					$('#c_title').show();
					$('#c_name_container').show();
					$('#p_name_container').hide();
					JQ.person_name.val("");
				}
			});

			//show create address in UI
			JQ.add_new_address.click(function(){
				require(['ui/newaddress'],function(newaddress){
					newaddress.show();
				});
				return false;

			});

			//new address for user
			$('#save_address').click(function(){
				var city = JQ.region_sel.val();
				var address = JQ.new_address.val();
				var tel = JQ.new_tel.val();
				var contact = JQ.new_contact.val();
				var district = JQ.dis_district.val();
				if(!me.vaildAddressForm()){
					return
				}
				$.post('route.php?mod=order&action=add_order_address',{
					country:501,
					city:city,
					address:address,
					tel:tel,
					contact:contact,
					district:district
				},function(d){
					if(d.code==0){
						var html = mstmpl(addressTmpl,{
							data:[d.data]
						});
						//clear highlight style
						JQ.address_container.find('.address_item').removeClass('ama-item-current');
						JQ.address_container.prepend(html);
						CURRENT_ADDRESS_ID = d.data.address_id;

						//hide new form area and clear it
						JQ.new_address_form.hide();
						me.clearAddressForm();
						me.ifAddressNeedFee();
					}

				},'json');
			});

			//mod address event
			JQ.mod_address.click(function(){
				
				var city = JQ.region_sel.val();
				var address = JQ.new_address.val();
				var tel = JQ.new_tel.val();
				var contact = JQ.new_contact.val();
				if(!me.vaildAddressForm()){
					return;
				}
				$.post('route.php?mod=order&action=update_order_address',{
					country:501,
					city:city,
					address:address,
					tel:tel,
					contact:contact,
					id:CURRENT_ID
				},function(d){
					if(d.code==0){
						var html = mstmpl(addressTmpl,{
							data:[d.data]
						});
						$('#address_'+CURRENT_ID).replaceWith(html);

						//hide new form area and clear it
						JQ.new_address_form.hide();
						me.clearAddressForm();
					}

				},'json');
			});

			JQ.cancel_address.click(function(){
				JQ.new_address_form.hide();
				me.clearAddressForm();
			});
			
			//submit this order to server
			JQ.submit_order_btn.click(function(){
				if(SubmitLock){
					return false;
				}

				SubmitLock = true;
				var jqButton = $(this);
				jqButton.removeClass('green-btn');

				var jqThis = $('#address_'+CURRENT_ADDRESS_ID);
				if(jqThis.length==0&&window.IS_LOGIN){
					require(['ui/confirm'],function(confirm){
						new confirm('请先选择或添加一个送货地址！');
					});
					
					me._submitFail();

				}else{

					me.saveconsignee(jqThis);
				}
					
			});
		},
		
		//we need some front-end vaild we submit form
		vaildAddressForm:function(){
			
			if($.trim(JQ.region_sel.val())==0){
				require(['ui/confirm'],function(confirm){
					new confirm('请选择一个送货的区域！');
				});
				return false;
			}
			if(JQ.dis_district.css('display')!='none'&&$.trim(JQ.dis_district.val())==0){
				require(['ui/confirm'],function(confirm){
					new confirm('请选择一个送货的街道！');
				});
				return false;
			}

			if($.trim(JQ.new_address.val())==''){
				MES.inputError('new_address_error');
				return false;
			}

			if($.trim(JQ.new_contact.val())==''){
				MES.inputError('new_contact_error');
				return false;
			}
			var tel = $.trim(JQ.new_tel.val());
			if(!MES.IS_MOBILE(tel)){
				MES.inputError('new_tel_error');
				return false;
			}

			//秘密赠送的逻辑
			var myTel = JQ.my_phone_input.val();
			var _serectSend = $('#serect_checkbox')[0].checked;
			if(_serectSend&&!MES.IS_MOBILE(myTel)){
				MES.inputError('my_phone_input_error');
				return false;
			}

			return true;
		},

		//clean new address form
		clearAddressForm:function(){
			JQ.region_sel.val(0);
			JQ.new_address.val('');
			JQ.new_tel.val('');
			JQ.new_contact.val('');
		},

		ifAddressNeedFee:function(){
			MES.get({
				mod:'order',
				action:'if_address_need_fee',
				param:{
				 'address_id':CURRENT_ADDRESS_ID
				},
				callback:function(d){
					if(d.code == 0){
						if(parseInt(d.fee)){
							JQ.shipping_fee_display.show();
						}else{
							JQ.shipping_fee_display.hide();
						}
						JQ.shipping_fee.val(d.fee);
						MES.updateTotalPriceDisplay(d);
					} 
				}
			})
		},
		//init address UI
		getAddress:function(){
			var me = this;
			$.get('route.php',{
				mod:'order',
				action:'get_order_address',
				_tc:Math.random()
			},function(d){
				
				//has address
				if(d.length){
					var html = mstmpl(addressTmpl,{
						data:d
					});
					JQ.address_container.prepend(html);

					//index 0 is the current address
					CURRENT_ADDRESS_ID = d[0].address_id;
					me.ifAddressNeedFee();
				}else{
					//no address ,show address form
					JQ.new_address_form.show();
				}
			},'json');
		},

		getRegion:function(){
			$.get('route.php',{
				_tc:Math.random(),
				mod:'order',
				action:'get_region'
			},function(d){
				var html='';
				for(var i=0;i<d.length;i++){
					if(d[i].region_id == 571||d[i].region_id == 572){
						d[i].region_name+='*';
					}
					html+='<option value="'+d[i].region_id+'">'+d[i].region_name+'</option>'
				}
				JQ.region_sel.append(html);
			},'json');

		},

		vaildDate:function(){
			if(!JQ.date_picker.val()){
				return false;
			}
			
			var hour = JQ.hour_picker.val();
			if(hour>22||hour<10){
				return false;
			}
			

			var minute = JQ.minute_picker.val();
			if(minute!=0&&minute!=30){
				return false;
			}
			return true;
		},
		//save it in session
		saveconsignee:function(_this){
			var me = this;
			var data;
			var corf="";

			if($("#cake")[0].checked==true){
  				corf="蛋糕";
  			}else if($("#food")[0].checked==true){
  				corf="食品";
  			}
			if(window.IS_LOGIN){
				data = {
						address_id:_this.data('id'),
						consignee:_this.data('contact'),
						country:441,
						city:_this.data('city'),
						address:_this.data('address'),
						district:_this.data('district'),
						mobile:_this.data('tel'),
						bdate:JQ.date_picker.val(),
						hour:JQ.hour_picker.val(),
						minute:JQ.minute_picker.val(),
						message_input:JQ.message_input.val().substring(0,140),
						inv_payee:JQ.person_name.val()+JQ.company_name.val(),
						inv_content:corf
				};
			}else{
				data = {
						address_id:0,
						consignee:JQ.new_contact.val(),
						country:441,
						city:JQ.region_sel.val(),
						address:JQ.new_address.val(),
						district:JQ.dis_district.val(),
						mobile:Serect?JQ.my_phone_input.val():JQ.new_tel.val(),
						bdate:JQ.date_picker.val(),
						hour:JQ.hour_picker.val(),
						minute:JQ.minute_picker.val(),
						message_input:JQ.message_input.val().substring(0,140),
						inv_payee:JQ.person_name.val()+JQ.company_name.val(),
						inv_content:corf
				}

				if(!me.vaildAddressForm()){
					me._submitFail();
					return;
				}
			}
			
			if(!me.vaildDate()){
				require(['ui/confirm'],function(confirm){
					new confirm('您选择的送货时间或日期不正确，请重新选择',function(){});
				});
				me._submitFail();
				return;
			}

			if(JQ.fapiao_chk.get(0).checked&&JQ.company_name.val()==""&&JQ.person_name.val()==""){
 				require(['ui/confirm'],function(confirm){
 					new confirm('请填写发票打印抬头',function(){});
 				});
 				me._submitFail();
 				return;
 			}
			
			require(['ui/alert'],function(alert){
				orderAlert = new alert('您的订单正在提交处理中，请等待页面跳转...');
			});
			//保存订单
			MES.post({
				action:'save_consignee',
				mod:'order',
				param:data||{},
				callback:function(d){
					if(d.msg=='time error'){
						require(["ui/confirm"], function(confirm) {
							new confirm('您所选择的送货时间距离制作时间少于5小时，请重新选择!');
						});
					}

					if(d.code!=0){
						require(["ui/confirm"], function(confirm) {
							new confirm('您所填写的收货信息不完善，您可以尝试重新填写后再提交');
						});

						me._submitFail();
						return;
					}
					if(window.IS_LOGIN){
						me.checkout();
					}else{
						//检查没有登录的用户手机号码是否被注册了
						var username = JQ.new_tel.val();
						if($('#serect_checkbox')[0].checked){
							username = JQ.my_phone_input.val();
						}
						if(!MES.IS_MOBILE(username)){
							MES.inputError('new_tel_error');
							return;
						}
						MES.get({
							mod:'account',
							action:'check_user_exsit',
							param:{username:username},
							callback:function(d){
								//用户已经存在于数据库中
								if(d.exsit){
									require(['ui/confirm'],function(confirm){
										var _confirm = new confirm('您所使用的手机号已经被注册，请登录后再继续订购',function(){
											_confirm.close();
											require(["ui/login"], function(login) {login.show();});
										});
									});
									
									me._submitFail();
								}else{
									
									//给这个用户注册一个账户 并且帮他登录
									var username = data.mobile;
									if(data.serect){
										username = data.myphone;
									}
									MES.post({
										mod:'account',
										action:'auto_register',
										param:{username:username},
										callback:function(d){
											if(d.code == 0){
												//注册成功后给这个用户结帐
												setTimeout(function(){
													me.checkout();
												},100);
											}else{
												me._submitFail();
											}
										}
									});
								}
							}
						});
					}	
				}
				
			});
		},

		//最终的结算
		checkout:function(){
			var me = this;
			var brithCard = $('.brith_card_name');
			var card_message = [];
			var jqVaildCode = $('#code_input');
			for(var i=0;i<brithCard.length;i++){
				var text = brithCard[i].innerHTML;
				if(text.split('').length>10){
					require(['ui/confirm'],function(confirm){
						new confirm('您添加的生日牌不能超过10个字');
					});
					me._submitFail();
					return;
				}
				card_message.push(text);
			}
			if(jqVaildCode.length&&jqVaildCode.val().split('').length!=4){
				require(['ui/confirm'],function(confirm){
					new confirm('请输入正确的4位验证码！');
				});
				me._submitFail();
				return;
			}
			//直接提交数据到订购表单
			MES.post({
				mod:'order',
				action:'checkout',
				param:{
					card_message:card_message.join('|')||'',
					vaild_code:jqVaildCode.val()
				},
				callback:function(d){
					//结算数据form submit
					//设置留言
					var jqInput = JQ.message_input;
					$('#leaving_message').val(jqInput.val());
					if(d.code == 0){
					   $('#submit_form').submit();
					}else {
						if(d.code == 10007){
							require(['ui/confirm'],function(confirm){
								new confirm('您输入的验证码不正确！');
							});
							JQ.code_image.attr('src','captcha.php?tc='+Math.random());
						}
						me._submitFail();
					}
				}	
			});
		},

		//变更支付的方式
		changePayMethod:function(){
			var payForm = $('#pay_id');
			$('#cash').click(function(){
				var cash = $('#cash_sel').val();
				payForm.val(cash);
			});
			
			$('#alipay').click(function(){
				payForm.val(3);
			});

			$('#kuaiqian').click(function(){
				payForm.val(4);
			});

			$('#cash_sel').change(function(){
				payForm.val($(this).val());
				$('#cash').find('input')[0].checked = true;
			});
		},

		//获得账户的余额
		getSurplus:function(){
			//$.get('flow.php?step=validate_gift&is_surplus=1',function(d){
			//	$('#balance_display').html('可用余额'+d.user_money).show();
			//},'json');
			$('#balance').click(function(){
				if($('#voucher')[0].checked==true){
 					$(this)[0].checked=false;
 					require(['ui/confirm'],function(confirm){
 						new confirm('现金券和礼金卡不能同时使用！');
 					});
  				}
				else{
					if($(this)[0].checked){
 						$.get('flow.php?step=validate_gift&is_surplus=1',{
 							_tc:Math.random()
 						},function(d){
 							$('#balance_display').html('可用余额'+d.surplus).show();
 							//折扣金额
 							$('#disaccount').html(d.total.surplus_formated);
 							
 							//最终价格
 							$('#final_total').html(d.total.amount_formated);
 							$('#surplus').val(d.surplus);
 						},'json');
 					}else{
 							$('#balance_display').html('').hide();
 							//折扣金额
 							$('#disaccount').html('￥0.00');
 							
 							//最终价格
 							$('#final_total').html($('.order_total').html());
 							$('#surplus').val('0.00');
 					}
				}
			});

			
		},
		
		//使用10位数的现金券 直接在本页面充值的
		chargeInPage:function(){
			var canUse = false;
			var Bonus_sn;
			$('#voucher_label').click(function(){
				if($('#balance')[0].checked==false)
 				{
 					if($('#voucher')[0].checked){
 						//$('#bonus_id').val(Bonus_sn);
 					}else{
 						$('#cash_code').val('');
 						$('#disaccount').html('￥0.00');
 						$('#final_total').html($('.order_total').html());
 						$('#bonus_id').val('');
 						$('#bonus').val('0.00');
 					}
  				}
			});
			
			//输入这个cash code
			$('#cash_code').blur(function(){
				$('#no').hide();
				var bonus_sn = $('#cash_code').val();
				if(bonus_sn.split('').length!=10){
					$('#no').show();
					return;
				}
				$.get('flow.php?step=validate_bonus&bonus_sn='+bonus_sn,{
					_tc:Math.random()
				},function(d){
					if(d.error){
						$('#no').show();
					}else{
					
						Bonus_sn = bonus_sn;
						$('#yes').show();
						
						//折扣金额
						$('#disaccount').html(d.total.bonus_formated);
						
						//最终价格
						$('#final_total').html(d.total.amount_formated);

						canUse = true;

						if($('#voucher')[0].checked){
							$('#bonus').val(d.total.bonus);
 							$('#bonus_id').val(d.bonus_id);
						}
					}
				},'json');
			});
			$('#cash_code').focus(function(){
				$('#no').hide();
				$('#yes').hide();
			});
		},


		initPlacerHolderForIE:function(){
			var placerHolderTable = ['new_address','new_contact','new_tel','my_phone_input','cash_code','person_name','company_name'];
			for(var i=0,l=placerHolderTable.length;i<l;i++){
				$('#'+placerHolderTable[i]).placeholder();
			}
		}
   }


   Order.bind();
   Order.delegate();
   Order.getAddress();
   Order.getRegion();
   Order.changePayMethod();
   Order.getSurplus();
   Order.chargeInPage();
   Order.initPlacerHolderForIE();

   $(window).ready(function(){
	 

	var _html='';
	var jqHourSel = JQ.hour_picker;
	var jqMinuteSel = JQ.minute_picker;
	for(var i=10;i<=22;i++){
		_html+='<option value="'+i+'">'+i+'</option>'
	}
	jqHourSel.append(_html);

   	JQ.date_picker.click(function(){
   		WdatePicker({
			minDate:'%y-%M-{%d}',
			onpicked:function(dp){
				var date = dp.cal.getDateStr();
				if(date == '2014-02-14'){
					require(['ui/confirm'],function(confirm){
						new confirm('由于小伙伴们太热情了，今日的蛋糕已经被抢光，您可以选择别的送货日期');
					});
					JQ.submit_order_btn.removeClass('green-btn');
					SubmitLock = true;
				}else{
					JQ.submit_order_btn.addClass('green-btn');
					SubmitLock = false;
				}
				var currDate = CURRENT_TIME.split(' ');
				var currHour = currDate[1].split(':')[0];
				var currTime = (new Date(currDate[0])).getTime();
				var selTime = (new Date(date)).getTime();
				var _html='<option value="0">小时</option>';
				JQ.minute_picker.show();
				if(window.HAS_BIG_STAFF||window.HAS_NO_SUGAR_STAFF){
					if(selTime - currTime > 3600*1000*24){
						for(var i=14;i<=22;i++){
							_html+='<option value="'+i+'">'+i+'</option>';
						}
					}else{
						if(window.HAS_NO_SUGAR_STAFF){
							_html=('<option value="0">无糖蛋糕制作需要24小时，所选择日期不能送货</option>');
						}else{
							_html=('<option value="0">大于5磅蛋糕制作需要24小时，所选择日期不能送货</option>');
						}
						
						JQ.minute_picker.hide();
					}
				}else{
					//10点以后了 选择第二天的订单 只能是14点之后的
					
					if((selTime - currTime == 3600*1000*24&&currHour>21)||(selTime==currTime&&currHour<10)){
						
						for(var i=14;i<=22;i++){
							_html+='<option value="'+i+'">'+i+'</option>';
						}
					}else{
						//其他时间点下单
						var endHour = 22;
						var beginHour = 10;
						var selDate = date.split('-').join('');
						var temp = CURRENT_TIME.split('-').join('').split(' ');
						var currentDate = temp[0];
						var hour = parseInt(temp[1].split(':')[0],10);
						var minute = parseInt(temp[1].split(':')[1],10);
						hour+=5;
						if(currentDate == selDate){
							if(minute>=30){
								hour+=1;
							}
							if(hour>endHour){
								_html=('<option value="0">制作需要5小时，今天已不能送货</option>');
								JQ.minute_picker.hide();
							}else if(hour<beginHour){
								for(var i=beginHour;i<=endHour;i++){
									_html+=('<option>'+i+'</option>');
								}	
							}else{
								for(var i=hour;i<=endHour;i++){
									_html+=('<option>'+i+'</option>');
								}
							}
						}else{
							for(var i=beginHour;i<=endHour;i++){
								_html+=('<option>'+i+'</option>');
							}
						}
					}
					
				}
				jqHourSel.html(_html);

			}
		});
   	});
//(new Date('2013-08-30')).getTime()
	//22:30这个是不送货的
	jqHourSel.change(function(){
		var date = JQ.date_picker.val();
		var temp = CURRENT_TIME.split('-').join('').split(' ');
		var currentDate = temp[0];
		var hour = parseInt(temp[1].split(':')[0],10);
		var minute = parseInt(temp[1].split(':')[1],10);
		var selDate = date.split('-').join('');
		var selHour=jqHourSel.val();

		if($(this).val()==22){
			jqMinuteSel.html('<option value="0">0</option>');
		}else if(currentDate == selDate){
			//下当日订单且当前时间不超过半点，送货时间最早为五小时以后的30分的节点，超过半点送货时间最早为六小时以后00分的时间节点
			if(minute<30 && selHour==hour+5){
				jqMinuteSel.html('<option value="0">30</option>');
			}else{
				jqMinuteSel.html('<option value="0">0</option><option value="30">30</option>');
			}
		}else{
			jqMinuteSel.html('<option value="0">0</option><option value="30">30</option>');
		}
	});

   	MES.checkLogin(function(){
		//login
   		JQ.login_tip.hide();
   		$('#login_address_operate_dt').show();
		$('#login_address_operate').show();
		JQ.add_new_address.show();

		//显示登录后的礼金操作地址
		JQ.money_card_frame.show();
		JQ.serect_check.hide();
		window.IS_LOGIN = true;
   	},function(){
		//unlogin
   		JQ.login_tip.show();
		JQ.add_new_address.hide();
		$('#login_address_operate_dt').hide();
		$('#login_address_operate').hide();

   		$('.user_login').click(function(){
			require(["ui/login"], function(login) {login.show();});
			return false;
   		});
		JQ.money_card_frame.hide();
		JQ.serect_check.hide();
		window.IS_LOGIN = false;
   	})
   	
   });

})();
