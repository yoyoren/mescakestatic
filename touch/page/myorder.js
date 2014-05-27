(function(){
  var tmpl = '<%for(var i=0;i<data.length;i++) {%>\
			  <div class="content">\
				<p class="oli-tip"><span class="fl-l">订单号:<%=data[i].order_sn%></span><span class="fl-r">时间:<%=data[i].best_time.split(" ")[0]%></span></p>\
				<div class="od-list-item order_item" data-id="<%=data[i].order_id%>">\
				  <div class="oli-img-item">\
					<%if(data[i].showStaff) {%>\
												<%if(data[i].showStaff.goods_id == CAT_CAKE) {%>\
												<img src="css/img/cat-little.jpg" >\
												<% } else {%>\
												<img src="'+M.mainDomain+'themes/default/images/sgoods/<%=data[i].showStaff.goods_sn.substring(0,3)%>.jpg" >\
												<% } %>\
											<% } %>\
				  </div>\
				  <div>\
					<p class="oli-price">共<%=data[i].realStaffCount%>件商品 <span>￥<%=data[i].order_amount%></span></p>\
					<p class="woi-tip">\
								<%if(data[i].order_status==0){%>未确认\
									<%} else {%>\
										<%if(data[i].order_status==2){%>已取消\
										<%} else {%>\
										<%if(data[i].pay_id==4){%>货到付款<%} else {%>\
										<%if(data[i].pay_status==0){%>未付款\
										<%}else if(data[i].pay_status==1){%>付款中\
										<%}else {%>已付款<%}%>\
										<% } %>\
										( <%if(data[i].shipping_status==0){%>未发货\
										<%}else if(data[i].shipping_status==1){%>已发货\
										<%}else if(data[i].shipping_status==2){%>已收货\
										<%}else if(data[i].shipping_status==3){%>备货中\
										<%}else if(data[i].shipping_status==4){%>已发货(部分商品)\
										<%}else if(data[i].shipping_status==5){%>发货中(处理分单)\
										<%}else {%>已发货(部分商品)<%}%>)\
										<%}%>\
									<%}%></p>\
					<div class="oli-btn-area">\
				       <%if(data[i].pay_id<4&&data[i].pay_status==0&&data[i].order_status!=2){%>\
							<%if(data[i].pay_name=="快钱"){%>\
										  <a href="#" class="btn status1-btn vt-a pay_order" data-type="kuaiqian" data-id="<%=data[i].order_id%>">\
											付款\
										  </a>\
										  <div style="display:none" id="pay_form_<%=data[i].order_id%>"><%=data[i].pay_online.pay_online.replace(/script/gi,"a")%></div>\
							<%}else{%>\
										  <a href="<%=data[i].pay_online.pay_online%>" class="btn status1-btn vt-a pay_order" data-id="<%=data[i].order_id%>">\
											付款\
										  </a>\
							<% } %>\
						<% } %>\
					   <%if(data[i].order_status==0&&data[i].pay_status!==2){%>\
						<a href="#" class="oli-cancel">取消订单</a>\
				       <%}%>\
					</div>\
				  </div>\
				</div>\
			</div>\
			<%}%>';
	M.get('route.php?mod=account&action=get_user_order_list',{},function(d){
		var data = d.orders;
				for(var i=0;i<data.length;i++){
					if(data[i].detail.length == 1){
					   data[i].showStaff = data[i].detail[0];
					}else{
						var realStaffCount = 0;
						data[i].showText = '';
						for(var j=0;j<data[i].detail.length;j++){
							if(data[i].detail[j].goods_id!=CANDLE&&data[i].detail[j].goods_id!=FORK&&data[i].detail[j].goods_id!=NUM_CANDLE){
								 realStaffCount++;
								 data[i].showStaff = data[i].detail[j];
							}else{
								continue;
							}
						}
						data[i].realStaffCount = realStaffCount;
					}
				}
		var html = M.mstmpl(tmpl,{data:data});
		$('#container').html(html);
		M.loadingEnd();
	});

	$(document).delegate('.order_item','click',function(){
		var id = $(this).data('id');
		location.href = '/orderdetail?id='+id;
	});
  })();
