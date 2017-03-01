(function(){
	//清除手指移动的默认事件
	document.addEventListener('touchmove',function(event){
		event.preventDefault(); 
	},false);
	// 定义页码
	var now = {
			homePage:1,
			vicePage:1
		},
		last ={
			homePage:0,
			vicePage:0
		};
	// 定义方向
	var dir ={
			up:1,
			down:2,
			left:3,
			right:4
	};
	var isAnimating = false;
	$(document).swipeUp(function(){
		if(isAnimating){
			return;
		}
		last.homePage=now.homePage;
		last.vicePage=now.vicePage;
		if(last.homePage!=5){
			now.homePage=last.homePage+1;
			now.vicePage=1;
			pageMove(dir.up);
		}
	})
	$(document).swipeDown(function(){
		if(isAnimating){
			return;
		}
		last.homePage=now.homePage;
		last.vicePage=now.vicePage;
		if(last.homePage!=1){
			now.homePage=last.homePage-1;
			now.vicePage=1;
			pageMove(dir.down);
		}
	})
	$(document).swipeLeft(function(){
		if(isAnimating){
			return;
		}
		last.homePage=now.homePage;
		last.vicePage=now.vicePage;
		if(last.homePage>1&&last.homePage<5&last.vicePage!=2){
			now.vicePage=last.vicePage+1;
			now.homePage=last.homePage;
			pageMove(dir.left);
			console.log(now.homePage,now.vicePage)
		}
	})
	$(document).swipeRight(function(){
		if(isAnimating){
			return;
		}
		last.homePage=now.homePage;
		last.vicePage=now.vicePage;
		if(last.homePage>1&&last.homePage<5&&last.vicePage!=1){
			now.vicePage=last.vicePage-1;
			now.homePage=last.homePage;
			pageMove(dir.right);
		}
	})
	function pageMove(sw){
		var lastPage = ".page"+last.homePage+"-"+last.vicePage+"",
			nowPage = ".page"+now.homePage+"-"+now.vicePage+"";
		var outClass = "",
			inClass = "";
			console.log(lastPage,nowPage)
		switch(sw) {
			case dir.up:
				outClass = 'pt-page-moveToTop';
				inClass = 'pt-page-moveFromBottom';
				break;
			case dir.right:
				outClass = 'pt-page-moveToRight';
				inClass = 'pt-page-moveFromLeft';
				break;
			case dir.down:
				outClass = 'pt-page-moveToBottom';
				inClass = 'pt-page-moveFromTop';
				break;
			case dir.left:
				outClass = 'pt-page-moveToLeft';
				inClass = 'pt-page-moveFromRight';
				break;
		}
		isAnimating = true;
		$(nowPage).removeClass("hidden")
		$(lastPage).addClass(outClass);
		$(nowPage).addClass(inClass);
		setTimeout(function(){
			$(lastPage).removeClass("page-current");
			$(lastPage).removeClass(outClass);
			$(lastPage).addClass("hidden");
			$(lastPage).find("img").addClass("hidden");
			
			$(nowPage).addClass("page-current")
			$(nowPage).removeClass(inClass);
			$(nowPage).find("img").removeClass("hidden");
			isAnimating = false;
		},600)
		
	}
})();
