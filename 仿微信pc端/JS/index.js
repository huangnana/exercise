;(function(){
	//组织浏览器选中的默认行为
	document.onselectstart=function(){
		return false;
	}
	var page = $("#page");
	var oriW = page.outerWidth();
	var oriH = page.outerHeight();
	// 清除页面的右击默认事件
	page.on("contextmenu",function(ev){
		ev.preventDefault();
	})
	// 点击页面清除弹窗
	$(document).on("click",function(){
		if($(".tanBox").length != 0 ){
			$(".tanBox").remove();
		}
	})
	//初始居中
	function resize(){
		var L=($(document).width()-page.width())/2;
		var H=($(document).height()-page.height())/2;
		page.css("left",L);
		page.css("top",H)
	}
	// 窗口改变时，页面始终居中
	window.onresize = resize;  
	resize();page
//.............................. 渲染页面...........................................
// 把数据存储到local storage
	var  storage ={
		save:function(key,value){
			// 设置localStorage  字符串转化为jsonp对象格式
			localStorage.setItem(key,JSON.stringify(value))
		},
		fetch:function(key){
			// 从localStorage中取值 
			return JSON.parse(localStorage.getItem(key)) || [];
		}
	}
	if(storage.fetch("weixin").length==0){
		storage.save("weixin",WXdata.list)
	}
	var data = storage.fetch("weixin");
	var vm = new Vue({
		el:".pageContent",
		data:{
			list:data,
			isSelected:{},
			seekValue:"",
			textValue:"",
			massagediv:null
		},
		watch:{  // Vue提供监测数据变化的方法
			list:{ //要检测的数据呢
				handler:function(){  //数据发生变化时执行的函数
					storage.save("weixin",this.list)
				},
				deep:true  //是否深度检测
			}
		},
		methods:{
			friendShow:function(itme,index){  
				this.isSelected=this.list[index];
				$(".friend_show").css("display","block");
			},
			seekFn:function(str){ //搜素好友
				if(str.length==0){
					return;
				}
				var list = [];
				for (var i=0;i<this.list.length;i++) {
						if(this.list[i].name.match(str)){
							list.push(this.list[i])
						}
				}
				return list
			},
			seekShow:function(){
				$(".talk_list ul").css("display","none");
				$(".seekList").css("display","block");
			},
			seekClick:function(id){
				this.sendMassage(id);
				$(".talk_list ul").css("display","none");
				$(".talkList").css("display","block");
				this.seekValue = "";
			},
			massageShow:function(id){ // 显示当前正选中的好友
				for (var i=0;i<this.list.length;i++) {
					if(this.list[i].id==id){
						this.isSelected=this.list[i];
						break;
					}
				}
				$(".massage_show").css("display","block");
			},
			sendMassage:function(id){  // 点击好友的发送消息按钮
				for (var i=0;i<this.list.length;i++) {
					if(this.list[i].id===id){
						this.list[i].istalking="true";
						break;
					}
				}
				talk();
			},
			deleTalk:function(id){  // 删除聊天好友列表中的某一项
				for (var i=0;i<this.list.length;i++) {
					if(this.list[i].id==id){
						this.list[i].istalking="false";
						break;
					}
				}
			},
			deleDialog:function(id){  // 聊天好友列表的右击弹窗
				$.dialog([    //弹窗
					{
						title:"删除聊天",
						todo:function(){
							vm.deleTalk(id);
						}
					}
				])
			},
			listDialog:function(id){  //通讯录列表的右击弹窗
				$.dialog([    //弹窗
					{
						title:"发消息",
						todo:function(){
							vm.massageShow(id);
							vm.sendMassage(id);
						}
					},
					{
						title:"删除好友",
						todo:function(){
							vm.deleData(id);
						}
					}
				])
			},
			deleData:function(id){ // 删除好友id
				for (var i=0;i<this.list.length;i++) {
					if(this.list[i].id==id){
						this.list.splice(i,1);
						break;
					}
				}
			},
			sendText:function(ev){ // 点击发送 输入框中的内容添加到消息列表中
				if(!$('.text').val().trim()){
					$.dialog([    //弹窗
						{
							title:"不能发送空白消息"
						}
					])
					$(".sendBox").append($(".tanBox"))
					$(".tanBox").css("top","-45px")
					$(".tanBox").css("left","-85px")
					ev.stopPropagation();
					return
				}
				replaceface($('.text').val());
				this.isSelected.massage.push(replaceface($('.text').val()));
				this.textValue="";
				scroll($(".show_talk"),$(".talk_info"));
			},
			massageDialog:function(index){   //右击消息弹窗
				$.dialog([    //弹窗
					{
						title:"删除",
						todo:function(){
							vm.deleMassage(index);
						}
					}
				])
			},
			deleMassage:function(index){ // 删除某条消息
				this.isSelected.massage.splice(index,1);
				scroll($(".show_talk"),$(".talk_info"));
			}
		},
		computed:{  //计算属性  
			talkList:function(){  //过滤数据   作为聊天好友列表
				var list=[] //定义空数组存储按照条件过滤的数据
				for (var i=0;i<this.list.length;i++) {
					if(this.list[i].istalking=="true"){
						list.push(this.list[i]);
					}
				}
				return list;
			},
			isUser:function(){
				var obj={};
				for (var i=0;i<this.list.length;i++) {
					if(this.list[i].isUser){
						obj = this.list[i]
					}
				}
				return obj;
			}
		}
	})
	function userPhoto(photo){
		var str = "<img src="+photo+"/>";
		return str;
	}
	$(".user").html(userPhoto(vm.isUser.photo)); // 用户头像
	$(".user").on("click",function(ev){
		$.dialog([    //弹窗
			{
				title:"<img src = '"+vm.isUser.photo+"'/>",
			},
			{
				title:vm.isUser.name,
				todo:function(){}
			},
			{
				title:"发消息",
				todo:function(){
					vm.massageShow(vm.isUser.id);
					vm.sendMassage(vm.isUser.id);
				}
			}
		])
		ev.stopPropagation();
	})
	$(function (ev){
		$(".face").smohanfacebox({
	
			Event : "click",	//触发事件	
	
			divid : "textBox", //外层DIV ID
	
			textid : "textArea" //文本框 ID
	
		});
	});
	scroll($(".show_talk"),$(".talk_info"));
// 输入框实现按Eenter键不换行，ctrl+enter键换行操作
	$(".text").on("keyup",function(){
		if(event.keyCode===13){
			$(".text").val($(".text").val().replace(/[\r\n]/g,""));
		}
		if(event.ctrlKey&&event.keyCode===13){
			$(".text").val($(".text").val()+'\n\r');
		}
	})
//  最近对话列表和通讯录列表之间切换
	$(".talk").on("click",talk);
	$(".address").on("click", address);
	function talk(){
		if($(".talk").hasClass("act_talk")){
			return;
		}
		$(".talk").addClass("act_talk");
		$(".talk_list ul").css("display","none");
		$(".talkList").css("display","block");
		$(".address").removeClass("act_address")
		$(".massage_show").css("display","block");
	}
	function address(){
		if($(this).hasClass("act_address")){
			return;
		}
		$(this).addClass("act_address");
		$(".talk_list ul").css("display","none");
		$(".friendList").css("display","block");
		$(".talk").removeClass("act_talk")
		$(".massage_show").css("display","none");
	}
//  添加鼠标事件  移入移除点击变色
	$(".talk_list").on("click",function(){
		var $target = $(event.target).closest("li");
		$(".talk_list li").removeClass("active");
		$target.addClass("active");
	})
	$(".talk_list").on("mouseover",function(){
		var $target = $(event.target).closest("li");
		$(".talk_list li").removeClass("hover");
		$target.addClass("hover");
	})
//.........................................窗口变化.......................................
//各个方向拉伸改变page窗口大小
	var dir = "";
	var changeCursor = true;//是否可以改变鼠标指针
	page[0].onmousemove = function(e){
		if(!changeCursor){
			return
		}
		dir = "";
		page[0].style.cursor = "default";
		var pos = page[0].getBoundingClientRect();
		if( e.clientY< pos.top+5 ){
			dir += "n";
		}
		if( e.clientY> pos.bottom-5 ){
			dir += "s";
		}
		if( e.clientX< pos.left+5){  //移到的是左侧部分
			dir += "w";
		}
		if( e.clientX> pos.right-4 ){
			dir += "e";
		}
		page[0].style.cursor = dir+"-resize";
	}
	page[0].onmousedown = function(e){
		changeCursor = false;
		var oriX = e.clientX;
		var oriY = e.clientY;
		var oriW = page[0].offsetWidth;
		var oriH = page[0].offsetHeight;
		var oriL = page[0].offsetLeft;
		var oriT = page[0].offsetTop;
		if(page[0].style.cursor == dir+"-resize"){
			var mask = document.createElement("div");
			mask.className="maskB";
			mask.style.width =page.width()+"px";
			mask.style.height= page.height()+"px";
			mask.style.left = page.css("left");
			mask.style.top= page.css("top");
			mask.style.cursor = dir+"-resize";
			document.body.appendChild(mask);
			var maskB = $(".maskB");
		}
		document.onmousemove = function(e){
			if( dir.indexOf("e")!=-1){
				mask.style.width = e.clientX - oriX + oriW + "px";
			}
			if( dir.indexOf("s")!=-1){
				mask.style.height = e.clientY - oriY + oriH + "px";
			}
			if( dir.indexOf("w")!=-1 ){
				mask.style.width = oriX - e.clientX + oriW + "px";
				mask.style.left = e.clientX - (oriX-oriL) + "px";
			}
			if( dir.indexOf("n")!=-1 ){
				mask.style.height = oriY - e.clientY + oriH + "px";
				mask.style.top = e.clientY - (oriY-oriT) + "px";
			}
		}
		document.onmouseup = function(){
			if(mask){
				page.width(maskB.width());
				page.height(maskB.height());
				page.css("left",maskB.css("left"));
				page.css("top",maskB.css("top"));
				document.body.removeChild(mask);
			}
			changeWH();
			mask = null;
			document.onmousemove = null;
			document.onmouseup = null;
			changeCursor = true;
		}
	}
//...................................添加拖拽....................................
		$().darg({
			DownEle:$(".show_top"),
			MoveEle:page
		});
		$().darg({
			DownEle:$(".pageNav"),
			MoveEle:page
		});
	// 窗口最大化
	function max(){
		var maxW = $(document).width();
		var maxH = $(document).height();
		page.outerHeight(maxH);
		page.outerWidth(maxW);
		page.css("left","-1px");
		page.css("top","0px")
		changeWH();
	}
	//恢复初始大小
	function recoverPage(){
		page.outerWidth(oriW);
		page.outerHeight(oriH);
		changeWH();
		resize();
	}
	// 窗口变化时各区域宽高实时变化
	var navBox = $(".navBox");
	var conNav = $(".con_nav");
	var conShow = $(".con_show");
	var showTop = $(".show_top");
	var showText = $(".show_text");
	var showTalk = $(".show_talk");
	function changeWH(){
		var showW = page.width()-navBox.outerWidth()-conNav.outerWidth();
		conShow.width(showW);
		var showH = page.height()-showTop.outerHeight()-showText.outerHeight();
		showTalk.height(showH);
		$(".talk_info").css("min-height",showH)
		var listH = page.height()-$(".seek_box").outerHeight();
		$(".talk_list").height(listH);
		scroll($(".show_talk"),$(".talk_info"));
	}
	var maxOff = true;
	$(".max").on("click",function(){
		if(maxOff){
			max();
		}else{
			recoverPage();
		}
		maxOff = !maxOff;
	})
//.............................. 自定义滚动条...........................................
	var y = 0; //鼠标移动过的距离
	var s =0;//变化系数
	var maxBottom=0;
	function scroll(parentEle,childEle){
		var parentH = parentEle.height();
		var childH = childEle.height();
		var scroll = parentEle.find(".scroll")
		if(childH<=parentH){
			scroll.remove();
			parentEle.off("mousewheel DOMMouseScroll");
		}else{
			if(scroll.length === 0){
				var scroll = $("<div class = 'scroll'></div>");
				parentEle.append(scroll);
			}
			var scrollH = parentH/childH*parentH;
			maxBottom = parentH - scrollH; //可变化的最大top值
			if(scrollH<10){
				scrollH=10
			}
			var scroll = parentEle.find(".scroll")
			scroll.height(scrollH);
			parentEle.on("mouseover",function(){
				scroll.css("display","block");
			})
			parentEle.on("mouseleave",function(){
				scroll.css("display","none");
			})
			function scrollMove(){
				s = y/maxBottom;
				scroll.css("bottom",y);
				childEle.css("bottom",-s*(childH-parentH))
			}
			//滚轮事件操作滚动条 
			parentEle.off("mousewheel DOMMouseScroll");
			addScroll(parentEle,goUp,goDown);
			function goUp(){ // 滚动条向上运动
				y+=5;
				if(y>maxBottom){
					y=maxBottom;
				}
				scrollMove();
			}
			function goDown(){ // 滚动条向下运动
				y-=5;
				if(y<0){
					y=0;
				}
				scrollMove();
			}
			function addScroll(obj,fnUp,fnDown){
				obj.on("mousewheel",fn1);
				obj.on("DOMMouseScroll",fn1);
				function fn1(ev){
					if(ev.originalEvent.wheelDelta){
						ev.originalEvent.wheelDelta<0 ? fnDown():fnUp();
						return false;
					}
					if(ev.originalEvent.detail){
						ev.originalEvent.detail>0 ? fnDown():fnUp();
						ev.preventDefault();
					}
				}
			}
			//鼠标按下拖动事件
			scroll.on("mousedown",function(ev){ 
				var disY = ev.clientY;
				var B = parseFloat(scroll.css("bottom"))
				$(document).on("mousemove.scroll",function(ev){
					y = B-(ev.clientY - disY);
					if(y<0){
						y=0;
					}
					if(y>maxBottom){
						y=maxBottom;
					}
					scrollMove();
				})
				$(document).on("mouseup.scroll",function(){
					$(document).off("mousemove.scroll mouseup.scroll")
				})
			})
		}
	}
})()


