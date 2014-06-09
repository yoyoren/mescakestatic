(function(){
  var tmpl = '<%for(var i=0;i<data.length;i++) {%>\
			  <div class="content" id="orderitem_<%=data[i].order_id%>">\
				<p class="oli-tip"><span class="fl-l">订单号:<%=data[i].order_sn%></span><span class="fl-r">时间:<%=data[i].best_time.split(" ")[0]%></span></p>\
				<div class="od-list-item order_item" data-id="<%=data[i].order_id%>">\
				  <div class="oli-img-item">\
					<%if(data[i].showStaff) {%>\
												<%if(data[i].showStaff.goods_id == CAT_CAKE) {%>\
												<img src="'+M.staticDomain+'css/img/cat-little.jpg" >\
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
						<a href="#" class="oli-cancel cancel_order" data-id="<%=data[i].order_id%>">取消订单</a>\
				       <%}%>\
					</div>\
				  </div>\
				</div>\
			</div>\
			<%}%>';
	M.get('route.php?mod=account&action=get_user_order_list',{},function(d){
		var data = d.orders||[];
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
		var emptyTmpl = '<div class="content-area">\
        <div class="content">\
          <div class="order-area">\
            <div class="has-no-order">\
              <h4 class="content-title">您没购买过任何商品</h4>\
              <a href="/" class="btn big-btn status2-btn" style="margin-right:0;">赶紧去选购吧 &gt;&gt;</a>\
            </div>\
          </div>\
        </div>\
      </div>';
		var html = data.length<1?emptyTmpl:M.mstmpl(tmpl,{data:data});
		$('#container').html(html);
		M.loadingEnd();
	});

	$(document).delegate('.order_item','click',function(){
		var id = $(this).data('id');
		location.href = '/orderdetail?id='+id;
	});

	$('body').delegate('.cancel_order','click',function(){
			var _jqThis = $(this);
			var _id = $(this).data('id');
			M.confirm('确认取消该订单吗？取消后将无法恢复！',function(){
				M.post('route.php?action=del_one_order&mod=account',{
						'order_id':_id
					},function(d){
						if(d.code == 0){
							$('#orderitem_'+_id).remove();
							_jqThis.hide();
						}else{
							M.confirm("订单取消失败！可能是该订单已经确认，将不能取消");
						}
					});
			});
			return false;
		}).delegate('.pay_order','click',function(){
			var _this = $(this);
			var payUrl =_this.attr('href');
			if(payUrl=='#'&&_this.data('type')=='kuaiqian'){
				$('#pay_form_'+_this.data('id')).find('form')[0].submit();

			}else{
				var f = window.open(payUrl);
				if(f==null){
					M.confirm("您的浏览器启用拦截支付宝弹出窗口过滤功能！\n\n请暂时先关闭此功能以完成支付！");
				}
			}

			return false;
		});
  })();
