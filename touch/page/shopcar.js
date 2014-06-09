  (function(){
        var tmpl = '<% for(var i=0;i<data.length;i++){ %>\
			<div class="wap-order-item" id="sub_order_<%=data[i].rec_id%>">\
				<%if(data[i].goods_id == CAT_CAKE) {%>\
					<img src="'+M.staticDomain+'css/img/cat-little.jpg" class="woi-img">\
				<% } else {%>\
				<img src="http://www.mescake.com/themes/default/images/sgoods/<%=data[i].goods_sn.substring(0,3)%>.jpg" class="woi-img">\
				<% } %>\
			    <div class="woi-intro-area">\
				  <p class="woi-title"><%=data[i].goods_name%></p>\
				  <p class="woi-tip">尺寸：<%=data[i].goods_attr%><span class="woi-price" id="sub_total_<%=data[i].rec_id%>"><%=data[i].subtotal%>元</span></p>\
				  <div class="" style="padding-top:6px;">\
					  <em class="minus-ico-me order_des" data-id="<%=data[i].rec_id%>">-</em>\
					  <input disabled="true" type="text" class="global-input num-input" style="width:30px;" value="<%=data[i].goods_number%>">\
					  <em class="add-ico-me order_add" data-id="<%=data[i].rec_id%>">+</em>\
				   </div>\
				</div>\
			</div>\
		   <% } %>'
	M.get('route.php?mod=order&action=get_order_list',{},function(d){
	  var html = M.mstmpl(tmpl,{data:d.goods_list});
	  var count = d.goods_list.length;
	  if(count == 0){
				location.href = M.touchDomain+'shopcarempty';
				return;
	  }
	  $('#staff_count').html(count);
	  $('#order_price').after(html).html(d.order_total.amount_formated);
	  $('#total_price').html(d.order_total.amount_formated);
	  M.loadingEnd();
	});
	var container = $('body');
	window.updateTotalPriceDisplay = function (d){
			if(d.order_total == false){
				location.href = M.touchDomain+'shopcarempty';
				return;
			}
			d = d.order_total;
			//$('.order_total').html('￥'+(parseFloat(d.goods_price,10)+parseFloat(d.pack_fee,10)));
			$('#total_price').html(d.amount_formated);
			$('#order_price').html(d.amount_formated);
	}

	var updateCart = function(id,num){
				M.get('route.php',{
					id:id,
					num:num,
					mod:'order',
					action:'update_cart'
				},function(d){
					$('#sub_total_'+id).html(d.result);
					//update free fork number;
					//update total price
					updateTotalPriceDisplay(d);
				});
	}
	
	
	
    container.delegate('.order_add','click',function(){
				var _this = $(this);
				var id=_this.data('id');
				var num = parseInt(_this.prev().val(),10);
				num+=1;
				_this.prev().val(num);
				updateCart(id,num);
				
			}).delegate('.order_des','click',function(){
				var _this = $(this);
				var id=_this.data('id');
				var num =parseInt( _this.next().val(),10);
				num-=1;
				if(num<1){
					M.confirm('删除该商品？',function(){
						M.get('route.php?mod=order&action=drop_shopcart',{id:id},function(d){
							$('.sub_order_'+id).remove();
							$('#sub_order_'+id).remove();
							updateTotalPriceDisplay(d);
						});
					},function(){
						num = 1;
						_this.next().val(num);
					});
				}else{
					_this.next().val(num);
					updateCart(id,num);
				}
			}).delegate('.order_cancel','click',function(){
				var _this = $(this);
				var id=_this.data('id');
				var goods_id=_this.data('goods');
				M.get('route.php?mod=order&action=drop_shopcart',{id:id},function(d){
					$('.sub_order_'+id).remove();
					$('#sub_order_'+id).remove();
					updateTotalPriceDisplay(d);
				});
				return false;

			})
 })(); 