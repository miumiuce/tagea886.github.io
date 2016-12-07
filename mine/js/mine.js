var mineArr; 	//雷数组
var restBlock =0;  //剩余方块数
var restFlag = 0;	//旗子数
var restMine = 0; 	//剩余雷数
var status; 	//游戏状态 0-结束 1-初始化 2-进行中
var total;
var timer = null;

$(function(){
	$(".easy").bind("click",function(){fnReset(10,10,10)})
	$(".normal").bind("click",function(){fnReset(16,16,40)})
	$(".difficult").bind("click",function(){fnReset(30,16,99)})
	
	$("#main").mouseup(function(ev){
		
		//获取所点击的div的行和列的位置
		var $div = $(ev.target);
		var $divId = $div.attr("id");
		
		var x = parseInt($divId.substring(1,$divId.indexOf("-")))
		var y = parseInt($divId.substring($divId.indexOf("r")+1))
		if(ev.which == 1){				//左键
			fnOpen(x,y);
		} else if (ev.which == 3){		//右键
			fnMark(x,y);
		}
		$('#restMine').text(restMine);	//剩余雷数
		fnV(total);						//胜利
	})
	$('#main').bind('contextmenu', function(){ return false; }); //阻止默认右键事件 
})

//初始化
function fnReset(x,y,mine){
	
	clearInterval(timer)				//每次重新开始就清除定时器,防止多开
	
	$("#time").text(0);
	status = 1;
	restBlock = x*y;
	total = restMine = mine;
	
	
	//创建二维数组
	mineArr = new Array(x+2);			//x+2为了在雷数组外面再套一层无雷区，方便下面雷遍历数组的判断
	$.each(mineArr,function(num){
		mineArr[num] = new Array(y+2);				
	})
	//初始化二维数组
	for(var i=0;i<x+2;i++){
		for(var j=0;j<y+2;j++){
			mineArr[i][j] = 0;
		}
	}
	//布雷,-1为雷
	while( mine > 0){
		var i = Math.ceil(Math.random()*x);
		var j = Math.ceil(Math.random()*y);
		if( mineArr[i][j] != -1){
			mineArr[i][j] = -1;
			mine--;
		}
	}
	//遍历雷数组，统计每个非雷格周围雷的个数
	for(var i=1; i<= x; i++){
		for(var j=1;j <= y; j++){
			if(mineArr[i][j] != -1){
				
				if(mineArr[i-1][j-1] == -1){ //左上
					mineArr[i][j]++;
				}
				
				if(mineArr[i][j-1] == -1){	 //上
					mineArr[i][j]++;
				}
				
				if(mineArr[i+1][j-1] == -1){  //右上
					mineArr[i][j]++;
				}
				
				if(mineArr[i-1][j] == -1){	  //左
					mineArr[i][j]++;
				}
				
				if(mineArr[i+1][j] == -1){	  //右
					mineArr[i][j]++;
				}
				
				if(mineArr[i-1][j+1] == -1){  //左下
					mineArr[i][j]++;
				}
				
				if(mineArr[i][j+1] == -1){	  //下
					mineArr[i][j]++;
				}
				
				if(mineArr[i+1][j+1] == -1){  //右下
					mineArr[i][j]++;
				}
			}
		}
	}
	//添加方块等样式
	var block = '';
	for(var i=1 , row = mineArr.length -1 ;i<row;i++){
		for(var j=1 , col = mineArr[0].length -1 ; j<col ; j++){
			block += '<div id="c'+ i +'-r'+ j +'" style="left:' +( i -1)*20 + 'px; top:' + ( j -1) * 20 + 'px "class="hidden"></div>'
		}
	}
	$('#main').html(block).width(x * 20).height(y * 20).show(); 
	$('#warning').html(''); 
	$('#submenu').show(); 
	$('#restMine').text(restMine); 
	
}

//打开方块
function fnOpen(x,y){
	
	var $click = $("#c"+ x +"-r"+ y);
	
	var $leftTop = $("#c"+ (x-1) +"-r"+ (y-1));			//用变量保存点击方块的周围八个格；
	var $top = $("#c"+ x +"-r"+ (y-1));
	var $rightTop = $("#c"+ (x+1) +"-r"+ (y-1));
	var $left = $("#c"+ (x-1) +"-r"+ y);
	var $right = $("#c"+ (x+1) +"-r"+ y);
	var $leftBottom = $("#c"+ (x-1) +"-r"+ (y+1));
	var $bottom = $("#c"+ x +"-r"+ (y+1));
	var $rightBottom = $("#c"+ (x+1) +"-r"+ (y+1)); 
	
	
	
	if(status == 1){	//初始化
		
		if(mineArr[x][y] == -1){
			fnReset(mineArr.length-2,mineArr[0].length-2,restMine);		//若第一次点击就触雷,则重新布雷
			fnOpen(x,y)
		} else if(mineArr[x][y] >0){
			$click.removeClass("hidden").html(mineArr[x][y]).addClass("num"+mineArr[x][y]);
			restBlock--;
		} else if( mineArr[x][y] == 0){
			$click.removeClass("hidden")
			restBlock--;
			if($leftTop.hasClass("hidden")){ fnOpen(x-1,y-1)};
			if($top.hasClass("hidden")){ fnOpen(x,y-1)};
			if($rightTop.hasClass("hidden")){ fnOpen(x+1,y-1)};
			if($left.hasClass("hidden")){ fnOpen(x-1,y)};
			if($right.hasClass("hidden")){ fnOpen(x+1,y)};
			if($leftBottom.hasClass("hidden")){ fnOpen(x-1,y+1)};
			if($bottom.hasClass("hidden")){ fnOpen(x,y+1)};
			if($rightBottom.hasClass("hidden")){ fnOpen(x+1,y+1)};
		}
		
		status = 2;
		clearInterval(timer);					//由状态1转到状态2,则开始计时;
		var time = 0
		timer = setInterval(function(){
			time++;
			$("#time").text(time);
		},1000)
		
	} else if( status == 2){	//进行中
		
		if(mineArr[x][y] == -1){
			if(!$click.hasClass("flag")){
				$click.removeClass("hidden").addClass("cbomb");
				fnEnd();	
			}
		} else if(mineArr[x][y] >0){
			if($click.hasClass("flag")){
				fnEnd();	
			}
			$click.removeClass("hidden").html(mineArr[x][y]).addClass("num"+mineArr[x][y]);
			restBlock--;
		} else if( mineArr[x][y] == 0){
			if($click.hasClass("flag")){
				$click.removeClass("flag").addClass("wrong");
				fnEnd();	
			}
			restBlock--;
			$click.removeClass("hidden")
			if($leftTop.hasClass("hidden")){ fnOpen(x-1,y-1)};
			if($top.hasClass("hidden")){ fnOpen(x,y-1)};
			if($rightTop.hasClass("hidden")){ fnOpen(x+1,y-1)};
			if($left.hasClass("hidden")){ fnOpen(x-1,y)};
			if($right.hasClass("hidden")){ fnOpen(x+1,y)};
			if($leftBottom.hasClass("hidden")){ fnOpen(x-1,y+1)};
			if($bottom.hasClass("hidden")){ fnOpen(x,y+1)};
			if($rightBottom.hasClass("hidden")){ fnOpen(x+1,y+1)};
		}
	} else if (status == 0){
		if(mineArr[x][y] == -1){ 
			if(!$click.hasClass("flag")){
				$click.removeClass("hidden").addClass("bomb");
			}
		};
		if(mineArr[x][y] >0){
			if($click.hasClass("flag")){
				$click.removeClass("flag").addClass("wrong").html("");
			}else{
				$click.removeClass("hidden").html(mineArr[x][y]).addClass("num"+ mineArr[x][y]);
			}
		}
		if(mineArr[x][y] == 0){ 
			$click.removeClass("hidden")
		}
	}
}

//右键
function fnMark(x,y){
	
	var $click = $("#c"+ x +"-r"+ y);
	
	if ( status == 2){
		if($click.hasClass("hidden")){
			if($click.hasClass("flag")){
				$click.removeClass("flag").addClass("check");
				restFlag--;
				restMine++;
				
			} else if ($click.hasClass("check")){
				$click.removeClass("check");
			} else {
				$click.addClass("flag");
				restFlag++;
				restMine--;
			}
		} else {
			fnAround(x,y);
		}
	}
}

//自动点击周围八个格子
function fnAround(x,y){
	
	var numFlag = 0;
	
	var $click = $("#c"+ x +"-r"+ y);
	
	for(var j = y-1; j<y+2; j++){
		for(var i = x-1; i<x+2; i++){
			if($("#c"+ i +"-r"+ j).hasClass("flag")){
				numFlag ++;
			};
		}
	}
	if( numFlag == mineArr[x][y]){			
		for(var j = y-1; j<y+2; j++){
			for(var i = x-1; i<x+2; i++){
				if($("#c"+ i +"-r"+ j).hasClass("hidden")){
					fnOpen(i,j);
				}
			}
		}
	}
}

//失败
function fnEnd(){
	$("#warning").show().html("输啦");
	status = 0;
	clearInterval(timer);
	for(var j=1;j<mineArr[0].length;j++){
		for( var i=1; i<mineArr.length;i++){
			fnOpen(i,j)
		}
	}
}

//成功
function fnV(total){
	if((total == restBlock) || (total == (restFlag + restBlock))){
		$("#warning").show().html("赢啦");
		$('#restMine').text(0);
		clearInterval(timer);
		status = 0;
	}	
	
}






