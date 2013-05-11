/**
	ロードマスク
	auth: noritomo.suzuki@nolib.jp
	条件
		jqueryがincludeされている事
	引数
		id: マスクしたいブロック要素のID
		class: マスクのスタイルを記述したclass
		loadingtimeout: マスク除去のアニメーション関数
		animate: タイムアウトとみなしてマスクを外すまでの時間
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
function Loadmask(args){
	this.id = '';
	this.class = '';
	this.loadingtimeout = 3000;
	this.animate = null;
	if(args!=null){
		if(args.id!=undefined)this.id = args.id;
		if(args.class!=undefined)this.class = ' class="'+args.class+'"';
		if(args.loadingtimeout!=undefined)this.loadingtimeout = args.loadingtimeout;
		if(args.animate!=undefined)this.animate = args.animate;
	}
	
	this.maskid = this.id+'_mask';
	this.covered = $('#'+this.id);
	this.covered.css('position', 'relative');
	this.covered.append('<div id="'+this.maskid+'" style="position:absolute;top:0;left:0;width:100%;height:100%;" '+this.class+'></div>');
	this.mask = $('#'+this.maskid);
	this.images = this.covered.find('img');
	this.imagecnt = this.images.size();
	this.loadedcnt = 0;
	if(this.imagecnt<=0){
		this.loaded({data:{ldmask:this}});
	}
	else{
		this.images.on('load', {ldmask:this}, this.loaded);
	}
	var timeout = function(evt){
		this.loadedcnt = this.imagecnt;
		this.loaded(evt);
	};
	timeout.applyTimeout(this.loadingtimeout, this, [{data:{ldmask:this}}]);
};
Loadmask.prototype.loaded = function(evt){
	if(evt.data==undefined)return;
	var t = evt.data.ldmask;
	t.mask.width(t.covered.width()+t.covered.css('paddingLeft')+t.covered.css('paddingRight'));
	t.mask.height(t.covered.height()+t.covered.css('paddingTop')+t.covered.css('paddingBottom'));
	t.loadedcnt++;
	if(t.imagecnt<=t.loadedcnt){
		if(t.animate!=null)t.animate(t.mask);
	}
};
