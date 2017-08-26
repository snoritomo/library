/**
	styless-tabs
	auth: noritomo.suzuki@kikisoftware.com
	条件
		jqueryがincludeされている事
	引数
		contentcontainerid: （必須）コンテンツ表示コンテナのid
		indexcontentids: （必須）紐付けるタブインデックスとコンテンツの組み合わせをメンバに持つオブジェクト
		handlemode: (0)0:全て 1:マウス 2:タッチ
		defaultzindex: (0)コンテンツコンテナのz-index
		zindexinterval: (10)前後処理で設定するz-indexの間隔
		adjustwidth: (true)幅を揃える
		adjustheight: (true)高さを揃える
		invisiblehidecontent: (false)最前面以外をdisplay:noneする
**/
function StylessTabs(args){
	this._contentcontainerid = '';
	this._indexcontentids = {};
	this.handlemode = 0;
	this.defaultzindex = 0;
	this.zindexinterval = 10;
	this.adjustwidth = true;
	this.adjustheight = true;
	this.invisiblehidecontent = false;
	if(args!=null){
		if(args.contentcontainerid!=undefined)this._contentcontainerid = args.contentcontainerid;
		if(args.indexcontentids!=undefined)this._indexcontentids = args.indexcontentids;
		if(args.handlemode!=undefined)this.handlemode = args.handlemode;
		if(args.defaultzindex!=undefined)this.defaultzindex = args.defaultzindex;
		if(args.zindexinterval!=undefined)this.zindexinterval = args.zindexinterval;
		if(args.adjustwidth!=undefined)this.adjustwidth = args.adjustwidth;
		if(args.adjustheight!=undefined)this.adjustheight = args.adjustheight;
		if(args.invisiblehidecontent!=undefined)this.invisiblehidecontent = args.invisiblehidecontent;
	}
	this.contentcontainer = $('#'+this._contentcontainerid);
	this.contentposition = this.contentcontainer.position();
	this.contenttop = this.contentposition.top;
	this.contentleft = this.contentposition.left;
	this.contentwidthdeg = $(window).innerWidth() - this.contentcontainer.width();
	
	this.contentwidth = (this.contentcontainer.get(0).style.width!=''?this.contentcontainer.innerWidth():0);
	this.contentheight = (this.contentcontainer.get(0).style.height!=''?this.contentcontainer.innerHeight():0);
	this.contentsmaxwidth = 0;
	this.contentsmaxheight = 0;
	
	this.handlemouse = true;
	this.handletouch = true;
	if(this.handlemode==1)this.handletouch = false;
	if(this.handlemode==2)this.handlemouse = false;
	
	this.oncontentchange = [];
	
	this.tabindexes = [];
	this.contents = [];
	
	var cnt = 0;
	var digheight = 0;
	for(var key in this._indexcontentids){
		var tabindex = $('#'+key);
		if(tabindex==null || tabindex.length<=0)continue;
		var content = $('#'+this._indexcontentids[key]);
		if(content==null || content.length<=0)continue;
		
		content.css({
			zIndex: this.defaultzindex - (cnt==0?0:this.zindexinterval),
			top: 0,
			left: 0,
			position: 'absolute'
		});
		if(cnt>0 && this.invisiblehidecontent){
			content.css({
				display: 'none'
			});
		}
		digheight -= content.outerHeight();
		if(content.height()>this.contentsmaxheight)this.contentsmaxheight = content.height();
		if(content.width()>this.contentsmaxwidth)this.contentsmaxwidth = content.width();
		
		if(this.handletouch){
			tabindex.on('touchstart', {tgt: this}, this.change_content);
		}
		if(this.handlemouse){
			tabindex.on('click', {tgt: this}, this.change_content);
		}
		
		this.tabindexes.push(tabindex);
		this.contents.push(content);
		cnt++;
	}
	this.tabcount = cnt;
	
	this.contentcontainer.css({
		zIndex: this.defaultzindex,
		position: 'relative'
	});
	if(this.adjustheight){
		this.adjust_height();
	}
	if(this.adjustwidth){
		this.adjust_width();
	}
	
	$(window).on('resize', {tgt: this}, function(evt){
		var t = evt.data.tgt;
		t.contentcontainer.width($(window).innerWidth() - t.contentwidthdeg);
	});
};
StylessTabs.prototype.change_content = function(evt){
	var t = evt.data.tgt;
	for(var cidx in t.contents){
		var c = t.contents[cidx];
		if(c.css==undefined)continue;
		c.css({
			zIndex: t.defaultzindex - t.zindexinterval
		});
		if(t.invisiblehidecontent){
			c.css({
				display: 'none'
			});
		}
	}
	var idxid = $(this).attr('id');
	var idx = $('#'+idxid);
	var cont = $('#'+t._indexcontentids[idxid]);
	cont.css({
		zIndex: t.defaultzindex
	});
	if(t.invisiblehidecontent){
		cont.css({
			display: 'block'
		});
	}
	t.doContentChange(idx, cont);
};
StylessTabs.prototype.setOnContentChange = function(f){
	this.oncontentchange.push(f);
};
StylessTabs.prototype.doContentChange = function(tabindex, content){
	for(var i = 0; i < this.oncontentchange.length; i++){
		var f = this.oncontentchange[i];
		f(tabindex, content);
	}
};
StylessTabs.prototype.adjust_height = function(){
	for(var ckey in this.contents){
		var cval = this.contents[ckey];
		if(cval.css==undefined)continue;
		cval.css({height: this.contentsmaxheight});
	}
	this.contentcontainer.css({
		height: this.contentsmaxheight
	});
	this.contentheight = this.contentcontainer.height();
};
StylessTabs.prototype.adjust_width = function(){
	for(var ckey in this.contents){
		var cval = this.contents[ckey];
		if(cval.css==undefined)continue;
		cval.css({width: this.contentsmaxwidth});
	}
	this.contentcontainer.css({
		width: this.contentsmaxwidth
	});
	this.contentwidth = this.contentcontainer.width();
};
StylessTabs.prototype.adjustHeight = function(h){
	this.contentsmaxheight = h;
	this.adjust_height();
};
StylessTabs.prototype.adjustWidth = function(w){
	this.contentsmaxwidth = w;
	this.adjust_width();
};
StylessTabs.prototype.adjustMaxHeight = function(){
	this.contentsmaxheight = this.getMaxHeight();
	this.adjust_height();
};
StylessTabs.prototype.adjustMaxWidth = function(){
	this.contentsmaxwidth = this.getMaxWidth();
	this.adjust_width();
};
StylessTabs.prototype.getMaxHeight = function(){
	var re = 0;
	for(var ckey in this.contents){
		var cval = this.contents[ckey];
		if(cval.css==undefined)continue;
		if(cval.outerHeight()>re)re = cval.outerHeight();
	}
	return re;
};
StylessTabs.prototype.getMaxWidth = function(){
	var re = 0;
	for(var ckey in this.contents){
		var cval = this.contents[ckey];
		if(cval.css==undefined)continue;
		if(cval.outerWidth()>re)re = cval.outerWidth();
	}
	return re;
};

