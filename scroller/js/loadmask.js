/**
	ロードマスク
	auth: noritomo.suzuki@flexfirm.ksk.co.jp
	条件
		jqueryがincludeされている事
		main.jsがincludeされている事
	引数
		マスクしたいブロック要素のID
		マスクのスタイルを記述したclass
		タイムアウトとみなしてマスクを外すまでの時間
		マスク除去のアニメーション関数
**/
function Loadmask(id, cls, loadingtimeout, animate){
	this.id = id;
	this.covered = $('#'+id);
	this.covered.css('position', 'relative');
	this.maskid = id+'_mask';
	this.covered.append('<div id="'+this.maskid+'" style="position:absolute;top:0;left:0;width:100%;height:100%;" class="'+cls+'"></div>');
	this.mask = $('#'+this.maskid);
	this.images = this.covered.find('img');
	this.imagecnt = this.images.size();
	this.loadedcnt = 0;
	this.animate = animate;
	if(this.imagecnt<=0){
		this.loaded({data:{ldmask:this}});
	}
	else{
		this.images.on('load', {ldmask:this}, this.loaded);
	}
	var timeout = function(evt){
		this.loadedcnt = this.imagecnt;
		this.loaded(evt);
	}
	timeout.applyTimeout(loadingtimeout, this, [{data:{ldmask:this}}]);
}
Loadmask.prototype.loaded = function(evt){
	if(evt.data==undefined)return;
	var t = evt.data.ldmask;
	t.mask.width(t.covered.width()+t.covered.css('paddingLeft')+t.covered.css('paddingRight'));
	t.mask.height(t.covered.height()+t.covered.css('paddingTop')+t.covered.css('paddingBottom'));
	t.loadedcnt++;
	if(t.imagecnt<=t.loadedcnt){
		t.animate(t.mask);
	}
}
