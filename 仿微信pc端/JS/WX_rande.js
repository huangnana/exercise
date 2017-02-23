var rander={
	userPhoto:function(photo){
		var str = "<img src="+photo+"/>";
		return str;
	},
	faceList:function(arr){
		var str = "<div class='faceList'>";
		for (var i = 0 ;i<arr.length;i++) {
			str+='<img src="'+arr[i]+'">'		
		}
		str+="</div>"
		return str;
	}
}
