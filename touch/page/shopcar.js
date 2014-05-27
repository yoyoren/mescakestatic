  (function(){
        var tmpl = '<% for(var i=0;i<data.length;i++){ %>\
			<div class="wap-order-item">\
				<img src="http://www.mescake.com/themes/default/images/sgoods/<%=data[i].goods_sn.substring(0,3)%>.jpg" class="woi-img">\
				<div class="woi-intro-area">\
				  <p class="woi-title"><%=data[i].goods_name%></p>\
				  <p class="woi-tip">尺寸：<%=data[i].goods_attr%><span class="woi-price">￥<%=data[i].goods_price%>元</span></p>\
				</div>\
			</div>\
		   <% } %>'
	M.get('route.php?mod=order&action=get_order_list',{},function(d){
	  var html = M.mstmpl(tmpl,{data:d.goods_list});
	  var count = d.goods_list.length;
	  $('#staff_count').html(count);
	  $('#order_price').after(html).html(d.order_total.amount_formated);
	  $('#total_price').html(d.order_total.amount_formated);
	});
 
 })(); 