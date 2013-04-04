/**
	goround
	auth: noritomo.suzuki@flexfirm.ksk.co.jp
	条件
		jqueryがincludeされている事
		main.jsがincludeされている事
	引数
		ビューID
		コンテナID
		アニメーションレート
		自動回転の速度
		アニメーションモード（0:margin-left 1:translate3d）
		親がいる場合は引数に渡すこと。ないならnull
		超過スクロールの遊びを許すか
		クリックとみなす遊びの範囲
		クリックと認識する時間の範囲
		マウスホイール一回でスクロールする量
		マウススワイプでスクロールするか
		スクロールバーを独自にデザインしたい場合はクラス名を入れる。デフォルトにしたいならnull
		resize時にスクロールバーを設定し直すか判定する関数
**/
function Goround(args){
	this._id = '';
	this.path = 'img/';
	this.prefix = 'frm';
	this.safix = '.png';
	this.startnum = 0;
	this.endnum = 20;
	this.digit = 3;
	this.movepx = 10;//画像を回転させるスワイプ量
	this.framerate = 40;//アニメーションレート
	this.clickplay = 1;//クリックとみなすスワイプ量
	this.clickplaytime = 100;//クリックとみなす操作時間
	this.move_friction = 20.0;//自動移動の減速加速度。
	this.move_freetime = 100;//自動移動の減速が発動するまでの時間
	this.handlemouse = true;
	this.reverse = false;
	
	if(args!=null){
		if(args.id!=undefined)this._id = args.id;
		if(args.path != undefined)this.path = args.path;
		if(args.prefix != undefined)this.prefix = args.prefix;
		if(args.safix != undefined)this.safix = args.safix;
		if(args.startnum != undefined)this.startnum = args.startnum;
		if(args.endnum != undefined)this.endnum = args.endnum;
		if(args.digit != undefined)this.digit = args.digit;
		if(args.movepx!=undefined)this.movepx = args.movepx;
		if(args.framerate!=undefined)this.framerate = parseFloat(args.framerate);//アニメーションレート
		if(args.clickplay!=undefined)this.clickplay = args.clickplay;//クリックとみなすスワイプ量
		if(args.clickplaytime!=undefined)this.clickplaytime = args.clickplaytime;//クリックとみなす操作時間
		if(args.friction!=undefined)this.move_friction = args.friction;//自動移動の減速加速度。
		if(args.freetime!=undefined)this.move_freetime = args.freetime;//自動移動の減速が発動するまでの時間
		if(args.handlemouse!=undefined)this.handlemouse = args.handlemouse;//
		if(args.reverse!=undefined)this.reverse = args.reverse;//
	}
	this.view = $('#' + this._id);
	this.left = 0;
	this.nowidx = 0;
	this.rolling_anime = null;
	this.upper = this.reverse;
	
	this.interval = 1 / this.framerate;
	this.move_friction = this.move_friction / this.interval;
	
	this.frmnum = this.endnum - this.startnum + 1;
	
	this.setleft = function(tgt, lft, toleft){
		var cnt = tgt.nowidx;
//	$('#console').html(toleft+' > '+tgt.upper);
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
//		tgt.view.get(0).replaceChild(tgt.images[tgt.nowidx], tgt._img);
		tgt.view.children().detach();
		tgt.view.append(tgt.images[tgt.nowidx]);
		tgt._img = tgt.images[tgt.nowidx];
		tgt.view.height(tgt.images[tgt.nowidx].innerHeight);
	};
	this.getleft = function(tgt){return parseInt(this.left);};
	
	var userAgent = window.navigator.userAgent.toLowerCase();
	this.vpre = '';
	if(userAgent.indexOf('webkit') != -1){
		this.vpre = '-webkit-';
	}
	else if(userAgent.indexOf('gecko') != -1){
		this.vpre = '-moz-';
	}
	else if(userAgent.indexOf('opera') != -1){
		this.vpre = '-o-';
	}
	
	this.rolling = this.rolling_notate;
	
	this.moved = false;//スクロールしたか
	this.st_x = 0;//タッチスタートx座標
	this.move_x = 0;//ドラッグ中x座標
	this.move_y = 0;//ドラッグ中y座標
	this.st_y = 0;//タッチスタートy座標
	this.st_time = 0;//タッチスタート時刻
	this.ed_x = 0;//タッチエンドx座標
	this.ed_y = 0;//タッチエンドy座標
	this.rolling_speed = 0.0;//現在の回転速度
	this.rolling_anime = null;//setTimeOutの戻り値
	this.toleft = true;//animation時に使用する左向きの回転かどうか
	
	this.view.css({position: 'relative', overflow: 'hidden'});
	this.view.css('overflow', 'hidden');
//	$(document).on('touchend', '#'+this._id+' *', {tgt: this}, function(evt){
//		var ta = $(this);
//		var href = ta.attr("href");
//		var t = evt.data.tgt;
////		var ed_time = evt.timeStamp;
////		if(t.clickplay >= Math.abs(t.ed_x - t.st_x) && t.clickplaytime >= (ed_time - t.st_time)){
//alert('aa');
//		if(!t.moved){
//			ta.click();
//			window.open(href, "_self");
//		}
//	});
//	if(this.handlemouse){
//		$(document).on('mouseup', '#'+this._id+' *', {tgt: this}, function(evt){
//			var ta = $(this);
//			var href = ta.attr("href");
//			var t = evt.data.tgt;
////			var ed_time = evt.timeStamp;
////			if(t.clickplay >= Math.abs(t.ed_x - t.st_x) && t.clickplaytime >= (ed_time - t.st_time)){
//alert('aa');
//			if(!t.moved){
//				ta.click();
//				window.open(href, "_self");
//			}
//		});
//	}

	this.view.on('touchstart', {tgt: this}, this.page_touchstart);
	this.view.on('touchend', {tgt: this}, this.page_touchend);
	if(this.handlemouse){
		this.view.on('mousedown', {tgt: this}, this.page_touchstart);
		this.view.on('mouseup', {tgt: this}, this.page_touchend);
	}
	this.view.on('click', {tgt: this}, function(evt){evt.preventDefault();});
//	this.view.on('touchmove', {tgt: this}, this.page_touchmove);
//	if(this.handlemouse){
//		this.view.on('mousemove', {tgt: this}, this.page_touchmove);
//	}
	
	this.zero = '';
	for(var i = 0; i < this.digit; i++)
		this.zero += '0';
	this.images = [];
	var igwk;
	var keisu = this.digit * -1;
	for(var i = 0; i < this.frmnum; i++){
		igwk = new Image();
		igwk.src = this.path + this.prefix + (this.zero+(this.startnum + i)).slice(keisu)+this.safix;
		igwk.style.position = 'relative';
		igwk.style.zIndex = -1;
		this.images.push($(igwk));
	}
	this._img = this.images[0];
	this.view.append(this._img);
//	this.view.height(this._img.innerHeight);
//	var top = parseInt(this.view.offset().top);
//	var height = parseInt(this._img.innerHeight);
//	$('#console').html(top+' + ('+height+' / 2)');
//	this.half = this.view.offset().top+(this._img.innerHeight/2);
}
Goround.prototype.rolling_notate = function(d, once){
	var t = this;
	var toleft = d<0?true:false;
	var deg = Math.abs(parseInt(d));
	
	t.setleft(t, deg, toleft);
	
	if(once!=null){
		clearTimeout(t.rolling_anime);
		t.rolling_anime = null;
		return;
	}
	//$('#console').html(t.rolling_speed+' -= '+t.move_friction);
	var dt = new Date();
	var tim = dt.getTime();
	if(tim >= (t.move_freetime + t.st_time)){
		t.rolling_speed -= t.move_friction;
	}
	if(t.rolling_speed<=0){
		clearTimeout(t.rolling_anime);
		t.rolling_anime = null;
		return;
	}
	deg = t.rolling_speed * t.interval * (t.toleft?-1:1);
	t.rolling_anime = t.rolling.applyTimeout(t.interval * 1000, t, [deg, null]);
}
Goround.prototype.page_touchstart = function(evt){
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
//	t._through = 0;
	t.view.on('touchmove', {tgt: t}, t.page_touchmove);
	if(t.handlemouse){
		t.view.on('mousemove', {tgt: t}, t.page_touchmove);
	}
	if(p!=undefined && p!=null){
		p.page_touchstart(evt);
	}
	evt.preventDefault();
//	if(t.prevent_touch_start)evt.preventDefault();//子要素の処理を抑制するために必要だが、子要素側でタッチスタート時にスルーしてほしい旨を伝えられたらpreventDefaultしない
}
Goround.prototype.page_touchend = function(evt){
	var t = evt.data.tgt;
	t.moved = false;
	t.view.off('touchmove', t.page_touchmove);
	if(t.handlemouse){
		t.view.off('mousemove', t.page_touchmove);
	}
//	if(t._through == 2){
//		return true;
//	}
	t.ed_time = evt.timeStamp;
	var len = Math.sqrt(Math.pow(t.ed_x - t.st_x, 2) + Math.pow(t.ed_y - t.st_y, 2));
//	t._through = 0;
	t.rolling_speed = len / ((t.ed_time - t.st_time) / 1000);

	var isclick = true;//クリックを子要素に伝えるか。この処理はクリックなどページ遷移をしない時に必要
	if(t.clickplay < Math.abs(t.ed_x - t.st_x) || t.clickplaytime < (t.ed_time - t.st_time)){//クリックの遊びの範囲内で一定時間以上タップしたならクリックさせるが、それを越えたらイベントをブロック
		isclick = false;
		evt.preventDefault();
	}
	t.st_time = 0;
	if(t.ed_x == t.st_x){
		return isclick;//動いていない時はアニメーションしない
	}
	var tgt = evt.data.tgt;
	//左向きか右向きかを決定する要素は真ん中より右か左かとスピード
	//スピードは位置より優先される
	t.toleft = true;
	if(t.st_x > t.ed_x){
		t.toleft = true;
	}
	else{
		t.toleft = false;
	}
	var deg = t.rolling_speed * t.interval * (t.toleft?-1:1);

	t.upper = t.ed_y>(parseInt(t.view.offset().top)+parseInt(t.view.height()/2))?!t.reverse:t.reverse;
	t.rolling_anime = t.rolling.applyTimeout(t.interval * 1000, t, [deg, null]);
	return isclick;
}
Goround.prototype.page_touchmove = function(evt){
	var t = evt.data.tgt;
	if(t.st_time<=0)return;
	t.ed_x = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).pageX;
	t.ed_y = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).pageY;
	var tgt = evt.data.tgt;
	var mgl = (t.ed_x - t.move_x);
	t.toleft = mgl<0?false:true;
	t.moved = true;
	t.upper = t.ed_y>(parseInt(t.view.offset().top)+parseInt(t.view.height()/2))?!t.reverse:t.reverse;
	t.rolling(mgl, 'once');
	t.move_x = t.ed_x;
	t.move_y = t.ed_y;
//	t.prevent_touch_start = true;
	evt.preventDefault();
	return false;
}
