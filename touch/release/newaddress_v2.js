(function(){var b=0;var a=function(o){b++;var x=this;var o=o||{};x.el=$(o.el);x.onclick=o.onclick||function(){};var j=x.el.next().val();var e=x.type=o.type;var h='<div class="area-list date-list" id="picker_'+b+'">					   <p class="first"><em class="data-corner-left" style="display:none"></em><span class="picker_title">选择日期</span><em class="data-corner-right" style="display:none"></em></p>					  <ul>						<%=container%>					  </ul>					</div>';var n=$("body");if(e=="zone"){M.get("route.php?mod=order&action=get_region",{},function(B){var z="";for(var y=0;y<B.length;y++){var A="";if(B[y].region_id==571||B[y].region_id==572){B[y].region_name+="*"}if(B[y].region_id==j){A="current"}z+='<li class="pos-r '+A+'" data-id="'+B[y].region_id+'"  style="position:relative">'+B[y].region_name+"</li>"}h=h.replace("<%=container%>",z);n.append(h);x.defaultEvent();x.setTitle("选择区")})}else{if(e=="street"){var u=o.data;var k="";for(var t in u){var g="";if(t==j){g="current"}k+='<li class="pos-r '+g+'" data-id="'+t+'"  style="position:relative">'+u[t].name+'<em class="wap-radio wap-radio-item current '+g+'"></em></li>'}h=h.replace("<%=container%>",k);n.append(h);x.defaultEvent();x.setTitle("选择街道")}else{if(e=="date"){var k="";var p=parseInt(window.server_date);j=$("#month_sel").val()+$("#day_sel").val();for(var t=0;t<30;t++){var m=new Date(p);var l=m.getFullYear();var w=m.getMonth()+1;var s=m.getDate();p=p+(3600*24*1000);var r=w+"月"+s+"日";var g="";if(w+""+s==j){g="current"}k+='<li class="pos-r '+g+'" data-day="'+s+'" data-month="'+w+'" data-year="'+l+'"  style="position:relative">'+r+"</li>"}h=h.replace("<%=container%>",k);n.append(h);x.defaultEvent();x.setTitle("选择送货日期")}else{if(e=="time"){var k="";j=$("#hour_sel").val()+$("#minute_sel").val();var v=o.beginHour;var c=o.endHour;for(var t=v;t<=c;t++){var f=t;var q=0;var r=t+":00";var g="";if(f+"0"==j){g="current"}k+='<li class="pos-r '+g+'" data-hour="'+f+'" data-minute="'+q+'"  style="position:relative">'+r+"</li>";if(t<22){var r=t+":30";q=30;g="";if(f+""+q==j){g="current"}k+='<li class="pos-r '+g+'" data-hour="'+f+'" data-minute="'+q+'" style="position:relative">'+r+"</li>"}}h=h.replace("<%=container%>",k);n.append(h);x.defaultEvent();x.setTitle("选择送货时间")}}}}n.append('<div class="gray-bg pick_bg" style="z-index:10;"></div>');$("#scroll_container").css("overflow","hidden");$(".pick_bg")[CLICK](function(){x.destory()})};a.prototype.defaultEvent=function(){var c=this;c.listContainer=$("#picker_"+b);c.listContainer.delegate("li",CLICK,function(){var d=$(this);c.el.next().val(d.data("id"));c.el.val(d.text());c.destory();if(c.type=="date"){c.onclick(d.data("year"),d.data("month"),d.data("day"))}else{if(c.type=="time"){c.onclick(d.data("hour"),d.data("minute"),d.data("day"))}else{c.onclick(d.data("id"))}}})};a.prototype.close=function(){$("#scroll_container").css("overflow","auto");this.listContainer.hide();$(".pick_bg").remove()};a.prototype.destory=function(){$("#scroll_container").css("overflow","auto");this.listContainer.remove();$(".pick_bg").remove()};a.prototype.setTitle=function(c){this.listContainer.find(".picker_title").html(c)};window.Picker=a})();(function(){var c={region_sel:$("#region_sel"),dis_district:$("#district_sel")};var f;var e=$("#street_container");var d=$("#zone_container");$("#zone_picker")[CLICK](function(){new Picker({type:"zone",el:this,onclick:function(k){M.get("route.php?mod=order&action=get_district",{city:k},function(n){if(n.code==0){if(n.data){for(var m in n.data){var l=n.data[m].name;if(!n.data[m].free){if(l.indexOf("*")<0){n.data[m].name="*"+l}}}f=n.data;e.show();d.css({width:"30%"})}else{e.hide();d.css({width:"75%"})}}})}})});$("#street_picker")[CLICK](function(){new Picker({type:"street",el:this,data:f,onclick:function(k){}})});var j=$("#region_sel");var h=$("#district_sel");var i=$("#new_address_popup");var b=$("#new_contact_popup");var a=$("#new_tel_popup");var g=function(){if($.trim(b.val())==""){M.confirm("请填写一个收货人姓名");return false}var k=$.trim(a.val());if(!/\d{5,}/.test(k)){M.confirm("请填写一个合法的联系方式");return false}if($.trim($("#region_sel").val())==0){M.confirm("送货地区选择错误");return false}if($.trim(h.val())==0&&h.parent().css("display")!="none"){M.confirm("送货地区选择错误");return false}if($.trim(i.val())==""){M.confirm("请填写收货地址");return false}return true};$("#save_address")[CLICK](function(){var o=j.val();var n=h.val();var l=i.val();var m=a.val();var k=b.val();if(!g()){return}M.loading();M.post("route.php?mod=order&action=add_order_address",{country:441,city:o.split("_")[0],address:l,district:n.split("_")[0],tel:m,contact:k},function(p){if(p.code==0){location.href=M.touchDomain+"checkout"}})})})();