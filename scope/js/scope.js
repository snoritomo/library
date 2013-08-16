/**
	スコープ
	auth: noritomo.suzuki@nolib.jp
	条件
		jqueryがincludeされている事
		ビューに使用するブロック要素に幅と高さが指定されている事
		サムネイルに使用するブロック要素に幅が指定されている事
		上記、設定もできるようにした
	引数
		id: ビューのID
		samid: コンテナーのID
		scopeid: スコープのID
		imgid: 元画像のID
		samimgid: サムネイル画像のID
		src: 画像URL
		usetranslate: translate3dを使うか
		scoperate: スコープレート
		imageclass: 元画像class
		samimageclass:サムネイル画像class
		scopeclass: スコープclass
		handlemode: 0:全て 1:マウス 2:タッチ
		autotranslatemode: オペラやベンダープレフィックスの無いブラウザはtranslate3dで動かさない
		viewheight: ビューに設定する高さ
		viewwidth: ビューに設定する横幅
		samwidth: サムネイルに設定する横幅
		fixedview: ビューを動かせないようにする
**/
function Scope(args){
	this._id = args.id;
	this._samid = args.samid;
	this._scopeid = this._samid + '_scope';
	this._imgid = this._id + '_image';
	this._samimgid = this._samid + '_image';
	this._this = $('#'+this._id);
	this._sam = $('#'+this._samid);
	this.src = '';
	this.usetranslate = 0;
	this.scoperate = 0.2;
	this.imageclass = '';
	this.samimageclass = '';
	this.scopeclass = '';
	this.handlemode = 0;
	this.autotranslatemode = true;
	this.fixedview = false;

	if(args!=null){
		if(args.scopeid!=undefined)this._scopeid = args.scopeid;
		if(args.imgid!=undefined)this._imgid = args.imgid;
		if(args.samimgid!=undefined)this._samimgid = args.samimgid;
		if(args.src!=undefined)this.src = args.src;
		if(args.usetranslate!=undefined)this.usetranslate = args.usetranslate;
		if(args.scoperate!=undefined)this.scoperate = args.scoperate;
		if(args.imageclass!=undefined)this.imageclass = args.imageclass;
		if(args.samimageclass!=undefined)this.samimageclass = args.samimageclass;
		if(args.scopeclass!=undefined)this.scopeclass = args.scopeclass;
		if(args.handlemode!=undefined)this.handlemode = args.handlemode;
		if(args.autotranslatemode!=undefined)this.autotranslatemode = args.autotranslatemode;
		if(args.fixedview!=undefined)this.fixedview = args.fixedview;
		if(args.viewheight!=undefined)this._this.height(args.viewheight);
		if(args.viewwidth!=undefined)this._this.width(args.viewwidth);
		if(args.samwidth!=undefined)this._sam.width(args.samwidth);
	}
	
	this.handlemouse = true;
	this.handletouch = true;
	if(this.handlemode==1)this.handletouch = false;
	if(this.handlemode==2)this.handlemouse = false;
	
	this.onmove = [];
	
	if($('#'+this._imgid).size()<=0)this._this.append('<img id="' + this._imgid + '" src="'+this.src+'" class="' + this.imageclass + '"/>');
	this._this.css({position: 'relative', overflow:'hidden'});
	this._image = $('#' + this._imgid);
	this._image.width(this._this.width() / this.scoperate);
	this._image.on('load', {tgt: this}, function(evt){
		var t = evt.data.tgt;
	});
	this._image.css({position: 'absolute'});
	if($('#'+this._samimgid).size()<=0)this._sam.append('<img id="' + this._samimgid + '" src="'+this.src+'" class="' + this.samimageclass + '"/>');
	if($('#'+this._scopeid).size()<=0)this._sam.append('<div id="' + this._scopeid + '" class="' + this.scopeclass + '"></div>');
	this._sam.css({position: 'relative'});
	this._samimage = $('#' + this._samimgid);
	this._samimage.width(this._sam.width());
	this._samimage.on('load', {tgt: this}, function(evt){
		var t = evt.data.tgt;
		t._sam.height(t._samimage.height());
		t.maxtop = t._sam.height() - t._scope.height();
	});
	this._scope = $('#' + this._scopeid);
	this._scope.width(this._sam.width() * this.scoperate);
	this._scope.height(this._scope.width() * (this._this.height() / this._this.width()));
	this._scope.css({position: 'absolute', top: 0, left: 0});

	this.imagerate = this._this.width() / this._sam.width() / this.scoperate;

	this.maxleft = this._sam.width() - this._scope.width();
	
	if(!this.fixedview){
		if(this.handletouch){
			this._scope.on('touchstart', {tgt: this}, this.page_touchstart);
			$(document).on('touchend', {tgt: this}, this.page_touchend);
		}
		if(this.handlemouse){
			this._scope.on('mousedown', {tgt: this}, this.page_touchstart);
			$(document).on('mouseup', {tgt: this}, this.page_touchend);
		}
	}

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

	if(!this.fixedview && this.usetranslate == 1){
		this._scope.css(this.vpre+'transform-origin-x', 0);
		this._scope.css(this.vpre+'transform-origin-y', 0);
		this._scope.css(this.vpre+'transform', 'translate3d(0px,0px,0px)');
		this._image.css(this.vpre+'transform-origin-x', 0);
		this._image.css(this.vpre+'transform-origin-y', 0);
		this._image.css(this.vpre+'transform', 'translate3d(0px,0px,0px)');
	}
};
Scope.prototype.setOnMove = function(f){
	this.onmove.push(f);
};
Scope.prototype.doMove = function(scopeleft, scopetop, imageleft, imagetop){
	for(var i = 0; i < this.onmove.length; i++){
		var f = this.onmove[i];
		f.apply(this, [scopeleft, scopetop, imageleft, imagetop]);
	}
};
Scope.prototype.moveScope = function(left, top){
	var t = this;
	var imgleft = 0;
	var imgtop = 0;
	if(t.usetranslate == 0){
		t._scope.css('left', left);
		t._scope.css('top', top);

		imgleft = -1 * left * t.imagerate;
		imgtop = -1 * top * t.imagerate;
		t._image.css('left', imgleft);
		t._image.css('top', imgtop);
	}
	else{
		imgleft = -1 * left * t.imagerate;
		imgtop = -1 * top * t.imagerate;
		t._scope.css(t.vpre+'transform', 'translate3d('+left+'px,'+top+'px,0px)');
		t._image.css(t.vpre+'transform', 'translate3d('+imgleft+'px,'+imgtop+'px,0px)');
	}
	t.doMove(left, top, imgleft, imgtop);
};
Scope.prototype.getX = function(obj){
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
Scope.prototype.getY = function(obj){
	var cc = 0;
	var re = '';
	var buf = '';
	var len = 13;
	for(var i = 0; i < obj.length; i++){
		var s = obj.charAt(i);
		if(cc>len)break;
		if(s=='('){
			len = buf == 'matrix3d' ? 13 : 5;
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
Scope.prototype.page_touchstart = function(evt){
	var t = evt.data.tgt;
	t.st_x = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).screenX;
	t.move_x = t.st_x;
	t.st_y = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).screenY;
	t.move_y = t.st_y;
	t.st_time = evt.timeStamp;
	t.ed_x = t.st_x;
	t.ed_y = t.st_y;
	if(t.handletouch){
		t._scope.on('touchmove', {tgt: t}, t.page_touchmove);
	}
	if(t.handlemouse){
		t._scope.on('mousemove', {tgt: t}, t.page_touchmove);
	}
	evt.preventDefault();
};
Scope.prototype.page_touchend = function(evt){
	var t = evt.data.tgt;
	if(t.handletouch){
		t._scope.off('touchmove', t.page_touchmove);
	}
	if(t.handlemouse){
		t._scope.off('mousemove', t.page_touchmove);
	}
	t.ed_time = evt.timeStamp;
	t.st_x = 0;
	t.st_y = 0;
	t.st_time = 0;
};
Scope.prototype.page_touchmove = function(evt){
	var t = evt.data.tgt;
	if(t.st_time<=0)return;
	t.ed_x = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).screenX;
	t.ed_y = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).screenY;

	var mglx = 0;
	var mgly = 0;
	var imgleft = 0;
	var imgtop = 0;
	if(t.usetranslate == 0){
		mglx = parseFloat(t._scope.css('left').replace('px', '')) + (t.ed_x - t.move_x);
		mgly = parseFloat(t._scope.css('top').replace('px', '')) + (t.ed_y - t.move_y);
		if(mglx<0)mglx=0;
		if(mgly<0)mgly=0;
		if(mglx>t.maxleft)mglx = t.maxleft;
		if(mgly>t.maxtop)mgly = t.maxtop;
		t._scope.css('left', mglx);
		t._scope.css('top', mgly);

		imgleft = -1 * mglx * t.imagerate;
		imgtop = -1 * mgly * t.imagerate;
		t._image.css('left', imgleft);
		t._image.css('top', imgtop);
	}
	else{
		var trans = t._scope.css(t.vpre+'transform');
		var mglx = parseFloat(t.getX(trans)) + (t.ed_x - t.move_x);
		var mgly = parseFloat(t.getY(trans)) + (t.ed_y - t.move_y);
		if(mglx<0)mglx=0;
		if(mgly<0)mgly=0;
		if(mglx>t.maxleft)mglx = t.maxleft;
		if(mgly>t.maxtop)mgly = t.maxtop;
		imgleft = -1 * mglx * t.imagerate;
		imgtop = -1 * mgly * t.imagerate;
		t._scope.css(t.vpre+'transform', 'translate3d('+mglx+'px,'+mgly+'px,0px)');
		t._image.css(t.vpre+'transform', 'translate3d('+imgleft+'px,'+imgtop+'px,0px)');
	}
	t.doMove(mglx, mgly, imgleft, imgtop);

	t.move_x = t.ed_x;
	t.move_y = t.ed_y;
	evt.preventDefault();
	return false;
};

