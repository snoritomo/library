/**
	スクローラ
	auth: noritomo.suzuki@flexfirm.ksk.co.jp
	条件
		jqueryがincludeされている事
		main.jsがincludeされている事
	引数
		id: ビューID
		cntid: コンテナID
		parent: 親がいる場合は引数に渡すこと。ないならnull
		speed: 自動回転の速度
		usetranslate: アニメーションモード（0:margin-left 1:translate3d）
		friction: 自動移動の減速加速度。
		freetime: 自動移動の減速が発動するまでの時間
		framerate: アニメーションレート
		clickplay: クリックとみなす遊びの範囲
		clickplaytime: クリックと認識する時間の範囲
		stopborder: 超過スクロールの遊びを許すか
		onwheelrange: マウスホイール一回でスクロールする量
		handlemouse: マウススワイプでスクロールするか
		barclass: スクロールバーを独自にデザインしたい場合はクラス名を入れる。デフォルトにしたいならnull
		issetbar: resize時にスクロールバーを設定し直すか判定する関数
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
}
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
}
if(!Function.callTimeout){
	Function.prototype.callTimeout = function (ms, self)
	{
		return this.applyTimeout(
			ms,
			self,
			Array.prototype.slice.call(arguments, 2));
	};
}
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
}
if(!Function.callInterval){
	Function.prototype.callInterval = function (ms, self)
	{
		return this.applyInterval(
			ms,
			self,
			Array.prototype.slice.call(arguments, 2));
	};
}
function Scroller(args){
	//初めの移動で、縦より横の方が大きくスライドしていたら機能発動
	//機能発動したら内部コンテンツへのイベントバブリングをキャンセルする
	//コンテナの左マージンはページサイズ-1から0をとる
	this._id = args.id;//ビューのID
	this._cntid = args.cntid;//コンテナーのID
	this._this = $('#'+this._id);//ビューのjQueryオブジェクト
	this._container = $('#'+this._cntid);//コンテナのjQueryオブジェクト
	this._container._parent = null;//親にページャがいるならコンテナにページャへの参照を持たせる
	this.move_mostslow = 20;//自動移動の速度
	this.usetranslate = 0;
	this.move_friction = 2.0;//自動移動の減速加速度（ミリ秒単位）。
	this.move_freetime = 200;//自動移動の減速が発動するまでの時間
	this.framerate = 40;//アニメーションレート
	this.clickplay = 1;//クリックとみなすスワイプ量
	this.clickplaytime = 100;//クリックとみなす操作時間
	this.isstopborder = true;//境界線以上にスクロールしないようにするか
	this.wheelrange = 40;//マウスホイールでどれくらい移動するか
	this.handlemouse = true;//マウス操作でスワイプするか
	this.barclass = null;//スクロールバーのクラス名
	this.issetbar = null;//resize時にスクロールバーを設定し直すか判定する関数
	
	if(args.parent!=undefined)this._container._parent = args.parent;//親にページャがいるならコンテナにページャへの参照を持たせる
	if(args.speed!=undefined)this.move_mostslow = parseFloat(args.speed);//自動移動の速度
	if(args.usetranslate!=undefined)this.usetranslate = parseFloat(args.usetranslate);//アニメーションモード（0:margin-left 1:translate3d）
	if(args.friction!=undefined)this.move_friction = parseFloat(args.friction);//自動移動の減速加速度。
	if(args.freetime!=undefined)this.move_freetime = parseFloat(args.freetime);//自動移動の減速が発動するまでの時間
	if(args.framerate!=undefined)this.framerate = parseFloat(args.framerate);//アニメーションレート
	if(args.clickplay!=undefined)this.clickplay = args.clickplay;//クリックとみなすスワイプ量
	if(args.clickplaytime!=undefined)this.clickplaytime = args.clickplaytime;//クリックとみなす操作時間
	if(args.stopborder!=undefined)this.isstopborder = args.stopborder;//境界線以上にスクロールしないようにするか
	if(args.onwheelrange!=undefined)this.wheelrange = args.onwheelrange;//マウスホイールでどれくらい移動するか
	if(args.handlemouse!=undefined)this.handlemouse = args.handlemouse;//マウス操作でスワイプするか
	if(args.barclass!=undefined)this.barclass = args.barclass;//スクロールバーのクラス名
	if(args.issetbar!=undefined)this.issetbar = args.issetbar;//resize時にスクロールバーを設定し直すか判定する関数
	
	this._container._scroller = this;//コンテナにスクローラへの参照を持たせる

	this.interval = 1 / this.framerate;
	this.move_friction = this.move_friction / this.interval;
	
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

	this.ontop = [];
	this.onbottom = [];
	this.onmove = [];
	
	this.moved = false;//スクロールしたか
	this.st_x = 0;//タッチスタートx座標
	this.move_x = 0;//ドラッグ中x座標
	this.move_y = 0;//ドラッグ中y座標
	this.st_y = 0;//タッチスタートy座標
	this.st_time = 0;//タッチスタート時刻
	this.ed_time = 0;//タッチエンド時刻
	this.ed_x = 0;//タッチエンドx座標
	this.ed_y = 0;//タッチエンドy座標
	this.rolling_speed = 0.0;//現在の回転速度
	this.rolling_anime = null;//setTimeOutの戻り値
	this.totop = true;//animation時に使用する左向きの回転かどうか
	this.reverse = false;//戻り中
	this.prevent_touch_start = true;//タッチスタートでpreventDefaultを発生させるフラグ
	this.raise_on_wheel_event_functions = [];
	
	if(this.usetranslate == 1){
		this._container.css('position', 'relative');//translate3dをする場合、コンテナをrelativeにしておかないと残像が残る
		this.settop = function(tgt, lft, mlft){tgt.css(tgt._scroller.vpre+"transform", "translate3d(0px,"+lft+"px,0px)");};//, tgt._scroller.vpre+'transition':tgt._scroller.vpre+'transform '+this.framerate+'ms linear'});};
		this.gettop = function(tgt){return parseInt(tgt._scroller.getY(tgt.css(tgt._scroller.vpre+'transform')));};//var m = new WebKitCSSMatrix(tgt.css(tgt._scroller.vpre+'transform'));return parseInt(m.f);};
		this._container.css(this.vpre+'transform-origin-x', 0);//iphoneでtranslate3dを使う時に初めにこれを指定しておかないとちらつく
		this._container.css(this.vpre+'transform-origin-y', 0);//iphoneでtranslate3dを使う時に初めにこれを指定しておかないとちらつく
		this._container.css(this.vpre+'transform', 'translate3d(0px,0px,0px)');//iphoneでtranslate3dを使う時に初めにこれを指定しておかないとちらつく
	}
	else if(this.usetranslate == 0){
		this.settop = function(tgt, lft, mlft){tgt.css('marginTop', lft);}
		this.gettop = function(tgt){return parseInt(tgt.css('marginTop').replace('px', ''));};
	}
	
	this._this.css('overflow', 'hidden');
	this._this.css('position', 'relative');
	
	var cntn = this._container;
	$(document).on('touchend', '#'+this._cntid+' *', {tgt: this._container}, function(evt){
		var ta = $(this);
		var href = ta.attr("href");
		var t = evt.data.tgt._scroller;
		if(!t.moved){
			ta.click();
			window.open(href, "_self");
		}
	});
	if(this.handlemouse){
		$(document).on('mouseup', '#'+this._cntid+' *', {tgt: this._container}, function(evt){
			var ta = $(this);
			var href = ta.attr("href");
			var t = evt.data.tgt._scroller;
			if(!t.moved){
				ta.click();
				window.open(href, "_self");
			}
		});
	}

	this._container.on('touchstart', {tgt: this._container}, this.page_touchstart);
	this._container.on('touchend', {tgt: this._container}, this.page_touchend);
	if(this.handlemouse){
		this._container.on('mousedown', {tgt: this._container}, this.page_touchstart);
		this._container.on('mouseup', {tgt: this._container}, this.page_touchend);
	}
	if(this.wheelrange>0)this.addWheelEventHandler(function(delta, evt, arg){
		var src = arg.tgt.vpre=='-moz-' ? evt.target : evt.srcElement;
		if(!arg.tgt.isIn(src)){
			return;
		}
		var cntnsize = arg.tgt._container.height();//コンテナの高さ
		var viewsize = arg.tgt._this.height();//ページの高さ
		if(cntnsize<=viewsize)return;
		var nw = arg.tgt.gettop(arg.tgt._container);
		if(delta > 0){
			var to = nw + arg.tgt.wheelrange;
			if(to>0)to = 0;
			if(nw!=0||to!=0)arg.tgt.rolling_to(to-nw, to);//現在地と目的地が同じでなければスクロール
		}
		else{
			var mx = viewsize - cntnsize;
			var to = nw - arg.tgt.wheelrange;
			if(to<mx)to = mx;
			if(nw!=mx||to!=mx)arg.tgt.rolling_to(to-nw, to);//現在地と目的地が同じでなければスクロール
		}
	}, {tgt: this});
	
	if($('#'+this._id+'_bar').size()<=0){
		if(this.barclass==null){
			this._this.append('<div id="'+this._id+'_bar" style="width:3px;position:absolute;right:2px;background-color:#DDDDDD;cursor:pointer;box-shadow: 0px 0px 1px 1px rgba(180,180,180,1);-webkit-border-radius : 2px;-moz-border-radius : 2px;-o-border-radius : 2px;-ms-border-radius : 2px;border-radius : 2px;"></div>');
		}
		else{
			this._this.append('<div id="'+this._id+'_bar" class="'+this.barclass+'"></div>');
		}
	}
	this.bar = $('#'+this._id+'_bar');
	
	this.movebar = false;
	this.bar_y = 0;
	this.bar.on('mousedown', {tgt: this._container}, function(evt){
		var t = evt.data.tgt._scroller;
		t.bar_y = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).screenY;
		t.movebar = true;
		evt.preventDefault();
	});
	$(window).on('mousemove', {tgt: this._container}, function(evt){
		var t = evt.data.tgt._scroller;
		if(t.movebar){
			var pre_y = t.bar_y;
			t.bar_y = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).screenY;
			var cntnsize = t._container.height();//コンテナの高さ
			var viewsize = t._this.height();//ページの高さ	
			if(cntnsize<=viewsize)return;
			var nw = t.gettop(t._container);
			if(pre_y > t.bar_y){
				var to = nw + ((pre_y - t.bar_y)*(cntnsize/viewsize));
				if(to>0)to = 0;
				if(nw!=0||to!=0)t.rolling_to(nw-to, to);//現在地と目的地が同じでなければスクロール
			}
			else{
				var mx = viewsize - cntnsize;
				var to = nw - ((t.bar_y - pre_y)*(cntnsize/viewsize));
				if(to<mx)to = mx;
				if(nw!=mx||to!=mx)t.rolling_to(nw-to, to);//現在地と目的地が同じでなければスクロール
			}
		}
	});
	$(document).on('mouseup', {tgt: this._container}, function(evt){
		var t = evt.data.tgt._scroller;
		t.movebar = false;
		t.bar_y = 0;
	});
	$(window).on('resize', {tgt: this._container}, function(evt){
		var t = evt.data.tgt._scroller;
		if(t.issetbar==null || t.issetbar()){
			t.setBar();
		}
	});
	var me = this;
	if(document.addEventListener){
		document.addEventListener("mousewheel", function(evt){me.wheel(me, evt);}, false);
		document.addEventListener('DOMMouseScroll', function(evt){me.wheel(me, evt);}, false);
	}
	else{
		window.onmousewheel = document.onmousewheel = function(evt){me.wheel(me, evt);};
	}
}
Scroller.prototype.getY = function(obj){
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
}
Scroller.prototype.isIn = function(ele){
	if(ele.id == this._id)return true;
	var parent = ele.parentNode;
	if(parent==null || parent.tagName=='body' || parent.tagName=='html')return false;
	return this.isIn(parent);
}
Scroller.prototype.setOnBottom = function(f){
	this.onbottom.push(f);
}
Scroller.prototype.setOnTop = function(f){
	this.ontop.push(f);
}
Scroller.prototype.setOnMove = function(f){
	this.onmove.push(f);
}
Scroller.prototype.doBottom = function(f){
	for(var i = 0; i < this.onbottom.length; i++){
		var f = this.onbottom[i];
		f();
	}
}
Scroller.prototype.doTop = function(f){
	for(var i = 0; i < this.ontop.length; i++){
		var f = this.ontop[i];
		f();
	}
}
Scroller.prototype.doMove = function(f){
	for(var i = 0; i < this.onmove.length; i++){
		var f = this.onmove[i];
		f();
	}
}
Scroller.prototype.setBar = function(){
	var t = this;
	if(t._container==undefined)return;
	var cntnsize = t._container.height();//コンテナの高さ
	var viewsize = t._this.height();//ページの高さ
	if(cntnsize<=viewsize){
		t.bar.hide();
	}
	else{
		t.bar.show();
		t.bar.height(viewsize*(viewsize/cntnsize));
		var nw = t.gettop(t._container);
		t.bar.css('top', -1*nw*(viewsize/cntnsize));
	}
	t._container.blur();
}
Scroller.prototype.setViewHeightFunction = function(f){
	f();
	$(window).on('resize', f);
}
Scroller.prototype.rolling_notate = function(d, once){
	var t = this;
	var isborder = false;
	var deg = parseInt(d);
	var tgt = t._container;

	var cntnsize = t._container.height();//コンテナの高さ
	var viewsize = t._this.height();//ページの高さ
	if(cntnsize<=viewsize){
		clearTimeout(t.rolling_anime);
		t.rolling_anime = null;
		return;
	}
	var nw = t.gettop(tgt);
	if(once==null && !t.totop && nw > 0){
		t.totop = true;
		deg *= -1;
		t.reverse = true;
	}
	if(once==null && t.totop && (-1 * nw) > (cntnsize - viewsize)){
		t.totop = false;
		deg *= -1;
		t.reverse = true;
	}
	var nex = nw + deg;//次のトップマージン
	var maxh = cntnsize - viewsize;//トップマージンの最小×-1
	var chk1 = maxh + nw;//後いくつ下に行ける（マージンを引ける）か
	var chk2 = maxh + nex;//このの次の処理でいくつ下に行けるか
	var istop = false;
	var isbottom = false;
	//下に向かっているときは、nwが０以下で、nexが０以上（上がはみ出す）か、nwがトップマージンの最小以下でchk2がプラス（下があった）なら
	if(!t.totop && ((nw <= 0 && nex >= 0) || (chk1 <= 0 && chk2 >= 0))){
		if(once==null){
			deg = (chk1 <= 0?chk1 * -1:-1 * nw);
			isborder = true;
		}
		istop = true;
	}
	//上に向かっているときは、nwが０以上でnexが０以下（上があった）か、nwが０以下でchk2がマイナス（下がはみ出す）なら
	else if(t.totop && ((nw >= 0 && nex <= 0) || (nw <= 0 && chk2 <= 0))){
		if(once==null){
			deg = (nw >= 0?-1 * nw:-1*chk1);
			isborder = true;
		}
		isbottom = true;
	}
	nw += deg;

	t.settop(tgt, nw, once==null);
	t.setBar();
	if(istop && nw>=0)t.doTop();
	if(isbottom && nw<=(maxh*-1))t.doBottom();
	if(once!=null){
		clearTimeout(t.rolling_anime);
		t.rolling_anime = null;
		t.doMove();
		return;
	}
	var dt = new Date();
	var tim = dt.getTime();
	if(tim >= (t.move_freetime + t.st_time) && !t.reverse){
		t.rolling_speed -= t.move_friction;
	}
	if(t.rolling_speed<=0 || isborder){
		clearTimeout(t.rolling_anime);
		t.rolling_anime = null;
		t.doMove();
		return;
	}
	deg = t.rolling_speed * t.interval * (t.totop?-1:1);
	t.rolling_anime = t.rolling.applyTimeout(t.interval * 1000, t, [deg, null]);
}
//減速なしのスクロール。速度とトップを指定する
Scroller.prototype.rolling_to = function(d, to){
	var t = this;
	var isborder = false;
	var deg = parseInt(d);
	var tgt = t._container;

	var cntnsize = t._container.height();//コンテナの高さ
	var viewsize = t._this.height();//ページの高さ
	if(cntnsize<=viewsize){
		clearTimeout(t.rolling_anime);
		t.rolling_anime = null;
		return;
	}
	var nw = t.gettop(tgt);
	
	var istop = false;
	var isbottom = false;
	if((deg>0 && nw+deg>=to) || (deg<0 && nw+deg<=to)){
		deg = to-nw;
		isborder = true;
		if(deg>0 && to>=0)istop = true;
		if(deg<0 && to<=(viewsize-cntnsize))isbottom = true;
	}
	
	nw += deg;

	t.settop(tgt, nw, true);
	t.setBar();
	if(istop)t.doTop();
	if(isbottom)t.doBottom();
	if(isborder){
		clearTimeout(t.rolling_anime);
		t.rolling_anime = null;
		t.doMove();
		return;
	}
	t.rolling_anime = t.rolling_to.applyTimeout(t.interval * 1000, t, [d, to]);
}
Scroller.prototype.adjust_position = function(){
	var t = this;
	var tgt = t._container;
	var nw = t.gettop(tgt);
	var tosize = t._this.height() - t._container.height();
	if(nw>0){
		t.scroll_top();
	}
	else if(nw<tosize){
		t.scroll_bottom();
	}
}
Scroller.prototype.scroll_top = function(){
	var t = this;
	var tgt = t._container;
	var nw = t.gettop(tgt);
	if(nw==0)return;
	t.reverse = true;
	t.rolling_speed = t.move_mostslow;
	var deg = t.move_mostslow * t.interval;
	if(nw>0)deg *= -1;
	t.rolling_anime = t.rolling_to.applyTimeout(t.interval * 1000, t, [deg, 0]);
}
Scroller.prototype.scroll_bottom = function(){
	var t = this;
	var tgt = t._container;
	var nw = t.gettop(tgt);
	t.reverse = true;
	t.rolling_speed = t.move_mostslow;
	var deg = t.move_mostslow * t.interval * -1;
	var tosize = t._this.height() - t._container.height();
	if(nw==tosize)return;
	if(nw<tosize)deg *= -1;
	t.rolling_anime = t.rolling_to.applyTimeout(t.interval * 1000, t, [deg, tosize]);
}
Scroller.prototype.page_touchstart = function(evt){
	var t = evt.data.tgt._scroller;
	var p = evt.data.tgt._parent;
	clearTimeout(t.rolling_anime);
	t.st_x = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).screenX;
	t.move_x = t.st_x;
	t.st_y = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).screenY;
	t.move_y = t.st_y;
	t.st_time = evt.timeStamp;
	t.ed_x = t.st_x;
	t.ed_y = t.st_y;
	t._container.on('touchmove', {tgt: t._container}, t.page_touchmove);
	if(t.handlemouse){
		t._container.on('mousemove', {tgt: t._container}, t.page_touchmove);
	}
	t.reverse = false;
	if(p!=undefined && p!=null){
		p.page_touchstart(evt);
	}
	evt.preventDefault();
}
Scroller.prototype.page_touchend = function(evt){
	var t = evt.data.tgt._scroller;
	t.moved = false;
	t._container.off('touchmove', t.page_touchmove);
	if(t.handlemouse){
		t._container.off('mousemove', t.page_touchmove);
	}
	t.ed_time = evt.timeStamp;
	var len = Math.sqrt(Math.pow(t.ed_x - t.st_x, 2) + Math.pow(t.ed_y - t.st_y, 2));
	t.rolling_speed = len / ((t.ed_time - t.st_time) / 1000);

	var isclick = true;//クリックを子要素に伝えるか。この処理はクリックなどページ遷移をしない時に必要
	if(t.clickplay < Math.abs(t.ed_y - t.st_y) || t.clickplaytime < (t.ed_time - t.st_time)){//クリックの遊びの範囲内で一定時間以上タップしたならクリックさせるが、それを越えたらイベントをブロック
		isclick = false;
		evt.preventDefault();
	}
	t.st_time = 0;
	if(t.ed_y == t.st_y){
		return isclick;//動いていない時はアニメーションしない
	}
	var tgt = evt.data.tgt;
	//左向きか右向きかを決定する要素は真ん中より右か左かとスピード
	//スピードは位置より優先される
	t.totop = true;
	if(t.st_y > t.ed_y){
		t.totop = true;
	}
	else{
		t.totop = false;
	}
	var deg = t.rolling_speed * t.interval * (t.totop?-1:1);

	t.rolling_anime = t.rolling.applyTimeout(t.interval * 1000, t, [deg, null]);
	return isclick;
}
Scroller.prototype.page_touchmove = function(evt){
	var t = evt.data.tgt._scroller;
	if(t.st_time<=0)return;
	t.ed_x = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).screenX;
	t.ed_y = (evt.originalEvent.touches!=null?evt.originalEvent.touches[0]:evt).screenY;
	var tgt = evt.data.tgt;
	var mgl = (t.ed_y - t.move_y);
	t.totop = mgl>0?false:true;
	if(t.isstopborder){
		var cntnsize = t._container.height();//コンテナの高さ
		var viewsize = t._this.height();//ページの高さ
		var nw = t.gettop(tgt);
		if((!t.totop && nw >= 0) || (t.totop && (-1 * nw) >= (cntnsize - viewsize))){
			evt.preventDefault();
			return false;
		}
	}
	t.moved = true;
	t.rolling(mgl, 'once');
	t.move_x = t.ed_x;
	t.move_y = t.ed_y;
	evt.preventDefault();
	return false;
}
Scroller.prototype.addWheelEventHandler = function(f, arg){
	var obj = {};
	obj.fn = f;
	obj.arg = arg;
	this.raise_on_wheel_event_functions.push(obj);
}
Scroller.prototype.wheel = function(scroller, event){
	var delta = 0;
	if (!event) /* For IE. */
		event = window.event;
	if (event.wheelDelta) { /* IE/Opera. */
		delta = event.wheelDelta/120;
		if (window.opera)
			delta = delta;
	} else if (event.detail) { /** Mozilla case. */
		delta = -event.detail/3;
	}
	/** If delta is nonzero, handle it.
	 * Basically, delta is now positive if wheel was scrolled up,
	 * and negative, if wheel was scrolled down.
	 */
	if (delta){
		for(var i = 0; i < scroller.raise_on_wheel_event_functions.length; i++){
			var f = scroller.raise_on_wheel_event_functions[i];
			if(f.fn == undefined)continue;
			f.fn(delta, event, f.arg);
		}
	}
	if (event.preventDefault) {
		event.preventDefault();
	}
	event.returnValue = false;
}