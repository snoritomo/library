/**
	goround
	auth: noritomo.suzuki@nolib.jp
	条件
		jqueryがincludeされている事
	引数
		id: ビューID
		path: 画像ディレクトリへのパスURL
		prefix: ファイル名プレフィックス
		safix: ファイル名サフィックス
		startnum: ファイル名フレーム開始数
		endnum: ファイル名フレーム最終数
		digit: フレーム０桁埋め
		movepx: 画像を回転させるスワイプ量(pxcel)
		framerate: アニメーションレート(秒間のコマ数）
		throwtime: 投げる判定誤差（ミリ秒）
		friction: 自動移動の減速加速度(px/秒)
		freetime: 自動移動の減速が発動するまでの時間(ミリ秒)
		handlemode: 0:全て 1:マウス 2:タッチ
		reverse: 逆回転させる
		vertical: 縦感知
		horizontal: 横感知
		cycle: 半分で逆回転
**/
if(!Array.indexOf){
	Array.prototype.indexOf = function(object){
		for(var i = 0; i < this.length; i++){
			if(this[i] == object){ 
				return i;
			}
		}
		return -1;
	}
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
function Goround(args){
	this._id = '';
	this.path = 'img/';
	this.prefix = 'frm';
	this.safix = '.png';
	this.startnum = 0;
	this.endnum = 20;
	this.digit = 3;
	this.movepx = 10;
	this.framerate = 40;
	this.throwtime = 0;
	this.move_friction = 20.0;
	this.move_freetime = 100;
	this.handlemode = 0;
	this.reverse = false;
	this.vertical = false;
	this.horizontal = true;
	this.cycle = false;
	
	if(args!=null){
		if(args.id!=undefined)this._id = args.id;
		if(args.path != undefined)this.path = args.path;
		if(args.prefix != undefined)this.prefix = args.prefix;
		if(args.safix != undefined)this.safix = args.safix;
		if(args.startnum != undefined)this.startnum = args.startnum;
		if(args.endnum != undefined)this.endnum = args.endnum;
		if(args.digit != undefined)this.digit = args.digit;
		if(args.movepx!=undefined)this.movepx = args.movepx;
		if(args.framerate!=undefined)this.framerate = parseFloat(args.framerate);
		if(args.throwtime!=undefined)this.throwtime = args.throwtime;
		if(args.friction!=undefined)this.move_friction = args.friction;
		if(args.freetime!=undefined)this.move_freetime = args.freetime;
		if(args.handlemode!=undefined)this.handlemode = args.handlemode;
		if(args.reverse!=undefined)this.reverse = args.reverse;
		if(args.vertical!=undefined)this.vertical = args.vertical;
		if(args.horizontal!=undefined)this.horizontal = args.horizontal;
		if(args.cycle!=undefined)this.cycle = args.cycle;
	}
	this.view = $('#' + this._id);
	this.left = 0;
	this.nowidx = 0;
	this.rolling_anime = null;
	this.upper = this.reverse;
	
	this.handlemouse = true;
	this.handletouch = true;
	if(this.handlemode==1)this.handletouch = false;
	if(this.handlemode==2)this.handlemouse = false;
	
	this.interval = 1 / this.framerate * 1000;/**アニメーション間隔（ミリ秒）**/
	this.move_friction = this.move_friction / 1000 * this.interval;/**摩擦係数（px毎フレーム）**/
	
	this.frmnum = this.endnum - this.startnum + 1;
	
	this.setleft = function(tgt, lft, toleft){
		var cnt = tgt.nowidx;
		var plus = toleft==tgt.upper?-1:1;
		var lft2 = lft + tgt.left;
		while(true){
			if(lft2 < this.movepx)break;
			lft2 -= this.movepx;
			cnt+=plus;
			if(cnt>=this.frmnum)cnt = 0;
			if(cnt<0)cnt = this.frmnum-1;
		}
		tgt.nowidx = cnt;
		tgt.left = lft2;
		tgt._img.attr('src', tgt.images[tgt.nowidx].attr('src'));
		tgt.view.height(tgt.images[tgt.nowidx].innerHeight);
	};
	this.getleft = function(tgt){return parseFloat(this.left);};
	
	this.rolling = this.rolling_notate;
	
	this.onstop = [];
	this.onmove = [];
	this.onclick = [];
	
	this.touchstartidx = this.nowidx;
	
	this.moved = false;
	this.st_x = 0;
	this.move_x = 0;
	this.move_y = 0;
	this.st_y = 0;
	this.st_time = 0;
	this.mv_time = 0;
	this.ed_time = 0;
	this.ed_x = 0;
	this.ed_y = 0;
	this.rolling_speed = 0.0;
	this.rolling_anime = null;
	this.toleft = true;
	
	if(this.handletouch){
		this.view.on('touchstart', {tgt: this}, this.page_touchstart);
		$(document).on('touchend', {tgt: this}, this.page_touchend);
	}
	if(this.handlemouse){
		this.view.on('mousedown', {tgt: this}, this.page_touchstart);
		$(document).on('mouseup', {tgt: this}, this.page_touchend);

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
		var jqimg = $(igwk);
		this.images.push($(igwk));
	}
	igwk = new Image();
	igwk.src = this.images[0].attr('src');
	this._img = $(igwk);
	this.view.append(this._img);
};
Goround.prototype.setOnMove = function(f){
	this.onmove.push(f);
};
Goround.prototype.doMove = function(){
	for(var i = 0; i < this.onmove.length; i++){
		var f = this.onmove[i];
		f.apply(this, [this.nowidx, this._img]);
	}
};
Goround.prototype.setOnStop = function(f){
	this.onstop.push(f);
};
Goround.prototype.doStop = function(){
	for(var i = 0; i < this.onstop.length; i++){
		var f = this.onstop[i];
		f.apply(this, [this.nowidx, this._img]);
	}
};
Goround.prototype.setOnClick = function(f){
	this.onclick.push(f);
};
Goround.prototype.doClick = function(){
	for(var i = 0; i < this.onclick.length; i++){
		var f = this.onclick[i];
		f.apply(this, [this.nowidx, this._img]);
	}
};
Goround.prototype.rolling_notate = function(d, once){
	var t = this;
	var toleft = d<0?true:false;
	var deg = Math.abs(parseFloat(d));
	
	t.setleft(t, deg, toleft);
	t.doMove();
	
	if(once!=null){
		clearTimeout(t.rolling_anime);
		t.rolling_anime = null;
		return;
	}
	var dt = new Date();
	var tim = dt.getTime();
	if(tim >= (t.move_freetime + t.ed_time)){
		t.rolling_speed -= t.move_friction;
	}
	if(t.rolling_speed<=0){
		clearTimeout(t.rolling_anime);
		t.rolling_anime = null;
		t.doStop();
		return;
	}
	deg = t.rolling_speed * (t.toleft?-1:1);
	t.rolling_anime = t.rolling.applyTimeout(t.interval, t, [deg, null]);
};
Goround.prototype.page_touchstart = function(evt){
	var t = evt.data.tgt;
	var p = evt.data.tgt._parent;
	clearTimeout(t.rolling_anime);
	t.st_x = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).pageX;
	t.move_x = t.st_x;
	t.st_y = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).pageY;
	t.move_y = t.st_y;
	var d = new Date();
	t.st_time = d.getTime();
	t.mv_time = d.getTime();
	t.ed_time = d.getTime();
	t.ed_x = t.st_x;
	t.ed_y = t.st_y;
	if(t.handletouch){
		t.view.on('touchmove', {tgt: t}, t.page_touchmove);
	}
	if(t.handlemouse){
		t.view.on('mousemove', {tgt: t}, t.page_touchmove);
	}
	if(p!=undefined && p!=null){
		p.page_touchstart(evt);
	}
	t.touchstartidx = t.nowidx;
	evt.preventDefault();
};
Goround.prototype.page_touchend = function(evt){
	var t = evt.data.tgt;
	var mve = t.moved;
	t.moved = false;
	if(t.handletouch){
		t.view.off('touchmove', t.page_touchmove);
	}
	if(t.handlemouse){
		t.view.off('mousemove', t.page_touchmove);
	}
	if(t.st_time == 0)return;
	t.st_time = 0;
	var d = new Date();
	var nwtm = d.getTime();
	var len = Math.sqrt((t.horizontal?Math.pow(t.ed_x - t.move_x, 2):0) + (t.vertical?Math.pow(t.ed_y - t.move_y, 2):0));
	t.rolling_speed = len / (nwtm - t.mv_time) * t.interval;/**初期スピード（px毎フレーム）**/
	var isclick = true;
	if(!mve){
		isclick = false;
		evt.preventDefault();
		t.doClick();
	}
	if((t.ed_time - t.mv_time) < (nwtm - t.ed_time + t.throwtime)){
		t.doStop();
		return isclick;
	}
	
	t.toleft = true;
	var dx = t.move_x - t.ed_x;
	var dy = t.move_y - t.ed_y;
	if((t.vertical && t.horizontal && Math.abs(dy)>Math.abs(dx)) || (t.vertical && !t.horizontal)){
		if(t.move_y > t.ed_y){
			t.toleft = true;
		}
		else{
			t.toleft = false;
		}
		t.upper = t.cycle?(t.ed_x>(parseFloat(t.view.offset().left)+parseFloat(t.view.width()/2))?!t.reverse:t.reverse):t.reverse;
	}
	else{
		if(t.move_x < t.ed_x){
			t.toleft = true;
		}
		else{
			t.toleft = false;
		}
		t.upper = t.cycle?(t.ed_y>(parseFloat(t.view.offset().top)+parseFloat(t.view.height()/2))?!t.reverse:t.reverse):t.reverse;
	}
	var deg = t.rolling_speed * (t.toleft?-1:1);

	t.rolling_anime = t.rolling.applyTimeout(t.interval, t, [deg, null]);
	return isclick;
};
Goround.prototype.page_touchmove = function(evt){
	var t = evt.data.tgt;
	if(t.st_time<=0)return;
	var d = new Date();
	t.mv_time = t.ed_time;
	t.ed_time = d.getTime();
	t.move_x = t.ed_x;
	t.move_y = t.ed_y;
	t.ed_x = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).pageX;
	t.ed_y = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).pageY;
	var tgt = evt.data.tgt;
	var mgl = Math.sqrt((t.horizontal?Math.pow(t.ed_x - t.move_x, 2):0) + (t.vertical?Math.pow(t.ed_y - t.move_y, 2):0));
	var dx = t.move_x - t.ed_x;
	var dy = t.move_y - t.ed_y;
	if((t.vertical && t.horizontal && Math.abs(dy)>Math.abs(dx)) || (t.vertical && !t.horizontal)){
		if(t.move_y > t.ed_y){
			t.toleft = true;
		}
		else{
			t.toleft = false;
		}
		t.upper = t.cycle?(t.ed_x>(parseFloat(t.view.offset().left)+parseFloat(t.view.width()/2))?!t.reverse:t.reverse):t.reverse;
	}
	else{
		if(t.move_x < t.ed_x){
			t.toleft = true;
		}
		else{
			t.toleft = false;
		}
		t.upper = t.cycle?(t.ed_y>(parseFloat(t.view.offset().top)+parseFloat(t.view.height()/2))?!t.reverse:t.reverse):t.reverse;
	}
	mgl = mgl * (t.toleft?-1:1);
	t.moved = true;
	t.rolling(mgl, 'once');
	evt.preventDefault();
	return false;
};
