function Game(){
	//初始化
	this.init();
	//实例化一个砖块
	this.block = new Block();
	//下一个方块
	this.nextBlock = new Block();
	//实例化一个地图
	this.map = new Map();
	//开始定时器
	this.start();
	//添加监听
	this.bindEvent();
}
//DOM上树
Game.prototype.init = function(){
	//创建主体表格20*12
	this.dom = document.createElement("table");
	this.dom.style.float = "left";
	this.dom.style.marginRight = "10px";

	for(var i = 0 ; i < 20 ; i++){
		var tr = document.createElement("tr");
		for(var j = 0 ; j < 12 ; j++){
			var td = document.createElement("td");
			tr.appendChild(td);
		}
		this.dom.appendChild(tr);
	}
	document.getElementById("app").appendChild(this.dom);

	//创建预览表格
	this.dom2 = document.createElement("table");
	this.dom2.style.float = "left";
	for(var i = 0 ; i < 4 ; i++){
		var tr = document.createElement("tr");
		for(var j = 0 ; j < 4 ; j++){
			var td = document.createElement("td");
			tr.appendChild(td);
		}
		this.dom2.appendChild(tr);
	}
	document.getElementById("app").appendChild(this.dom2);
}
//设置类名
Game.prototype.setClass = function(row,col,classname){
	this.dom.getElementsByTagName("tr")[row].getElementsByTagName("td")[col].className = classname;
}
//清屏
Game.prototype.clear = function(row,col,classname){
	for(var i = 0 ; i < 20 ; i++){
 		for(var j = 0 ; j < 12 ; j++){
 			this.dom.getElementsByTagName("tr")[i].getElementsByTagName("td")[j].className = "";
 		}
 	}

 	for(var i = 0 ; i < 4 ; i++){
 		for(var j = 0 ; j < 4 ; j++){
 			this.dom2.getElementsByTagName("tr")[i].getElementsByTagName("td")[j].className = "";
 		}
 	}
}
//渲染下一个方块
Game.prototype.renderNextBlock = function(){
	for(var i = 0 ; i < 4 ; i++){
		for(var j = 0 ; j < 4 ; j++){
			if(laihongbo(this.nextBlock.code , i , j) == 1){
				this.dom2.getElementsByTagName("tr")[i].getElementsByTagName("td")[j].className = "b" + this.nextBlock.typeNumber; 
			}
		}
	}
}
//开始定时器
Game.prototype.start = function(){
	var self = this;
	var f = 0;
	this.timer = setInterval(function(){
		f++;
		//清屏
		self.clear();
		//每30帧进行砖头的更新（下落）
		f % 30 == 0 && self.block.update();
		//渲染活动砖头
		self.block.render();
		//渲染死亡的方块，就是渲染地图
		self.map.render();
		//渲染下一个转块
		self.renderNextBlock();
	},20);
}
//监听
Game.prototype.bindEvent = function(){
	var self = this;
	document.onkeydown = function(event){
		if(event.keyCode == 37){
			self.block.moveLeft();
		}else if(event.keyCode == 39){
			self.block.moveRight();
		}else if(event.keyCode == 38){
			self.block.rotate();
		}else if(event.keyCode == 40){
			self.block.gotoBottom();
		}
	}
}

//“来洪波大定理”。可以得到一个矩阵第m行第n列的情况
function laihongbo(code , m , n){
	return (((code >> 4 * (3 - m)) & 0xf) >> (3 - n)) & 0x1
}