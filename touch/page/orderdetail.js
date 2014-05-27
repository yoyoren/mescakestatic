(function(){
	M.get('route.php?action=get_user_order_detail&mod=account',{
		order_id:window.orderId
	},function(d){
		var tmpl ='<%for(var i=0;i<data.length;i++){%>\
					<div class="wap-order-item">
					  <img src="img/order-detail5.png" class="woi-img">
					  <div class="woi-intro-area">
						<p class="woi-title"><%=data[i].goods_name%></p>
						<p class="woi-tip">尺寸：<%=data[i].goods_attr%>特殊要求：无糖，切块<span class="woi-price">￥188元</span></p>
					  </div>
					</div>\
			     <% } %>';
		var data = d.goods_list;
		var html = M.mstmpl(tmpl,{data:d});
		M.loadingEnd();
	});
 })();
