(function(){
	//组织默认行为
	document.addEventListener("touchstart",function(ev){
		ev.preventDefault();
	})
	document.addEventListener("touchmove",function(ev){
		ev.preventDefault();
	})
	// iscroll滚动条
	var xqScroll = new IScroll("#content",{
			scrollY: true,
			interactiveScrollbars:true,
			indicators:{
				el:wrap
			}
	})
	$(document).on("touchmove",function(){
		if($("#wrap").offset().top<-30){
			$("#head").css("background-color","#f3f8fe")
		}else{
			$("#head").css("background-color",null)
		}
	})
	xqScroll.on("scrollEnd",function(){
		if($("#wrap").offset().top<-30){
			$("#head").css("background-color","#f3f8fe")
		}else{
			$("#head").css("background-color",null)
		}
	})
	//图片自动切换
	var num = 0;
	var w = $(".con_ad li").width();
	var lis = $(".con_ad").find("li");
	lis.eq(0).clone().appendTo($(".con_ad ul"));
	var len = $(".con_ad img").length;
	autoMove();
	function autoMove(){
		setInterval(function(){
			num++;
			$(".con_ad ul").css("transition","1s")
			$(".con_ad ul").css("left",-w*num)
			if(num===(len-1)){
				setTimeout(function(){
					$(".con_ad ul").css("transition",null)
					num = 0;
					$(".con_ad ul").css("left",0)
				},1000)
			}
			setTimeout(function(){
				if(num===len-1){
					num = 0;
				}
				$(".turn").removeClass("active").eq(num).addClass("active");
			},500)
		},2500)
	}
	
})()
