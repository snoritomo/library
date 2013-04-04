/**
	Ajaxloadインジケータ
	auth: noritomo.suzuki@flexfirm.ksk.co.jp
	条件
		main.jsがincludeされている事
		表示する画像ファイル名は０で桁埋めされたフレーム数を含む事
	引数
		id: ID（img、もしくはコンテナの）
		path: 画像格納ディレクトリへのURL
		prefix: ファイル名のフレーム番号の前の文字列
		safix: ファイル名のフレーム番号の後の文字列
		rotaterate: 画像の回転速度
		startnum: 画像開始フレーム
		endnum: 画像最終フレーム
		framerate: 画像を変更する秒間の回数
		digit: フレーム番号の桁数
**/
function Ajaxload(arg){
	this.id = '';
	this.path = 'img/';
	this.prefix = 'frm';
	this.safix = '.png';
	this.rotaterate = 8;
	this.startnum = 0;
	this.endnum = 20;
	this.framerate = 60;
	this.digit = 3;
	
	if(arg!=null){
		if(arg.id != undefined)this.id = arg.id;
		if(arg.path != undefined)this.path = arg.path;
		if(arg.prefix != undefined)this.prefix = arg.prefix;
		if(arg.safix != undefined)this.safix = arg.safix;
		if(arg.rotaterate != undefined)this.rotaterate = arg.rotaterate;
		if(arg.startnum != undefined)this.startnum = arg.startnum;
		if(arg.endnum != undefined)this.endnum = arg.endnum;
		if(arg.framerate != undefined)this.framerate = arg.framerate;
		if(arg.digit != undefined)this.digit = arg.digit;
	}
	
	this.anime = null;
	
	this.interval = 1 / this.framerate;
	this.frmnum = this.endnum - this.startnum + 1;
	
	this._this = document.getElementById(this.id);
	if(this._this.tagName.toLowerCase()=='img'){
		this._img = this._this
		this.isimage = true;
	}
	else{
		var chl = this._this.childNodes;
		for(var i = 0; i < chl.length; i++){
			if(chl[i].tagName.toLowerCase()=='img'){
				this._img = chl[i];
				break;
			}
		}
		this.isimage = false;
	}
	this.zero = '';
	for(var i = 0; i < this.digit; i++)
		this.zero += '0';
	this.images = [];
	var igwk;
	var keisu = this.digit * -1;
	for(var i = 0; i < this.frmnum; i++){
		igwk = new Image();
		igwk.src = this.path + this.prefix + (this.zero+(this.startnum + i)).slice(keisu)+this.safix
		this.images.push(igwk);
	}
	this.starttime = new Date().getTime();
	if(this._img==null){
		this._img = this.images[0];
		this._this.appendChild(this._img);
	}
	this._this.style.display = 'none';
}
Ajaxload.prototype.start = function(){
	this._this.style.display = 'block';
	this.anime = this.animate.applyTimeout(this.interval, this, []);
}
Ajaxload.prototype.stop = function(){
	this._this.style.display = 'none';
	this.anime = null;
}
Ajaxload.prototype.getImageObject = function(){
	var t = Math.round((new Date().getTime()-this.starttime) * this.rotaterate / 1000);
	var ig = this.images[t % this.frmnum];
	return ig;
}
Ajaxload.prototype.animate = function(){
	if(this.anime == null)return;
	
	if(this.isimage){
		var wk = this.getImageObject();
		this._this.parentNode.replaceChild(wk, this._img);
		this._img = wk;
		this._this = wk;
	}
	else{
		var wk = this.getImageObject();
		this._this.replaceChild(wk, this._img);
		this._img = wk;
	}
	this.anime = this.animate.applyTimeout(this.interval, this, []);
}

