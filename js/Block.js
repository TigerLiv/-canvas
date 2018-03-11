function Block(){
	//所有的形态字母
	var alltypes = ["S","Z","J","L","O","T","I"];
	//自己的形态数字随机一个
	this.typeNumber = parseInt(Math.random() * alltypes.length); //0~6随机数
	// this.typeNumber = 6;
	//自己形态字母
	this.typeChar = alltypes[this.typeNumber];	//"S","Z","J","L","O","T","I"
	//所有编码
	var allcodes = {
		"S" : [0x6c00 , 0x8c40],
		"Z"	: [0xc600 , 0x4c80],
		"J" : [0x44c0 , 0x8e00 , 0x6440 , 0x0e20],
		"L" : [0x4460 , 0x0e80 , 0xc440 , 0x2e00],
		"O" : [0x6600],
		"T" : [0x0e40 , 0x4c40 , 0x4e00 , 0x4640],
		"I" : [0x4444 , 0x0f00]
	}
	//自己的编码序列
	this.codes = allcodes[this.typeChar];
	//自己所有的方向的数量
	this.directionsAmount = this.codes.length;
	//自己的方向
	this.direction = parseInt(Math.random() * this.directionsAmount);
	//自己的编码
	this.code = this.codes[this.direction];
	//自己的行
	this.row = 0;
	//自己的列
	this.col = 4;
	
}
//渲染砖块
Block.prototype.render = function(){
	//渲染自己的本体
	for(var i = 0 ; i < 4 ; i++){
		for(var j = 0 ; j < 4 ; j++){
			if(laihongbo(this.code , i , j) == 1){
				game.setClass(i + this.row , j + this.col, "b" + this.typeNumber);
			}
		}
	}
	//渲染自己的投影
	//计算自己的投影在第几行。机理就是从这行开始试验，一行一行加，看哪一行卡住了。
	// var ii = 0;
	// while(game.map.check(this.row + ii, this.col , this.code)){
	// 	ii++;
	// }
	// for(var i = 0 ; i < 4 ; i++){
	// 	for(var j = 0 ; j < 4 ; j++){
	// 		if(laihongbo(this.code , i , j) == 1){
	// 			game.setClass(i + this.row + ii - 1, j + this.col, "b_shadow");
	// 		}
	// 	}
	// }
}
//更新
Block.prototype.update = function(){
	//此时就可以check了
	if(game.map.check(this.row + 1 , this.col , this.code)){
		this.row++;
	}else{
		//触底了
		//要将自己添加为尸体
		game.map.addDiedBlock(this.row , this.col , this.code , this.typeNumber);
		//让下一个转块，变为当前转块
		game.block = game.nextBlock;
		game.nextBlock = new Block();
		//消行判定
		game.map.eliminate();
		//gameover判定
		if(!game.map.check(0 , 4 , this.code)){
			alert("你死了");
			clearInterval(game.timer);
		}
	}
}

//往左移动
Block.prototype.moveLeft = function(){
	if(game.map.check(this.row , this.col - 1, this.code)){
		this.col --;
	}
}

//往右移动
Block.prototype.moveRight = function(){
	if(game.map.check(this.row , this.col + 1, this.code)){
		this.col ++;
	}
}
//旋转
Block.prototype.rotate = function(){
	this.direction ++;
	if(this.direction > this.directionsAmount - 1){
		this.direction = 0;
	}
	//新的code，先不改code，先临时来一个变量存起来，然后测试
	var nextCode = this.codes[this.direction];
	//测试能不能融入Map中
	if(game.map.check(this.row , this.col , nextCode)){
		//测试通过了再改
		this.code = nextCode;
	}
}

//一键到底
Block.prototype.gotoBottom = function(){
	var i = 0;
	while(game.map.check(this.row + i, this.col , this.code)){
		i++;
	}

	this.row = this.row + i - 1;
}


//“来洪波大定理”。可以得到一个矩阵第m行第n列的情况
function laihongbo(code , m , n){
	return (((code >> 4 * (3 - m)) & 0xf) >> (3 - n)) & 0x1
}