/**
	drop
	auth: noritomo.suzuki@kikisoftware.com
	����
		jquery��include����Ă��鎖
	����
		labelid: �i�K�{�j�\�����x����id
		listid: �i�K�{�j���X�g�R���e�i��id
		labelclass: (__drop_label)�\�����x���ɂ�����class
		listclass: (__drop_list)���X�g�R���e�i�ɕt������class
		listitemclass: (__drop_list_item)���X�g�A�C�e���ɕt������class
		triangleurl: (drop/res/triangle.png)�E���ɕ\������摜
		triangleclass: (__drop_triangle)�E���ɕ\������摜�ɕt������class
		innertag: (div)�����쐬�����A�I�𒆂̕\��������v�f�̃^�O��
		innerid: (labelid+'_inner')�I�𒆂̕\��������v�f��id
		hiddenid: (labelid+'_hidden')�t�H�[�����M�Ɏg�p�����input[hidden]��id
		settopvaluedefault: (true)�\�����x���̋L�ڂ��Ȃ��Ƃ��ɁA��ԏ�̗v�f�������\�����邩
		duration: (200)�h���b�v�A�j���[�V�����̓��쎞��
		droponmouseover: (false)�}�E�X�I�[�o�[�Ń��X�g��W�J�����邩
		uponmouseleave: (false)�}�E�X���[�u�Ń��X�g����邩
		labelthemeclass: (__drop_label_theme)�e�[�}�p�B�I�𒆂̕\��������v�f�ɕt������class
		listitemthemeclass: (__drop_list_item_theme)�e�[�}�p�B���X�g�A�C�e���ɕt������class
**/
function Drop(args){
	this._labelid = '';
	this._listid = '';
	this.labelclass = '__drop_label';
	this.listclass = '__drop_list';
	this.listitemclass = '__drop_list_item';
	this.triangleurl = 'drop/res/triangle.png'
	this.triangleclass = '__drop_triangle';
	this.innertag = 'div';
	this.innerid = '';
	this.hiddenid = '';
	this.settopvaluedefault = true;
	this.duration = 200;
	this.droponmouseover = false;
	this.uponmouseleave = false;
	this.labelthemeclass = '__drop_label_theme';
	this.listitemthemeclass = '__drop_list_item_theme';
	if(args!=null){
		if(args.labelid!=undefined)this._labelid = args.labelid;
		if(args.listid!=undefined)this._listid = args.listid;
		if(args.labelclass!=undefined)this.labelclass = args.labelclass;
		if(args.listclass!=undefined)this.listclass = args.listclass;
		if(args.listitemclass!=undefined)this.listitemclass = args.listitemclass;
		if(args.triangleurl!=undefined)this.triangleurl = args.triangleurl;
		if(args.triangleclass!=undefined)this.triangleclass = args.triangleclass;
		if(args.innertag!=undefined)this.innertag = args.innertag;
		if(args.innerid!=undefined)this.innerid = args.innerid;
		if(args.hiddenid!=undefined)this.hiddenid = args.hiddenid;
		if(args.settopvaluedefault!=undefined)this.settopvaluedefault = args.settopvaluedefault;
		if(args.duration!=undefined)this.duration = args.duration;
		if(args.droponmouseover!=undefined)this.droponmouseover = args.droponmouseover;
		if(args.uponmouseleave!=undefined)this.uponmouseleave = args.uponmouseleave;
		if(args.labelthemeclass!=undefined)this.labelthemeclass = args.labelthemeclass;
		if(args.listitemthemeclass!=undefined)this.listitemthemeclass = args.listitemthemeclass;
	}
	if(this.innerid == '')this.innerid = this._labelid+'_inner';
	if(this.hiddenid == '')this.hiddenid = this._labelid+'_hidden';
	
	this.label = $('#'+this._labelid);
	this.text = this.label.html();
	this.label.html('');
	this.label.addClass(this.labelclass);
	this.list = $('#'+this._listid);
	this.list.addClass(this.listclass);
	
	this.hidden = $(document.createElement('input'));
	this.hidden.attr('id', this.hiddenid);
	this.hidden.attr('type', 'hidden');
	if(this.label.attr('name')!=null){
		this.hidden.attr('name', this.label.attr('name'));
		this.label.attr('name', null);
	}
	this.label.append(this.hidden);
	this.inner = $(document.createElement(this.innertag));
	this.inner.attr('id', this.innerid);
	this.inner.addClass(this.labelthemeclass);
	this.label.append(this.inner);
	
	this.selectedindex = -1;
	this.triangle = $(document.createElement('img'));
	this.triangle.attr('src', this.triangleurl);
	this.triangle.addClass(this.triangleclass);
	this.label.append(this.triangle);
	
	this.items = [];
	for(var i = 1; i <= this.list.children().length; i++){
		var t = this.list.children(':nth-child('+i+')');
		t.attr('data-index', i);
		if(t.attr('value')==undefined)t.attr('value', t.html());
		t.addClass(this.listitemclass);
		t.addClass(this.listitemthemeclass);
		this.items.push(t);
	}
	
	this.maxheight = this.list.height();
	
	if(this.text==''){
		if(this.settopvaluedefault){
			this.select(0);
		}
	}
	else{
		for(var i = 1; i <= this.list.children().length; i++){
			var t = this.list.children(':nth-child('+i+')');
			if(t.html()==this.text){
				this.hidden.val(t.attr('value'));
				break;
			}
		}
	}
	
	this.list.css({
		height: 0,
		display: 'none',
		top: this.label.position().top + this.label.outerHeight(),
		left: this.label.position().left
	});
	this.triangle.on('load', {tgt: this}, function(evt){
		var t = evt.data.tgt;
		t.maxwidth = (t.label.innerWidth() > t.list.innerWidth() ? t.label.innerWidth() : t.list.innerWidth()) + t.triangle.width() + parseInt(t.triangle.css('right').replace('px',''));
		
		t.label.css({
			width: t.maxwidth
		});
		
		t.list.css({
			width: t.maxwidth
		});
	});
	
	this.downtarget = false;
	
	if(this.droponmouseover){
		this.label.on('mouseenter', {tgt: this}, function(evt){
			var t = evt.data.tgt;
			t.down();
		});
	}
	if(this.uponmouseleave){
		this.list.on('mouseleave', {tgt: this}, function(evt){
			var t = evt.data.tgt;
			t.up();
		});
	}
	this.label.on('click', {tgt: this}, function(evt){
		var t = evt.data.tgt;
		t.down();
		t.downtarget = true;
	});
	$(document).on('click', {tgt: this}, function(evt){
		var t = evt.data.tgt;
		if(t.downtarget){
			t.downtarget = false;
			return;
		}
		t.up();
	});
	this.list.children().on('click', {tgt: this}, function(evt){
		var t = evt.data.tgt;
		t.selectItem($(this));
	});
};
Drop.prototype.select = function(idx){
	var tgt = this.list.children(':nth-child('+(idx+1)+')');
	this.selectItem(tgt);
};
Drop.prototype.selectItem = function(tgt){
	this.selectedindex = parseInt(tgt.attr('data-index')) + 1;
	this.inner.html(tgt.html());
	this.hidden.val(tgt.attr('value'));
};
Drop.prototype.down = function(){
	this.list.css({display: 'inline-block', height: 0});
	this.list.animate({height: this.maxheight}, {duration: this.duration});
};
Drop.prototype.up = function(){
	var t = this;
	this.list.animate({height: 0}, {duration: this.duration, complete: function(){t.list.css({display: 'none'});}});
};



