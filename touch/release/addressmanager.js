(function(){window.current_id=location.href.split("id=").pop();var b=$("#address_container");var a='<%for(var i=0;i<data.length;i++){%>						<div class="data-item address_item" data-id="<%=data[i].address_id%>">							<p class="address-detail">							北京市-<%=data[i].cityName%> <%=data[i].districtName%> <%=data[i].address%><br/>							<%=data[i].consignee%> <span class="address-num"><%=data[i].mobile%></span>							<em class="wap-radio wap-radio-item <%if(data[i].address_id == window.current_id){%>checked<% } %>"></em>							</p>						  </div>						<% }　%>';M.get("route.php?mod=order&action=get_order_address",{},function(f){var e;f=f.reverse();var c=M.mstmpl(a,{data:f});b.show().append(c)});$("#new_address_link")[CLICK](function(){location.href="/newaddress"});$("body").delegate(".address_item",CLICK,function(){location.href="/checkout?addressid="+$(this).data("id")})})();