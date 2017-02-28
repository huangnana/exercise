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
})(jQuery);
