(function(){
	M.get('route.php?action=get_user_order_detail&mod=account',{
		order_id:window.orderId
	},function(d){
		var tmpl ='<%for(var i=0;i<data.length;i++){%>\
					<div class="wap-order-item">
					  <img src="img/order-detail5.png" class="woi-img">
					  <div class="woi-intro-area">
						<p class="woi-title"><%=data[i].goods_name%></p>
						<p class="woi-tip">�ߴ磺<%=data[i].goods_attr%>����Ҫ�����ǣ��п�<span class="woi-price">��188Ԫ</span></p>
					  </div>
					</div>\
			     <% } %>';
		var emptyTmpl = '<div class="content-area">\
        <div class="content">\
          <div class="order-area">\
            <div class="has-no-order">\
              <h4 class="content-title">��û������κ���Ʒ</h4>\
              <a href="/" class="btn big-btn status2-btn" style="margin-right:0;">�Ͻ�ȥѡ���� &gt;&gt;</a>\
            </div>\
          </div>\
        </div>\
      </div>';
		var data = d.goods_list;
		var html = !data.length?M.mstmpl(tmpl,{data:d}):emptyTmpl;
		M.loadingEnd();
	});
 })();
