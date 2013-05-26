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
		move_friction: 自動移動の減速加速度。
		move_freetime: 自動移動の減速が発動するまでの時間
		rebounddistance: 弾性突破距離
		displacement: コンテナの位置を調整する値
		handlemode: 0:全て 1:マウス 2:タッチ
		autotranslatemode: オペラやベンダープレフィックスの無いブラウザはtranslate3dで動かさない
		nothidden: viewのoverflow:hiddenを抑制する
		autoadjustheight: trueの場合、ビューに自動的にコンテナの高さを指定します
		autofloat: trueの場合、コンテナの子要素にdisplay:block; float:leftが自動的に設定されます
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
	this._id = args.id;
	this._cntid = args.cntid;
	this.usetranslate = 0;
	this.framerate = 40;
	this.move_friction = 40.0;
	this.move_freetime = 1000;
	this.rebounddistance = 15;
	this.displacement = 0;
	this.handlemode = 0;
	this.autotranslatemode = true;
	this.nothidden = false;
	this.autoadjustheight = true;
	this.autofloat = true;
	
	if(args.usetranslate!=undefined)this.usetranslate = args.usetranslate;
	if(args.framerate!=undefined)this.framerate = parseFloat(args.framerate);
	if(args.friction!=undefined)this.move_friction = args.friction;
	if(args.freetime!=undefined)this.move_freetime = args.freetime;
	if(args.rebounddistance!=undefined)this.rebounddistance = args.rebounddistance;
	if(args.displacement!=undefined)this.displacement = args.displacement;
	if(args.handlemode!=undefined)this.handlemode = args.handlemode;
	if(args.autotranslatemode!=undefined)this.autotranslatemode = args.autotranslatemode;
	if(args.nothidden!=undefined)this.nothidden = args.nothidden;
	if(args.autoadjustheight!=undefined)this.autoadjustheight = args.autoadjustheight;
	if(args.autofloat!=undefined)this.autofloat = args.autofloat;

	this.view = $('#' + this._id);
	this.container = $('#' + this._cntid);
	this.container._roller = this;
	
	this.handlemouse = true;
	this.handletouch = true;
	if(this.handlemode==1)this.handletouch = false;
	if(this.handlemode==2)this.handlemouse = false;
	
	this.interval = 1 / this.framerate * 1000;/**アニメーション間隔（ミリ秒）**/
	this.move_friction = this.move_friction / 1000 * this.interval;/**摩擦係数（px毎フレーム）**/
	
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
		this.setleft = function(tgt, lft){tgt.css(tgt._roller.vpre+"transform", "translate3d("+lft+"px,0px,0px)");};
		this.getleft = function(tgt){return parseFloat(tgt._roller.getX(tgt.css(tgt._roller.vpre+'transform')));};
		this.container.css(this.vpre+'transform-origin-x', 0);
		this.container.css(this.vpre+'transform-origin-y', 0);
		this.container.css(this.vpre+'transform', 'translate3d(0px,0px,0px)');
	}
	else if(this.usetranslate == 0){
		this.setleft = function(tgt, lft){tgt.css('left', lft);};
		this.getleft = function(tgt){return parseFloat(tgt.css('left').replace('px', ''));};
		this.container.css('left', 0);
	}
	
	this.view.css('position', 'relative');
	this.container.css('position', 'absolute');
	if(!this.nothidden)this.view.css('overflow', 'hidden');
	
	
	this.rolling = this.rolling_notate;
	
	this.onstop = [];
	this.onskip = [];
	
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
		this.container.on('touchstart', {tgt: this}, this.page_touchstart);
		$(document).on('touchend', {tgt: this}, this.page_touchend);
	}
	if(this.handlemouse){
		this.container.on('mousedown', {tgt: this}, this.page_touchstart);
		$(document).on('mouseup', {tgt: this}, this.page_touchend);
	}
	
	this.items = [];
	var wk;
	var len = this.container.children().size();
	/**this.loadedcount = 0;**/
	for(var i = 0; i < len; i++){
		wk = this.container.children().get(i);
		var jqwk = $(wk);
		this.items.push(jqwk);
		jqwk.on('load', '', {tgt:this}, function(evt){
			/**evt.data.tgt.loadedcount++;**/
			evt.data.tgt.setWidth(true);/**evt.data.tgt.loadedcount>=evt.data.tgt.container.children().size());**/
		});
		if(this.autofloat)jqwk.css({display: 'block', float: 'left'});
	}
};
Roller.prototype.stopAnimation = function(){
	clearTimeout(this.rolling_anime);
	this.rolling_anime = null;
	this.doStop(this.container.children(':eq(0)'), this.container.children(':eq(1)'), this.getleft(this.container));
};
Roller.prototype.setOnSkip = function(f){
	this.onskip.push(f);
};
Roller.prototype.doSkip = function(inertia, fchild, containerx){
	for(var i = 0; i < this.onskip.length; i++){
		var f = this.onskip[i];
		f(inertia, fchild, containerx);
	}
};
Roller.prototype.setOnStop = function(f){
	this.onstop.push(f);
};
Roller.prototype.doStop = function(fchild, schild, containerx){
	var fw = this.getWidth(fchild);
	var sw = this.getWidth(schild);
	var adj = (this.toleft?fw+this.rebounddistance:(fw+sw-this.rebounddistance));
	var judge = adj - this.displacement;
	var just = 0;
	var disp = null;
	if(Math.abs(containerx)>judge){
		just = (sw + fw) * -1;
		disp = this.container.children(':eq(2)');
	}
	else{
		just = fw * -1;
		disp = schild;
	}
	for(var i = 0; i < this.onstop.length; i++){
		var f = this.onstop[i];
		f(disp, just+this.displacement);
	}
};
Roller.prototype.setWidth = function(adjustleft){
	var w = 0;
	for(var i = 0; i < this.items.length; i++){
		w += this.items[i].width();
		w += parseFloat(this.items[i].css("padding-left").replace('px', ''));
		w += parseFloat(this.items[i].css("padding-right").replace('px', ''));
		w += parseFloat(this.items[i].css("margin-left").replace('px', ''));
		w += parseFloat(this.items[i].css("margin-right").replace('px', ''));
		w += parseFloat(this.items[i].css("border-left-width").replace('px', ''));
		w += parseFloat(this.items[i].css("border-right-width").replace('px', ''));
	}
	this.container.width(w);
	if(this.autoadjustheight)this.view.css('height', this.container.outerHeight());
	if(adjustleft){
		var firstchild = this.container.children(':first');
		var secondchild = this.container.children(':eq(1)');
		var w1 = this.getWidth(firstchild);
		var w2 = this.getWidth(secondchild);
		this.setleft(this.container, (w1+w2) * -1);
		this.moveTo(this.displacement, null);
	}
};
Roller.prototype.getWidth = function(tgt){
	var w = 0;
	w += tgt.width();
	w += parseFloat(tgt.css("padding-left").replace('px', ''));
	w += parseFloat(tgt.css("padding-right").replace('px', ''));
	w += parseFloat(tgt.css("margin-left").replace('px', ''));
	w += parseFloat(tgt.css("margin-right").replace('px', ''));
	w += parseFloat(tgt.css("border-left-width").replace('px', ''));
	w += parseFloat(tgt.css("border-right-width").replace('px', ''));
	return w;
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
Roller.prototype.rolling_notate = function(deg, once){
	var t = this;
	var to = t.getleft(t.container) + deg;
	var firstchild = t.container.children(':first');
	var secondchild = t.container.children(':eq(1)');
	var w1 = t.getWidth(firstchild);
	var w2 = t.getWidth(secondchild);
	var tool = (to * -1) - (w1+w2-t.displacement);
	var toor = w1-t.displacement + to;
	var doskipflg = false;
	if(t.toleft && tool > 0){
		while(tool > 0){
			to += w1;
			firstchild.detach();
			t.container.append(firstchild);
			firstchild = secondchild;
			secondchild = t.container.children(':eq(1)');
			w1 = w2;
			w2 = t.getWidth(secondchild);
			tool = (to * -1) - (w1+w2-t.displacement);
		};
		doskipflg = true;
	}
	else if(!t.toleft && toor > 0){
		var lastchild = t.container.children(':last');
		var wl = t.getWidth(lastchild);
		while(toor > 0){
			to -= wl;
			lastchild.detach();
			t.container.prepend(lastchild);
			secondchild = firstchild;
			firstchild = lastchild;
			lastchild = t.container.children(':last');
			w2 = w1;
			w1 = wl;
			wl = t.getWidth(lastchild);
			toor = w1-t.displacement + to;
		};
		doskipflg = true;
	}
	t.setleft(t.container, to);
	if(doskipflg)t.doSkip(once==null && t.rolling_anime!=null, secondchild, to);
	
	if(once==null && t.rolling_anime==null){return;}
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
		t.doStop(firstchild, secondchild, to);
		return;
	}
	var d = t.rolling_speed * (t.toleft?-1:1);
	t.rolling_anime = t.rolling.applyTimeout(t.interval, t, [d, null]);
};
Roller.prototype.moveTo = function(to, duration){
	var nw = this.getleft(this.container);
	
	var diff = to - nw;
	this.toleft = diff<0;
	if(duration==null){
		this.rolling(diff, 'once');
	}
	else{
		var spd = diff / duration * this.interval;
		this.rolling_to.applyTimeout(this.interval, this, [diff, spd]);
	}
};
Roller.prototype.rolling_to = function(to, spd){
	var d = spd;
	var ani = true;
	var nxto = to - spd;
	if((this.toleft && nxto>=0) || (!this.toleft && nxto<=0)){
		d = to;
		ani = false;
	}
	this.rolling(d, 'once');
	if(ani)this.rolling_to.applyTimeout(this.interval, this, [nxto, spd]);
};
Roller.prototype.getToLeft = function(times){
	var w = 0;
	for(var i = 0; i < times; i++){
		var tmp = this.container.children(':eq('+i+')');
		w += this.getWidth(tmp);
	}
	return (w * -1) + this.getleft(this.container);
};
Roller.prototype.getToRight = function(times){
	var w = 0;
	var sz = this.container.children().size()-1;
	for(var i = sz; sz - i < times; i--){
		var tmp = this.container.children(':eq('+i+')');
		w += this.getWidth(tmp);
	}
	return w + this.getleft(this.container);
};
Roller.prototype.goLeft = function(times, duration){
	var w = this.getToLeft(times);
	this.moveTo(w, duration);
};
Roller.prototype.goRight = function(times, duration){
	var w = this.getToRight(times);
	this.moveTo(w, duration);
};
Roller.prototype.page_touchstart = function(evt){
	var t = evt.data.tgt;
	clearTimeout(t.rolling_anime);
	t.st_x = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).screenX;
	t.move_x = t.st_x;
	t.st_y = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).screenY;
	t.move_y = t.st_y;
	var d = new Date();
	t.st_time = d.getTime();
	t.mv_time = d.getTime();
	t.ed_time = d.getTime();
	t.ed_x = t.st_x;
	t.ed_y = t.st_y;
	if(t.handletouch){
		t.container.on('touchmove', {tgt: t}, t.page_touchmove);
	}
	if(t.handlemouse){
		t.container.on('mousemove', {tgt: t}, t.page_touchmove);
	}
};
Roller.prototype.page_touchend = function(evt){
	var t = evt.data.tgt;
	var mve = t.moved;
	t.moved = false;
	if(t.handletouch){
		t.container.off('touchmove', t.page_touchmove);
	}
	if(t.handlemouse){
		t.container.off('mousemove', t.page_touchmove);
	}
	if(t.st_time == 0)return;
	t.st_time = 0;
	var d = new Date();
	var nwtm = d.getTime();
	var len = Math.sqrt(Math.pow(t.ed_x - t.move_x, 2) + Math.pow(t.ed_y - t.move_y, 2));
	t.rolling_speed = len / (nwtm - t.mv_time) * t.interval;/**初期スピード（px毎フレーム）**/
	
	t.toleft = true;
	if(t.move_x > t.ed_x){
		t.toleft = true;
	}
	else{
		t.toleft = false;
	}
	var deg = t.rolling_speed * (t.toleft?-1:1);

	t.rolling_anime = t.rolling.applyTimeout(t.interval, t, [deg, null]);
};
Roller.prototype.page_touchmove = function(evt){
	var t = evt.data.tgt;
	if(t.st_time<=0)return;
	var d = new Date();
	t.mv_time = t.ed_time;
	t.ed_time = d.getTime();
	t.move_x = t.ed_x;
	t.move_y = t.ed_y;
	t.ed_x = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).screenX;
	t.ed_y = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).screenY;
	var mgl = (t.ed_x - t.move_x);
	t.toleft = (mgl<0);
	t.moved = true;
	t.rolling(mgl, 'once');
	if(evt.type='touchmove')evt.preventDefault();
};


