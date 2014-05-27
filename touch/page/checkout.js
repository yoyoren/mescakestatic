  (function(){
       var address_container = $('#address_container');
	   var addressTmpl = '<%for(var i=0;i<data.length;i++){%>\
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
	M.get('route.php?mod=order&action=get_order_address',{},function(d){
		var html = M.mstmpl(addressTmpl,{
			data:d
		});
		address_container.html(html);
	});
	
	var CURRENT_ADDRESS_ID;
	address_container.delegate('.address_item','click',function(){
				
				var _this = $(this);
				address_container.find('.address_item').removeClass('ama-item-current');
				_this.addClass('ama-item-current');
			
				//set current id
				CURRENT_ADDRESS_ID = _this.data('id');
				
				//计算一个地址是否需要运送费
				me.ifAddressNeedFee();
				
			}).delegate('.addr_del','click',function(){
				//delete an address info if you want
				var _this =$(this);
				var id = _this.data('id');
				M.confirm('确认删除这个地址信息吗？',function(){
				  M.post('route.php?mod=order&action=del_order_address',{
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
					});
				})
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
 })(); 