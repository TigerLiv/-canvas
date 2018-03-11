function Map(){
	this.code = [
		"XXX□□□□□□□□□□□□XXX",
		"XXX□□□□□□□□□□□□XXX",
		"XXX□□□□□□□□□□□□XXX",
		"XXX□□□□□□□□□□□□XXX",
		"XXX□□□□□□□□□□□□XXX",
		"XXX□□□□□□□□□□□□XXX",
		"XXX□□□□□□□□□□□□XXX",
		"XXX□□□□□□□□□□□□XXX",
		"XXX□□□□□□□□□□□□XXX",
		"XXX□□□□□□□□□□□□XXX",
		"XXX□□□□□□□□□□□□XXX",
		"XXX□□□□□□□□□□□□XXX",
		"XXX□□□□□□□□□□□□XXX",
		"XXX□□□□□□□□□□□□XXX",
		"XXX□□□□□□□□□□□□XXX",
		"XXX□□□□□□1□□□□□XXX",
		"XXX□□□□□□1□□□□□XXX",
		"XXX1234□1012345XXX",
		"XXX1234□3012345XXX",
		"XXX1234□1012345XXX",
		"XXXXXXXXXXXXXXXXXX",
		"XXXXXXXXXXXXXXXXXX",
		"XXXXXXXXXXXXXXXXXX",
		"XXXXXXXXXXXXXXXXXX",
		"XXXXXXXXXXXXXXXXXX"
	]
}

//渲染地图，本质上就是遍历自己的代码。看这一位如果不是□，此时就渲染
//这个函数被定时器调用了，每帧执行。
Map.prototype.render = function(){
	for(var i = 0 ; i < 20 ; i++){
		for(var j = 0 ; j < 12 ; j++){
			//得到这一位，这里有一个误差的补偿，就是3+j，因为左侧有3个X
			var char = this.code[i][3 + j];
			//如果这一位不是空□，此时就渲染
			if(char != "□"){
				game.setClass(i , j , "b" + char);
			}
		}
	}
}

//地图类的判定方法。用来检测方块能不能进入指定的4*4区域
//参数的意义：
//row就是切出的大地图的（笔记上的红框部分）的行号
//col就是切除的大地图的（笔记上的红框部分）的列号
//blockCode就是方块的代码
Map.prototype.check = function(row , col , blockCode){
	//切出一个方形区域
	var cutSquare = [];
	for(var i = 0 ; i < 4 ; i++){
		//这里也要补偿一下3
		cutSquare.push(this.code[row + i].substr(col + 3 , 4));
	}
	 
	//4*4的情况，看看传入的方块能不能进入当前切出来的4*4的区域。
	for(var i = 0 ; i < 4 ; i++){
		for(var j = 0 ; j < 4 ; j++){
			//这个方块的这行这列是1，且切出来的部分这行这列不是空□。
			if(laihongbo(blockCode , i , j) == 1 && cutSquare[i][j] != "□"){
				return false;
			}
		}
	}
	return true;
}

//添加死亡方块
Map.prototype.addDiedBlock = function(row , col , blockCode , color){
	for(var i = 0 ; i < 4 ; i++){
		for(var j = 0 ; j < 4 ; j++){
			if(laihongbo(blockCode , i , j) == 1){
				this.code[row + i] = changeChar(this.code[row + i] , col + j + 3 , color);
			}
		}
	}
}

//消行
Map.prototype.eliminate = function(){
	for(var i = 0 ; i < 20 ; i++){
		if(this.code[i].indexOf("□") == -1){
			this.code.splice(i , 1);
			this.code.unshift("XXX□□□□□□□□□□□□XXX");
		}
	}
}


//“来洪波大定理”。可以得到一个矩阵第m行第n列的情况。返回0或者1。
function laihongbo(code , m , n){
	return (((code >> 4 * (3 - m)) & 0xf) >> (3 - n)) & 0x1;
}

//改变字符串函数。改变字符串str的第n为为newchar
function changeChar(str , n , newchar){
	return str.substr(0,n) + newchar + str.substr(n + 1);
}