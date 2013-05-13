/**
	ローラー
	auth: noritomo.suzuki@nolib.jp
	条件
		jqueryがincludeされている事
		main.jsがincludeされている事
	引数
		id: ビューID
		cntid: コンテナID
		usetranslate: translate3dを使うなら1。それ以外は0
		framerate: アニメーションレート
		clickplay: クリックとみなすスワイプ量
		clickplaytime: クリックとみなす操作時間
		move_friction: 自動移動の減速加速度。
		move_freetime: 自動移動の減速が発動するまでの時間
		handlemouse: マウスイベントを拾うか
		autotranslatemode: オペラやベンダープレフィックスの無いブラウザはtranslate3dで動かさない
		nothidden: viewのoverflow:hiddenを抑制する
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
function Roller(args){
	this._id = '';
	this._cntid = '';
	this.usetranslate = 0;
	this.framerate = 40;
	this.clickplay = 1;
	this.clickplaytime = 100;
	this.move_friction = 1.0;
	this.move_freetime = 1000;
	this.handlemouse = true;
	this.autotranslatemode = true;
	this.nothidden = false;
	
	if(args!=null){
		if(args.id!=undefined)this._id = args.id;
		if(args.cntid!=undefined)this._cntid = args.cntid;
		if(args.usetranslate!=undefined)this.usetranslate = args.usetranslate;
		if(args.framerate!=undefined)this.framerate = parseFloat(args.framerate);
		if(args.clickplay!=undefined)this.clickplay = args.clickplay;
		if(args.clickplaytime!=undefined)this.clickplaytime = args.clickplaytime;
		if(args.friction!=undefined)this.move_friction = args.friction;
		if(args.freetime!=undefined)this.move_freetime = args.freetime;
		if(args.handlemouse!=undefined)this.handlemouse = args.handlemouse;
		if(args.autotranslatemode!=undefined)this.autotranslatemode = args.autotranslatemode;
		if(args.nothidden!=undefined)this.nothidden = args.nothidden;
	}
	this.view = $('#' + this._id);
	this.container = $('#' + this._cntid);
	this.container._roller = this;
	
	if(!this.nothidden)this.view.css('overflow', 'hidden');
	
	this.interval = 1 / this.framerate;
	this.move_friction = this.move_friction / this.interval;
	
	var userAgent = window.navigator.userAgent.toLowerCase();
	this.vpre = '';
	if(userAgent.indexOf('android') != -1){
		this.vpre = '-webkit-';
		if(userAgent.indexOf('android 2') != -1){
			if(this.autotranslatemode)this.usetranslate = 0;
		}
		else if(userAgent.indexOf('android 3') != -1){
			if(this.autotranslatemode)this.usetranslate = 0;
		}
	}
	else if(userAgent.indexOf('iphone os') != -1){
		this.vpre = '-webkit-';
		if(userAgent.indexOf('iphone os 4') != -1){
			if(this.autotranslatemode)this.usetranslate = 0;
		}
	}
	else if(userAgent.indexOf('ipad;') != -1){
		this.vpre = '-webkit-';
	}
	else if(userAgent.indexOf('webkit') != -1){
		this.vpre = '-webkit-';
	}
	else if(userAgent.indexOf('gecko') != -1){
		this.vpre = '-moz-';
	}
	else if(userAgent.indexOf('opera') != -1){
		this.vpre = '-o-';
		if(this.autotranslatemode)this.usetranslate = 0;
	}
	else{
		if(this.autotranslatemode)this.usetranslate = 0;
	}
	
	if(this.usetranslate == 1){
		this.container.css('position', 'relative');
		this.setleft = function(tgt, lft){tgt.css(tgt._roller.vpre+"transform", "translate3d("+lft+"px,0px,0px)");};
		this.getleft = function(tgt){return parseInt(tgt._roller.getX(tgt.css(tgt._roller.vpre+'transform')));};
		this.container.css(this.vpre+'transform-origin-x', 0);
		this.container.css(this.vpre+'transform-origin-y', 0);
		this.container.css(this.vpre+'transform', 'translate3d(0px,0px,0px)');
	}
	else if(this.usetranslate == 0){
		this.setleft = function(tgt, lft){tgt.css('marginLeft', lft);};
		this.getleft = function(tgt){return parseInt(tgt.css('marginLeft').replace('px', ''));};
	}
	
	this.rolling = this.rolling_notate;
	
	this.onstop = [];
	this.onskip = [];
	
	this.moved = false;
	this.st_x = 0;
	this.move_x = 0;
	this.move_y = 0;
	this.st_y = 0;
	this.st_time = 0;
	this.ed_x = 0;
	this.ed_y = 0;
	this.rolling_speed = 0.0;
	this.rolling_anime = null;
	this.toleft = true;
	
	$(document).on('touchend', '#'+this._cntid+' *', {tgt: this.container}, function(evt){
		var ta = $(this);
		var href = ta.attr("href");
		var t = evt.data.tgt._roller;
		if(!t.moved){
			ta.click();
			window.open(href, "_self");
		}
	});
	if(this.handlemouse){
		$(document).on('mouseup', '#'+this._cntid+' *', {tgt: this.container}, function(evt){
			var ta = $(this);
			var href = ta.attr("href");
			var t = evt.data.tgt._roller;
			if(!t.moved){
				ta.click();
				window.open(href, "_self");
			}
		});
	}
	this.container.on('touchstart', {tgt: this}, this.page_touchstart);

	$(document).on('touchend', {tgt: this}, this.page_touchend);
	if(this.handlemouse){
		this.container.on('mousedown', {tgt: this}, this.page_touchstart);

		$(document).on('mouseup', {tgt: this}, this.page_touchend);
	}
	this.container.on('click', {tgt: this}, function(evt){evt.preventDefault();});
	
	this.items = [];
	var wk;
	var len = this.container.children().size();
	for(var i = 0; i < len; i++){
		wk = this.container.children().get(i);
		var jqwk = $(wk);
		this.items.push(jqwk);
		jqwk.on('load', '', {tgt:this}, function(evt){
			evt.data.tgt.setWidth();
		});
	}
};
Roller.prototype.stopAnimation = function(){
	clearTimeout(this.rolling_anime);
	this.rolling_anime = null;
	this.doStop(this.container.children(':eq(1)'));
};
Roller.prototype.setOnSkip = function(f){
	this.onskip.push(f);
};
Roller.prototype.doSkip = function(swipe, fchild){
	for(var i = 0; i < this.onskip.length; i++){
		var f = this.onskip[i];
		f(swipe, fchild);
	}
};
Roller.prototype.setOnStop = function(f){
	this.onstop.push(f);
};
Roller.prototype.doStop = function(fchild){
	for(var i = 0; i < this.onstop.length; i++){
		var f = this.onstop[i];
		f(fchild);
	}
};
Roller.prototype.setWidth = function(){
	var w = 0;
	for(var i = 0; i < this.items.length; i++){
		w += this.items[i].width();
		w += parseInt(this.items[i].css("padding-left").replace('px', ''));
		w += parseInt(this.items[i].css("padding-right").replace('px', ''));
		w += parseInt(this.items[i].css("margin-left").replace('px', ''));
		w += parseInt(this.items[i].css("margin-right").replace('px', ''));
		w += parseInt(this.items[i].css("border-left-width").replace('px', ''));
		w += parseInt(this.items[i].css("border-right-width").replace('px', ''));
	}
	this.container.width(w);
};
Roller.prototype.getX = function(obj){
	var cc = 0;
	var re = '';
	var buf = '';
	var len = 12;
	for(var i = 0; i < obj.length; i++){
		var s = obj.charAt(i);
		if(cc>len)break;
		if(s=='('){
			len = buf == 'matrix3d' ? 12 : 4;
			continue;
		}
		buf += s.toLowerCase();
		if(s==','){
			cc++;
			continue;
		}
		if(cc==len && s.match(/[0-9-.]/)){
			re += s;
		}
	}
	return re;
};
Roller.prototype.rolling_notate = function(d, once){
	var t = this;
	var to = t.getleft(t.container) + d;
	var firstchild = t.container.children(':first');
	var secondchild = t.container.children(':eq(1)');
	var tool = (to * -1) - (firstchild.width()+secondchild.width());
	var toor = firstchild.width() + to;
	if(tool > 0){
		while(tool > 0){
			to += firstchild.width();
			firstchild.detach();
			t.container.append(firstchild);
			tool = (to * -1) - (firstchild.width()+secondchild.width());
			firstchild = secondchild;
			secondchild = t.container.children(':eq(1)');
		};
		t.doSkip(once!=null, secondchild);
	}
	else if(toor > 0){
		var lastchild = t.container.children(':last');
		while(toor > 0){
			to -= lastchild.width();
			lastchild.detach();
			t.container.prepend(lastchild);
			toor = firstchild.width() + to;
			firstchild = secondchild;
			secondchild = t.container.children(':eq(1)');
		};
		t.doSkip(once!=null, secondchild);
	}
	t.setleft(t.container, to);
	
	if(once==null && t.rolling_anime==null){return;}
	if(once!=null){
		clearTimeout(t.rolling_anime);
		t.rolling_anime = null;
		return;
	}
	var dt = new Date();
	var tim = dt.getTime();
	if(tim >= (t.move_freetime + t.st_time)){
		t.rolling_speed -= t.move_friction;
	}
	if(t.rolling_speed<=0){
		clearTimeout(t.rolling_anime);
		t.rolling_anime = null;
		t.doStop(secondchild);
		return;
	}
	deg = t.rolling_speed * t.interval * (t.toleft?-1:1);
	t.rolling_anime = t.rolling.applyTimeout(t.interval * 1000, t, [deg, null]);
};
Roller.prototype.page_touchstart = function(evt){
	var t = evt.data.tgt;
	var p = evt.data.tgt._parent;
	clearTimeout(t.rolling_anime);
	t.st_x = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).pageX;
	t.move_x = t.st_x;
	t.st_y = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).pageY;
	t.move_y = t.st_y;
	t.st_time = evt.timeStamp;
	t.ed_x = t.st_x;
	t.ed_y = t.st_y;
	t.container.on('touchmove', {tgt: t}, t.page_touchmove);
	if(t.handlemouse){
		t.container.on('mousemove', {tgt: t}, t.page_touchmove);
	}
	if(p!=undefined && p!=null){
		p.page_touchstart(evt);
	}
	evt.preventDefault();
};
Roller.prototype.page_touchend = function(evt){
	var t = evt.data.tgt;
	t.moved = false;
	t.container.off('touchmove', t.page_touchmove);
	if(t.handlemouse){
		t.container.off('mousemove', t.page_touchmove);
	}
	if(t.st_time == 0)return;
	t.ed_time = evt.timeStamp;
	var len = Math.sqrt(Math.pow(t.ed_x - t.st_x, 2) + Math.pow(t.ed_y - t.st_y, 2));
	t.rolling_speed = len / ((t.ed_time - t.st_time) / 1000);

	var isclick = true;
	if(t.clickplay < Math.abs(t.ed_x - t.st_x) || t.clickplaytime < (t.ed_time - t.st_time)){
		isclick = false;
		evt.preventDefault();
	}
	t.st_time = 0;
	if(t.ed_x == t.st_x){
		return isclick;
	}
	var tgt = evt.data.tgt;
	
	
	t.toleft = true;
	if(t.st_x > t.ed_x){
		t.toleft = true;
	}
	else{
		t.toleft = false;
	}
	var deg = t.rolling_speed * t.interval * (t.toleft?-1:1);

	t.rolling_anime = t.rolling.applyTimeout(t.interval * 1000, t, [deg, null]);
	return isclick;
};
Roller.prototype.page_touchmove = function(evt){
	var t = evt.data.tgt;
	if(t.st_time<=0)return;
	t.ed_x = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).pageX;
	t.ed_y = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).pageY;
	var tgt = evt.data.tgt;
	var mgl = (t.ed_x - t.move_x);
	t.toleft = mgl<0?false:true;
	t.moved = true;
	t.rolling(mgl, 'once');
	t.move_x = t.ed_x;
	t.move_y = t.ed_y;
	evt.preventDefault();
	return false;
};


