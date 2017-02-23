//拖拽函数
;(function(){
	$.fn.darg=function(options){
		new Darg(this,options);
	};
	this. Darg = function(element,options){
		//参数必须是一个对象  什么都不传或者传入的不是一个对象
		if( typeof options === "undefined" || options.constructor !== Object ){
			throw new Error("传入的参数必须是一个对象");
			return;
		};
		this.defaults = {
			DownEle:null,
			MoveEle:null,
		};
		$.extend(true, this.defaults, options);
		if(this.defaults.MoveEle){
			this.Ele = this.defaults.MoveEle;
		}else{
			this.Ele = this.defaults.DownEle;
		};
		this.element = element;
		this.init();
	};
	Darg.prototype={
		constructor:Darg,
		init:function(){
			this.defaults.DownEle.on("mousedown",this.DownFn.bind(this))
		},
		DownFn:function(ev){
			this.disX = ev.pageX - this.Ele.offset().left;
			this.disY = ev.pageY - this.Ele.offset().top;
			$(document).on("mousemove.darg",this.MoveFn.bind(this))
			$(document).on("mouseup.darg",this.UpFn.bind(this))
			ev.preventDefault();
		},
		//给MoveFn 预留接口进行其他操作或条件限制
		limit:function(){
			
		},
		MoveFn:function(ev){
			this.X = ev.pageX - this.disX;
			this.Y = ev.pageY - this.disY;
			this.limit();
			this.Ele.css("left",this.X+"px");
			this.Ele.css("top",this.Y+"px");
			// 添加自定义函数，在移动式触发 来做一些在移动时需要做的事
			this.element.trigger("moving");
		},
		UpFn:function(){
			$(document).off("mousemove.darg mouseup.darg")
		}
	};
})(jQuery)
// 。。。。。。。。。。。。。。。。。。。自定义滚动条。。。。。。。。。。。。。。。。。。。。。。。
;(function(){
	//自定义滚动条插件
	$.fn.scroll=function(options){
		new Scroll(options);
	}
	this. Scroll=function(options){
		if( typeof options === "undefined" || options.constructor !== Object ){
			throw new Error("传入的参数必须是一个对象");
			return;
		};
		//传入参数
		this.defaults = {
			parent:null,
			child:null,
			scroll:null,
		};
		// 深度克隆传入的参数
		$.extend(true, this.defaults, options);
		// 获取滚动条及内容区及内容区父级和滚动条轨道的高度
		this.parentH = this.defaults.parent.height();
		this.childH = this.defaults.child.height();
		//判断是否存在滚动条轨道元素
		this.scrollH = this.parentH/this.childH*this.parentH;
		if(this.scrollH<5){
			this.scrollH=5;
		}
		if(this.scrollH>=this.parentH){
			this.defaults.scroll.css("display","none")
		}
		//设置滚动条高度 以及最大移动距离
		this.defaults.scroll.height(this.scrollH);
		this.maxTop=this.parentH-this.scrollH;
		this.y = 0;
		this.init();
		this.addScroll();
	};
	Scroll.prototype={
		constructor:Scroll,
		init:function(){
			//鼠标移动滚动条事假
			this.defaults.scroll.on("mousedown",this.DownFn.bind(this));
		},
		DownFn:function(ev){
			this.disY = ev.clientY-parseFloat(this.defaults.scroll.css("top"));
			$(document).on("mousemove.scroll",this.MoveFn.bind(this))
			$(document).on("mouseup.scroll",this.UpFn.bind(this))
			ev.preventDefault();
		},
		//给MoveFn 预留接口进行其他操作或条件限制
		limit:function(){
			
		},
		MoveFn:function(ev){
			this.y=ev.clientY-this.disY;
			this.limit();
			this.s=this.y/this.maxTop;
			this.defaults.scroll.css("top",this.y)
			this.defaults.child.css("top",-this.s*(this.childH-this.parentH));
		},
		UpFn:function(){
			$(document).off("mousemove.scroll mouseup.scroll")
		},
		addScroll:function(){
			// 滚轮操作滚动条事件
			this.defaults.parent.on("mousewheel",this.fn1.bind(this));
			this.defaults.parent.on("DOMMouseScroll",this.fn1.bind(this));
		},
		fn1:function(ev){
			if(ev.originalEvent.wheelDelta){
				ev.originalEvent.wheelDelta<0 ? this.goDown():this.goUp();
				return false;
			}
			if(ev.originalEvent.detail){
				ev.originalEvent.wheelDelta>0 ? this.goDown():this.goUp();
				ev.preventDefault();
			}
		},
		goDown:function(){
			this.y = parseFloat(this.defaults.scroll.css("top"));
			this.y-=5;
			if(this.y<0){
				this.y=0;
			}
			this.s=this.y/this.maxTop;
			this.defaults.scroll.css("top",this.y)
			this.defaults.child.css("top",-this.s*(this.childH-this.parentH));
		},
		goUp:function(){
			this.y = parseFloat(this.defaults.scroll.css("top"));
			this.y+=5;
			if(this.y>=this.maxTop){
				this.y=this.maxTop;
			}
			this.s=this.y/this.maxTop;
			this.defaults.scroll.css("top",this.y)
			this.defaults.child.css("top",-this.s*(this.childH-this.parentH));
		}
	}
	Scroll.prototype.limit=function(){
		if(this.y<0){
			this.y=0;
		}
		if(this.y>this.maxTop){
			this.y=this.maxTop;
		}
	}
//........................................弹窗.......................................
;(function(){
	function Dialog(arr){
		arr = arr ||[];
		if(arr.constructor === !Array){
			arr= [];
		};
		var Array =[
			{
				title:"",
				todo:function(){}
			}
		]
		$.extend(true,Array,arr)
		if($(".tanBox").length != 0 ){
			$(".tanBox").remove();
		}
		var ul = $("<ul class='tanBox'></ul>");
		var str = "";
		ul.css("left",event.pageX);
		ul.css("top",event.pageY)
		for (var i = 0 ;i<arr.length;i++) {
			str+='<li>'+arr[i].title+'</li>'		
		}
		ul.html(str);
		$("body").append(ul);
		var lis = ul.find("li");
		lis.on("click",function(){
			ul.remove();
			Array[$(this).index()].todo();
		})
	}
	$.dialog = function (options){
		new Dialog(options);
	}
})()
})(jQuery);
