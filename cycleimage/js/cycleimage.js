/**
	Cycleimageインジケータ
	auth: noritomo.suzuki@nolib.jp
	条件
		表示する画像ファイル名は０で桁埋めされたフレーム数を含む事
	引数
		id: ID（img、もしくはコンテナの）
		path: 画像格納ディレクトリへのURL
		prefix: ファイル名のフレーム番号の前の文字列
		safix: ファイル名のフレーム番号の後の文字列
		rotaterate: 画像の回転速度（回数/秒）
		startnum: 画像開始フレーム
		endnum: 画像最終フレーム
		digit: フレーム番号の桁数
		reverse: 逆回転させる
**/
if(!Array.indexOf){
	Array.prototype.indexOf = function(object){
		for(var i = 0; i < this.length; i++){
			if(this[i] == object){ 
				return i;
			}
		}
		return -1;
	};
};
if(!Function.applyTimeout){
	Function.prototype.applyTimeout = function (ms, self, args)
	{
		var f = this;
		return setTimeout(
		function () {
			f.apply(self, args);
		},
		ms);
	};
};
if(!Function.callTimeout){
	Function.prototype.callTimeout = function (ms, self)
	{
		return this.applyTimeout(
			ms,
			self,
			Array.prototype.slice.call(arguments, 2));
	};
};
if(!Function.applyInterval){
	Function.prototype.applyInterval = function (ms, self, args)
	{
		var f = this;
		return setInterval(
			function () {
				f.apply(self, args);
			},
		ms);
	};
};
if(!Function.callInterval){
	Function.prototype.callInterval = function (ms, self)
	{
		return this.applyInterval(
			ms,
			self,
			Array.prototype.slice.call(arguments, 2));
	};
};
function Cycleimage(arg){
	this.id = '';
	this.path = 'img/';
	this.prefix = 'frm';
	this.safix = '.png';
	this.rotaterate = 8;
	this.startnum = 0;
	this.endnum = 20;
	this.digit = 3;
	this.reverse = false;
	
	if(arg!=null){
		if(arg.id != undefined)this.id = arg.id;
		if(arg.path != undefined)this.path = arg.path;
		if(arg.prefix != undefined)this.prefix = arg.prefix;
		if(arg.safix != undefined)this.safix = arg.safix;
		if(arg.rotaterate != undefined)this.rotaterate = arg.rotaterate;
		if(arg.startnum != undefined)this.startnum = arg.startnum;
		if(arg.endnum != undefined)this.endnum = arg.endnum;
		if(arg.digit != undefined)this.digit = arg.digit;
		if(arg.reverse!=undefined)this.reverse = arg.reverse;
	}
	
	this.anime = null;
	this.onchange = [];
	
	this.interval = 1 / this.rotaterate;
	this.frmnum = this.endnum - this.startnum + 1;
	
	this._this = document.getElementById(this.id);
	if(this._this.tagName.toLowerCase()=='img'){
		this._img = this._this;
		this.isimage = true;
	}
	else{
		var chl = this._this.childNodes;
		for(var i = 0; i < chl.length; i++){
			var c = chl[i];
			if(c.tagName !=null && c.tagName.toLowerCase()=='img'){
				this._img = c;
				break;
			}
		}
		this.isimage = false;
	}
	this.zero = '';
	for(var i = 0; i < this.digit; i++){
		this.zero += '0';
	}
	this.images = [];
	var igwk;
	var keisu = this.digit * -1;
	for(var i = 0; i < this.frmnum; i++){
		igwk = new Image();
		igwk.src = this.path + this.prefix + (this.zero+(this.startnum + i)).slice(keisu)+this.safix;
		this.images[i] = igwk;
	}
	this.starttime = new Date().getTime();
	if(this._img==null){
		igwk = new Image();
		igwk.src = this.images[0].src;
		this._img = igwk;
		this._this.appendChild(this._img);
	}
	this.nowidx = 0;
	this._this.style.display = 'none';
};
Cycleimage.prototype.setOnChange = function(f){
	this.onchange.push(f);
};
Cycleimage.prototype.doChange = function(idx, imgsrc){
	for(var i = 0; i < this.onchange.length; i++){
		var f = this.onchange[i];
		f.apply(this, [idx, imgsrc]);
	}
};
Cycleimage.prototype.start = function(reset){
	this._this.style.display = 'block';
	if(reset){
		this.nowidx = 0;
	}
	this.starttime = new Date().getTime();
	this.anime = this.animate.applyTimeout(this.interval, this, []);
};
Cycleimage.prototype.stop = function(hide){
	if(hide)this._this.style.display = 'none';
	this.anime = null;
};
Cycleimage.prototype.setRotateRate = function(newrate){
	this.rotaterate = newrate;
	this.interval = 1 / this.rotaterate;
};
Cycleimage.prototype.doReverse = function(){
	this.reverse = !this.reverse;
};
Cycleimage.prototype.getImageObject = function(){
	var proct = new Date().getTime();
	var t = Math.round((proct-this.starttime) * this.rotaterate / 1000) % this.frmnum;
	if(t>0){
		this.nowidx += this.reverse?-1*t:t;
		if(this.nowidx<0)
			this.nowidx += this.frmnum;
		else if(this.nowidx>=this.frmnum)
			this.nowidx -= this.frmnum;
		this.starttime = proct;
	}
	return this.images[this.nowidx];
	
	/**
	var t = Math.round((new Date().getTime()-this.starttime) * this.rotaterate / 1000);
	this.nowidx = this.reverse?this.frmnum - (t % this.frmnum) - 1:t % this.frmnum;
	var ig = this.images[this.nowidx];
	return ig;
	**/
};
Cycleimage.prototype.animate = function(){
	if(this.anime == null)return;
	var wk = this.getImageObject();
	if(this._img.src!=wk.src){
		this._img.src = wk.src;
		this.doChange(this.nowidx, wk.src);
	}
	if(this.anime!=null)this.anime = this.animate.applyTimeout(this.interval, this, []);
};

