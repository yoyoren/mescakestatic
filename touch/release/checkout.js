(function(){var y=location.href.split("addressid=").pop();var k;var i=$("#address_container");var n='<p class="address-detail address_item" data-id="<%=data.address_id%>" id="address_<%=data.address_id%>"							data-id="<%=data.address_id%>"							data-address="<%=data.address%>"							data-tel="<%=data.mobile%>"							data-contact="<%=data.consignee%>"							data-city="<%=data.city%>"							data-district="<%=data.district%>"						>						北京市-<%=data.cityName%> <%=data.districtName%> <%=data.address%><br>						<%=data.consignee%> <span class="address-num"><%=data.mobile%></span>						<em class="wap-more-ico"></em>						</p>';M.checklogin(function(G){if(G){window.IS_LOGIN=true;M.get("route.php?mod=order&action=get_order_address",{},function(K){var J;K=K.reverse();if(y){for(var I=0;I<K.length;I++){if(K[I].address_id==y){J=K[I]}}if(!J){J=K[0]}}else{J=K[0]}var H=M.mstmpl(n,{data:J});if(K.length){k=J.address_id;i.show().append(H)}else{$("#new_address_link").show()}F()})}else{$("#new_address_container").show()}});var j;var b=$("#street_container");var q=$("#zone_container");var A;$("#zone_picker")[CLICK](function(){new Picker({type:"zone",el:this,onclick:function(G){A=G;d(A,0);M.get("route.php?mod=order&action=get_district",{city:G},function(J){if(J.code==0){if(J.data){for(var I in J.data){var H=J.data[I].name;if(!J.data[I].free){if(H.indexOf("*")<0){J.data[I].name="*"+H}}}j=J.data;b.show();q.css({width:"30%"})}else{b.hide();q.css({width:"75%"})}}})}})});$("#street_picker")[CLICK](function(){new Picker({type:"street",el:this,data:j,onclick:function(G){d(A,G)}})});var h=(new Date(server_date*1));var p=h.getFullYear();var E=h.getMonth()+1;var x=h.getDate();var g=h.getHours();var w=h.getMinutes();var C="";var f="";var v={year_sel:$("#year_sel"),month_sel:$("#month_sel"),day_sel:$("#day_sel"),hour_sel:$("#hour_sel"),minute_sel:$("#minute_sel"),region_sel:$("#region_sel"),dis_district:$("#district_sel"),message_input:$("#message_input"),shipping_fee_display:$("#shipping_fee_display"),shipping_fee:$("#shipping_fee")};var D=function(){var G=v.month_sel.val();if(G<10){G="0"+G}return v.year_sel.val()+"-"+G+"-"+v.day_sel.val()};var r=function(){return p+"-"+E+"-"+x};var e=22;var u=10;var a="";$("#date_picker")[CLICK](function(){$("#time_picker").val("");a=false;new Picker({type:"date",el:this,onclick:function(Q,P,R){v.year_sel.val(Q);v.month_sel.val(P);v.day_sel.val(R);u=10;e=22;var S=(new Date(server_date*1));var L="";var N=D();var H=r();var O=S.getHours();var J=(new Date(window.server_date)).getTime();var K=(new Date(N)).getTime();if(window.HAS_BIG_STAFF||window.HAS_NO_SUGAR_STAFF){if(K-J>3600*1000*24){u=14}else{if(window.HAS_NO_SUGAR_STAFF){a="无糖蛋糕制作需要24小时，所选择日期不能送货"}else{a="大于5磅蛋糕制作需要24小时，所选择日期不能送货"}}}else{if((K-J==3600*1000*24&&O>21)||(K==J&&O<10)){u=14}else{var G=g;var I=w;G+=5;if(H==N){if(I>=30){G+=1}if(G>e){a="制作需要5小时，今天已不能送货"}else{if(g<10){u=14}else{u=G}}}}}if(a){$("#time_picker").val(a)}}})});$("#time_picker")[CLICK](function(){if(a){return}new Picker({type:"time",el:this,beginHour:u,endHour:e,tips:a,onclick:function(G,H){v.hour_sel.val(G);v.minute_sel.val(H)}})});var l=false;$("body").delegate(".pay_container",CLICK,function(){if(l){return}l=true;var H=$(this);var G=H.data("id");H.find("em").trigger(CLICK);$("#pay_id").val(G);setTimeout(function(){l=false},20)});var t=function(G){if(parseInt(G.fee)){v.shipping_fee_display.show();$("#fee_bar").show();$("#address_fee_top").html("10元")}else{v.shipping_fee_display.hide();$("#fee_bar").hide();$("#address_fee_top").html("免邮费")}v.shipping_fee.val(G.fee);updateTotalPriceDisplay(G)};var d=function(H,G){M.get("route.php?mod=order&action=shipping_fee_cal",{city:H,district:G},function(I){t(I)})};var F=function(){M.get("route.php?mod=order&action=if_address_need_fee",{address_id:k},function(G){if(G.code==0){t(G)}})};i.delegate(".address_item",CLICK,function(){var G=$(this);i.find(".address_item").removeClass("ama-item-current");G.addClass("ama-item-current");k=G.data("id")}).delegate(".addr_del",CLICK,function(){var H=$(this);var G=H.data("id");M.confirm("确认删除这个地址信息吗？",function(){M.post("route.php?mod=order&action=del_order_address",{id:G},function(I){if(I.code==0){if(window.CURRENT_ADDRESS_ID==G){window.CURRENT_ADDRESS_ID=null}$("#address_"+G).remove()}})});return false}).delegate(".addr_edit",CLICK,function(){var H=$(this);var G=H.data("id");H=$("#address_"+G);CURRENT_ID=G;require(["ui/newaddress"],function(I){I.show({mod:true,id:G,data:{city:H.data("city"),address:H.data("address"),tel:H.data("tel"),contact:H.data("contact"),district:H.data("district")},callback:function(J){JQ.address_container.find(".address_item").removeClass("ama-item-current");k=J;$("#address_"+J).addClass("ama-item-current");F()}})});return false}).delegate(".address_item",CLICK,function(){M.loading();var G=$(this).data("id");location.href="/addressmanager?id="+G});var B=function(){M.post("route.php?mod=order&action=checkout",{card_message:"",vaild_code:"",source:"FROM_MOBILE"},function(G){var H=v.message_input;$("#leaving_message").val(H.val());if(G.code==0){$("#submit_form").submit()}else{s()}})};var o=function(){var H=true;if(!D()){H=false}var G=v.hour_sel.val();if(G>22||G<10){H=false}var I=v.minute_sel.val();if(I!=0&&I!=30){H=false}if($("#date_picker").val()==""){m($("#date_picker"),350);return H}return H};var s=function(){M.loadingEnd()};var m=function(I,H){var G=I.parent();I.addClass("error-border");$("#scroll_container").scrollTop(H);setTimeout(function(){I.removeClass("error-border")},2000)};var c=function(){if($("#new_contact").val()==""){m($("#new_contact"),350);return false}if(!M.IS_MOBILE($("#new_tel").val())){m($("#new_tel"),400);return false}if($("#district_sel").val()==0&&$("#street_container").css("display")!="none"){m($("#street_picker"),300);return false}if($("#region_sel").val()==0){m($("#zone_picker"),300);return false}if($("#new_address").val()==""){m($("#new_address"),300);return false}return true};var z=function(J){var H=this;var G;if(k){G=$("#address_"+k)}else{if(!c()){return false}}var I={address_id:k||0,consignee:G?G.data("contact"):$("#new_contact").val(),country:441,city:G?G.data("city"):v.region_sel.val(),address:G?G.data("address"):$("#new_address").val(),district:G?G.data("district"):v.dis_district.val(),mobile:G?G.data("tel"):$("#new_tel").val(),bdate:D(),hour:v.hour_sel.val(),minute:v.minute_sel.val(),message_input:v.message_input.val().substring(0,140),inv_payee:"",inv_content:""};if(!o()){s();return}M.loading();M.post("route.php?action=save_consignee&mod=order",I||{},function(K){if(K.msg=="time error"){M.confirm("您所选择的送货时间距离制作时间不能少于5小时!")}if(K.code!=0){M.confirm("收货信息填写不完整，重新填写后再提交");s();return}if(window.IS_LOGIN){B()}else{var L=$("#new_tel").val();if(!M.IS_MOBILE(L)){M.inputError("new_tel_error");return}M.get("route.php?action=check_user_exsit&mod=account",{username:L},function(N){if(N.exsit){M.confirm("您所使用的手机号已经被注册，请登录后再继续订购",function(){location.href="/login"});s()}else{var O=I.mobile;M.post("route.php?action=auto_register&mod=account",{username:O},function(P){if(P.code==0){setTimeout(function(){B()},100)}else{s()}})}})}})};$("#done_button")[CLICK](function(){z()});$(".pay_sel")[CLICK](function(){$(".pay_sel").removeClass("checked");$(this).addClass("checked")})})();(function(){var b='<% for(var i=0;i<data.length;i++){ %>			<div class="wap-order-item" id="sub_order_<%=data[i].rec_id%>">				<%if(data[i].goods_id == CAT_CAKE) {%>					<img src="'+M.staticDomain+'css/img/cat-little.jpg" class="woi-img">				<% } else {%>				<img src="http://www.mescake.com/themes/default/images/sgoods/<%=data[i].goods_sn.substring(0,3)%>.jpg" class="woi-img">				<% } %>			    <div class="woi-intro-area">				  <p class="woi-title"><%=data[i].goods_name%><span class="woi-tip">(尺寸：<%=data[i].goods_attr%>)</span></p>				  <span class="woi-price" id="sub_total_<%=data[i].rec_id%>"><%=data[i].subtotal%>元</span>				  <div style="padding-top:6px;">					  <em class="minus-ico-me order_des" data-id="<%=data[i].rec_id%>">-</em>					  <input disabled="true" type="text" class="global-input num-input" style="width:30px;" value="<%=data[i].goods_number%>">					  <em class="add-ico-me order_add" data-id="<%=data[i].rec_id%>">+</em>				   </div>				</div>			</div>		   <% } %>';M.get("route.php?mod=order&action=get_order_list",{},function(g){var e=M.mstmpl(b,{data:g.goods_list});var f=g.goods_list.length;if(f==0){location.href=M.touchDomain+"shopcarempty";return}$("#staff_count").html(f);$("#order_price").after(e).html(g.order_total.amount_formated);$("#total_price").html(g.order_total.amount_formated);M.loadingEnd()});var a=$("body");window.updateTotalPriceDisplay=function(e){if(e.order_total==false){location.href=M.touchDomain+"shopcarempty";return}e=e.order_total;$("#total_price").html(e.amount_formated);$("#order_price").html(e.amount_formated)};var c=function(e,d){M.get("route.php",{id:e,num:d,mod:"order",action:"update_cart"},function(f){$("#sub_total_"+e).html(f.result);updateTotalPriceDisplay(f)})};a.delegate(".order_add",CLICK,function(){var f=$(this);var e=f.data("id");var d=parseInt(f.prev().val(),10);d+=1;f.prev().val(d);c(e,d)}).delegate(".order_des",CLICK,function(){var f=$(this);var e=f.data("id");var d=parseInt(f.next().val(),10);d-=1;if(d<1){M.confirm("删除该商品？",function(){M.get("route.php?mod=order&action=drop_shopcart",{id:e},function(g){$(".sub_order_"+e).remove();$("#sub_order_"+e).remove();updateTotalPriceDisplay(g)})},function(){d=1;f.next().val(d)})}else{f.next().val(d);c(e,d)}}).delegate(".order_cancel",CLICK,function(){var f=$(this);var e=f.data("id");var d=f.data("goods");M.get("route.php?mod=order&action=drop_shopcart",{id:e},function(g){$(".sub_order_"+e).remove();$("#sub_order_"+e).remove();updateTotalPriceDisplay(g)});return false})})();