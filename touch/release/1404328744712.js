(function(){var i;var h=$("#address_container");var g='<%for(var i=0;i<data.length;i++){%>						<div <%if(i>0){%>style="display:none"<%}%>class="ama-item address_item <%if(i==0){%>ama-item-current<%}%>" id="address_<%=data[i].address_id%>"							data-id="<%=data[i].address_id%>"							data-address="<%=data[i].address%>"							data-tel="<%=data[i].mobile%>"							data-contact="<%=data[i].consignee%>"							data-city="<%=data[i].city%>"							data-district="<%=data[i].district%>"						>						  <p class="ama-name-area"><b class="fl-l"><%=data[i].consignee%></b><span class="fl-r"><%=data[i].mobile%></span></p>						  <p class="address-area">							<span class="city">北京市</span>							<span class="area"><%=data[i].cityName%> <%=data[i].districtName%></span><br>							<span class="address"><%=data[i].address%></span>						  </p>						  <div class="clearfix handle-area">							<a href="#" class="ama-edit fl-l addr_edit hide" data-id="<%=data[i].address_id%>">修改</a>							<a href="#" class="ama-delete fl-r addr_del" data-id="<%=data[i].address_id%>">删除</a>						  </div>						</div>						<% }　%>';M.checklogin(function(D){if(D){window.IS_LOGIN=true;M.get("route.php?mod=order&action=get_order_address",{},function(F){F=F.reverse();var E=M.mstmpl(g,{data:F});if(F.length){i=F[0].address_id}if(F.length>1){$("#more_address_btn").show().click(function(){$(".address_item").show();$("#more_address_btn").hide()})}$("#new_address_btn").show();$("#new_address_btn")[CLICK](function(){location.href="/newaddress"});h.html(E)})}else{$("#new_address_container").show()}});var j=false;$("body").delegate(".pay_container",CLICK,function(){if(j){return}j=true;var E=$(this);var D=E.data("id");E.find("em").trigger(CLICK);$("#pay_id").val(D);setTimeout(function(){j=false},20)});var C=function(){M.get("route.php?mod=order&action=if_address_need_fee",{address_id:i},function(D){if(D.code==0){if(parseInt(D.fee)){r.shipping_fee_display.show()}else{r.shipping_fee_display.hide()}r.shipping_fee.val(D.fee);updateTotalPriceDisplay(D)}})};h.delegate(".address_item",CLICK,function(){var D=$(this);h.find(".address_item").removeClass("ama-item-current");D.addClass("ama-item-current");i=D.data("id");C()}).delegate(".addr_del",CLICK,function(){var E=$(this);var D=E.data("id");M.confirm("确认删除这个地址信息吗？",function(){M.post("route.php?mod=order&action=del_order_address",{id:D},function(F){if(F.code==0){if(window.CURRENT_ADDRESS_ID==D){window.CURRENT_ADDRESS_ID=null}$("#address_"+D).remove()}})});return false}).delegate(".addr_edit",CLICK,function(){var E=$(this);var D=E.data("id");E=$("#address_"+D);CURRENT_ID=D;require(["ui/newaddress"],function(F){F.show({mod:true,id:D,data:{city:E.data("city"),address:E.data("address"),tel:E.data("tel"),contact:E.data("contact"),district:E.data("district")},callback:function(G){JQ.address_container.find(".address_item").removeClass("ama-item-current");i=G;$("#address_"+G).addClass("ama-item-current");C()}})});return false});var e=(new Date(server_date*1));var m=e.getFullYear();var B=e.getMonth()+1;var v=e.getDate();var d=e.getHours();var t=e.getMinutes();var y="";var c="";var r={year_sel:$("#year_sel"),month_sel:$("#month_sel"),day_sel:$("#day_sel"),hour_sel:$("#hour_sel"),minute_sel:$("#minute_sel"),region_sel:$("#region_sel"),dis_district:$("#district_sel"),message_input:$("#message_input"),shipping_fee_display:$("#shipping_fee_display"),shipping_fee:$("#shipping_fee")};var z=function(){return r.year_sel.val()+"-"+r.month_sel.val()+"-"+r.day_sel.val()};var o=function(){return m+"-"+B+"-"+v};var n=function(G){var D="";for(var E=G;E<=12;E++){var F=E;if(F<10){F="0"+F}D+='<option value="'+F+'">'+E+"月</option>"}r.month_sel.html(D);r.month_sel.prev().html(G+"月")};var u=function(F){var D="";for(var G=F;G<=31;G++){var E=G;if(E<10){E="0"+E}D+='<option value="'+E+'">'+G+"日</option>"}r.day_sel.html(D);r.day_sel.prev().html(F+"日")};var A=function(G,E,H){var D="";if(H){r.hour_sel.html("<option>"+H+"</option>");r.hour_sel.prev().html(H)}else{for(var F=G;F<=E;F++){D+='<option value="'+F+'">'+F+"时</option>"}r.hour_sel.html(D);r.hour_sel.prev().html(G+"时")}};var s=function(G){var I='<option value="0">0</option>';var H='<option value="30">30</option>';var F='<option value="0">0</option><option value="30">30</option>';var D="";var E=0;if(G==1){D=I}else{if(G==2){D=H;E=30}else{if(G==3){D=F}}}r.minute_sel.html(D);r.minute_sel.prev().html(E+"分")};var a=function(){var L=z();var E=o();var N=d;var I=(new Date(E)).getTime();var K=(new Date(L)).getTime();var F='<option value="0">小时</option>';r.minute_sel.parent().show();r.hour_sel.parent().css({width:"26%"});if(window.HAS_BIG_STAFF||window.HAS_NO_SUGAR_STAFF){if(K-I>3600*1000*24){for(var H=14;H<=22;H++){F+='<option value="'+H+'">'+H+"</option>"}}else{if(window.HAS_NO_SUGAR_STAFF){F=('<option value="0">无糖蛋糕制作需要24小时，所选择日期不能送货</option>')}else{F=('<option value="0">大于5磅蛋糕制作需要24小时，所选择日期不能送货</option>')}r.minute_sel.parent().hide();r.hour_sel.parent().css({width:"90%"})}}else{if((K-I==3600*1000*24&&N>21)||(K==I&&N<10)){A(14,22)}else{var O=22;var J=10;var D=d;var G=t;D+=5;if(E==L){if(G>=30){D+=1}if(d>O){A(J,O,"制作需要5小时，今天已不能送货");r.minute_sel.parent().hide();r.hour_sel.parent().css({width:"90%"})}else{if(d<J){A(J,O)}else{A(d,O)}}}else{A(J,O)}}}};var f=function(){var F=r.hour_sel.val();var E=z();var D=o();if(F==22){s(1)}else{if(D==E){if(t<30&&r.hour_sel.val()==d+5){s(2)}else{s(3)}}else{s(3)}}};r.year_sel.change(function(){var D="";if($(this).val()>m){n(1);u(1)}else{n(B);u(v)}a()});r.month_sel.change(function(){var D=r.year_sel.val();var E=r.month_sel.val();if(D>m||(D==m&&E>B)){u(1)}else{u(v)}a()});r.day_sel.change(function(){a()});r.hour_sel.change(function(){f()});n(B);u(v);a();f();$(".date-select").find("select").change(function(){var G=$(this);var F=G.val();var D=G.attr("type");var E="";switch(D){case"year":E="年";break;case"month":E="月";break;case"day":E="日";break;case"hour":E="时";break;case"minute":E="分";break;case"region":E="";F=F.split("_")[1];break;case"district":E="";F=F.split("_")[1];break}G.prev().html(F+E)});r.region_sel.change(function(){var D=$(this).val().split("_")[0];if(D==0){return}M.get("route.php?mod=order&action=get_district",{city:D},function(H){if(H.code==0){var G='<option value="0">选择送货街道</option>';if(H.data){for(var F in H.data){var E=H.data[F].name;if(!H.data[F].free){if(E.indexOf("*")<0){E="*"+E}}G+='<option value="'+F+"_"+E+'">'+E+"</option>"}r.dis_district.html(G);r.dis_district.parent().show()}else{r.dis_district.html(G);r.dis_district.parent().hide()}}})});r.dis_district.change(function(){M.get("route.php?mod=order&action=shipping_fee_cal",{city:r.region_sel.val().split("_")[0],district:$(this).val().split("_")[0]},function(D){if(D.code==0&&!window.IS_LOGIN){if(D.fee!=0){r.shipping_fee_display.show()}else{r.shipping_fee_display.hide()}r.shipping_fee.val(D.fee);updateTotalPriceDisplay(D)}})});M.get("route.php?mod=order&action=get_region",{},function(F){var E='<option value="0">选择地区</option>';for(var D=0;D<F.length;D++){if(F[D].region_id==571||F[D].region_id==572){F[D].region_name+="*"}E+='<option value="'+F[D].region_id+"_"+F[D].region_name+'">'+F[D].region_name+"</option>"}r.region_sel.append(E)});var x=function(){M.post("route.php?mod=order&action=checkout",{card_message:"",vaild_code:"",source:"FROM_MOBILE"},function(D){var E=r.message_input;$("#leaving_message").val(E.val());if(D.code==0){$("#submit_form").submit()}else{p()}})};var l=function(){if(!z()){return false}var D=r.hour_sel.val();if(D>22||D<10){return false}var E=r.minute_sel.val();if(E!=0&&E!=30){return false}return true};var p=function(){M.loadingEnd()};var k=function(F,E){var D=F.parent();D.addClass("animated flash");F.addClass("error-border");$("#scroll_container").scrollTop(E);D[0].addEventListener("webkitAnimationEnd",function(){D.removeClass("animated flash");F.removeClass("error-border")})};var b=function(){if($("#new_address").val()==""){k($("#new_address"),300);return false}if($("#new_contact").val()==""){k($("#new_contact"),350);return false}if(!M.IS_MOBILE($("#new_tel").val())){k($("#new_tel"),400);return false}return true};var q=function(){if(r.region_sel.val()=="0"){k(r.region_sel,300);return false}if(r.dis_district.val()=="0"&&r.dis_district.parent().css("display")!="none"){k(r.dis_district,300);return false}return true};var w=function(G){var E=this;var D;if(i){D=$("#address_"+i)}else{if(!b()){return false}if(!q()){return false}}if(r.hour_sel.css("display")=="none"){return false}var F={address_id:i||0,consignee:D?D.data("contact"):$("#new_contact").val(),country:441,city:D?D.data("city"):r.region_sel.val().split("_")[0],address:D?D.data("address"):$("#new_address").val(),district:D?D.data("district"):r.dis_district.val().split("_")[0],mobile:D?D.data("tel"):$("#new_tel").val(),bdate:z(),hour:r.hour_sel.val(),minute:r.minute_sel.val(),message_input:r.message_input.val().substring(0,140),inv_payee:"",inv_content:""};if(!l()){M.confirm("您选择的送货时间或日期不正确，请重新选择");p();return}M.loading();M.post("route.php?action=save_consignee&mod=order",F||{},function(H){if(H.msg=="time error"){M.confirm("您所选择的送货时间距离制作时间不能少于5小时!")}if(H.code!=0){M.confirm("收货信息填写不完整，重新填写后再提交");p();return}if(window.IS_LOGIN){x()}else{var I=$("#new_tel").val();if(!M.IS_MOBILE(I)){M.inputError("new_tel_error");return}M.get("route.php?action=check_user_exsit&mod=account",{username:I},function(J){if(J.exsit){M.confirm("您所使用的手机号已经被注册，请登录后再继续订购",function(){location.href="/login"});p()}else{var K=F.mobile;M.post("route.php?action=auto_register&mod=account",{username:K},function(L){if(L.code==0){setTimeout(function(){x()},100)}else{p()}})}})}})};$("#done_button")[CLICK](function(){w()});$(".pay_sel")[CLICK](function(){$(".pay_sel").removeClass("checked");$(this).addClass("checked")})})();(function(){var b='<% for(var i=0;i<data.length;i++){ %>			<div class="wap-order-item" id="sub_order_<%=data[i].rec_id%>">				<%if(data[i].goods_id == CAT_CAKE) {%>					<img src="'+M.staticDomain+'css/img/cat-little.jpg" class="woi-img">				<% } else {%>				<img src="http://www.mescake.com/themes/default/images/sgoods/<%=data[i].goods_sn.substring(0,3)%>.jpg" class="woi-img">				<% } %>			    <div class="woi-intro-area">				  <p class="woi-title"><%=data[i].goods_name%><span class="woi-tip">(尺寸：<%=data[i].goods_attr%>)</span></p>				  <span class="woi-price" id="sub_total_<%=data[i].rec_id%>"><%=data[i].subtotal%>元</span>				  <div style="padding-top:6px;">					  <em class="minus-ico-me order_des" data-id="<%=data[i].rec_id%>">-</em>					  <input disabled="true" type="text" class="global-input num-input" style="width:30px;" value="<%=data[i].goods_number%>">					  <em class="add-ico-me order_add" data-id="<%=data[i].rec_id%>">+</em>				   </div>				</div>			</div>		   <% } %>';M.get("route.php?mod=order&action=get_order_list",{},function(g){var e=M.mstmpl(b,{data:g.goods_list});var f=g.goods_list.length;if(f==0){location.href=M.touchDomain+"shopcarempty";return}$("#staff_count").html(f);$("#order_price").after(e).html(g.order_total.amount_formated);$("#total_price").html(g.order_total.amount_formated);M.loadingEnd()});var a=$("body");window.updateTotalPriceDisplay=function(e){if(e.order_total==false){location.href=M.touchDomain+"shopcarempty";return}e=e.order_total;$("#total_price").html(e.amount_formated);$("#order_price").html(e.amount_formated)};var c=function(e,d){M.get("route.php",{id:e,num:d,mod:"order",action:"update_cart"},function(f){$("#sub_total_"+e).html(f.result);updateTotalPriceDisplay(f)})};a.delegate(".order_add",CLICK,function(){var f=$(this);var e=f.data("id");var d=parseInt(f.prev().val(),10);d+=1;f.prev().val(d);c(e,d)}).delegate(".order_des",CLICK,function(){var f=$(this);var e=f.data("id");var d=parseInt(f.next().val(),10);d-=1;if(d<1){M.confirm("删除该商品？",function(){M.get("route.php?mod=order&action=drop_shopcart",{id:e},function(g){$(".sub_order_"+e).remove();$("#sub_order_"+e).remove();updateTotalPriceDisplay(g)})},function(){d=1;f.next().val(d)})}else{f.next().val(d);c(e,d)}}).delegate(".order_cancel",CLICK,function(){var f=$(this);var e=f.data("id");var d=f.data("goods");M.get("route.php?mod=order&action=drop_shopcart",{id:e},function(g){$(".sub_order_"+e).remove();$("#sub_order_"+e).remove();updateTotalPriceDisplay(g)});return false})})();