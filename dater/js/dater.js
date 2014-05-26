/**
	dater
	auth: noritomo.suzuki@nolib.jp
	条件
		jqueryがincludeされている事
	引数
		id: （必須）inputのid
		suggestbasedcalendar: (true)直接入力したときのsuggest listのベース年月日をカレンダーベースにする
		inputname: (id+'_')inputが変更されるname属性
		informat: (0)入力時の判定フォーマット。0:yyyymmdd 1:ddmmyyyy 2:mmddyyyy
		outformat: (0)表示のフォーマット。0:yyyymmdd 1:ddmmyyyy 2:mmddyyyy
		outdemiliter: (-)表示の区切り文字
		outstrmonth: (0)表示の月表示。0:数値 1:文字
		outydigit: (4)表示の年桁数
		outmzero: (true)表示の月を０埋めするか
		outdzero: (true)表示の日を０埋めするか
		sendformat: (0)送信時のフォーマット。0:yyyymmdd 1:ddmmyyyy 2:mmddyyyy
		senddemiliter: (-)送信時の区切り文字
		sendstrmonth: (0)送信時の月表示。0:数値 1:文字
		sendydigit: (4)送信時の年桁数
		sendmzero: (true)送信時の月を０埋めするか
		senddzero: (true)送信時の日を０埋めするか
		calmin: (-1)表示するカレンダーの最初の月。今月からの相対月数
		calmax: (1)表示するカレンダーの最後の月。今月からの相対月数
		calweeklang: (en)カレンダーの曜日の表示言語
		console: コンソール設定オブジェクト
			ydigit: (4)年桁数
			strmonth: (1)月表示。0:数値 1:文字
			mzero: (true)月を０埋めするか
			dzero: (true)日を０埋めするか
		input_class: (dater_input)テキストボックスにつけられるclass
		console_class: (dater_console)表示されるコントロールボックスにつけられるclass
		console_left_pane_class: (dater_console_left)コントロールボックスの左ペインにつけられるclass
		console_right_pane_class: (dater_console_right)コントロールボックスの右ペインにつけられるclass
		suggest_list_class: (dater_suggest_list)入力に対する日付候補一覧につけられるclass
		suggest_list_selected_class: (dater_suggest_list_selected)選択中の日付候補につけられるclass
		suggest_list_hover_class: (dater_suggest_list_hover)マウスhoverしているliにつけられるclass
		calendar_block_class: (dater_calendar_block)カレンダー領域につけられるclass
		calendar_control_class: (dater_calendar_control)カレンダーコントロールボックスにつけられるclass
		year_box_class: (dater_year_box)年領域につけられるclass
		year_prev_class: (dater_year_prev)年の左側ボタンにつけられるclass
		year_next_class: (dater_yaer_next)年の右側ボタンにつけられるclass
		year_class: (dater_year)年を表示する領域につけられるclass
		month_box_class: (dater_month_box)月領域につけられるclass
		month_prev_class: (dater_month_prev)月の左側ボタンにつけられるclass
		month_next_class: (dater_month_next)月の右側ボタンにつけられるclass
		month_class: (dater_month)月を表示する領域につけられるclass
		calendar_header_class: (dater_calendar_header)１月のカレンダーの何月かを表す部分につけられるclass
		calendar_class: (dater_calendar)カレンダーテーブルにつけられるclass
		calendar_sunday_class: (dater_calendar_sunday)日曜のtdにつけられるclass
		calendar_saturday_class: (dater_calendar_saturday)土曜のtdにつけられるclass
		calendar_onday_class: (dater_calendar_onday)平日のtdにつけられるclass
		calendar_today_class: (dater_calendar_today)今日のtdにつけられるclass
		calendar_selected_day_class: (dater_calendar_selected_day)選択された日付のtdにつけられるclass
		calendar_out_of_month_class: (dater_calendar_out_of_month)テーブル内の月外日付のtdにつけられるclass
		calendar_hover_day_class: (dater_calendar_hover_day)マウスhoverしているtdにつけられるclass
**/
function Dater(args){
	this._id = args.id;
	this._input = $('#'+this._id);
	this.inputname = this._input.attr('name')+'_';
	this.suggestbasedcalendar = true;
	this.informat = 0;
	this.outformat = 0;
	this.outdemiliter = '-';
	this.outstrmonth = 0;
	this.outydigit = 4;
	this.outmzero = true;
	this.outdzero = true;
	this.sendformat = 0;
	this.senddemiliter = '-';
	this.sendstrmonth = 0;
	this.sendydigit = 4;
	this.sendmzero = true;
	this.senddzero = true;
	this.console = {ydigit: 4, strmonth: 0, mzero: true, dzero: false};
	this.ydig = -4;
	this.mdig = -2;
	this.ddig = -2;
	this.yfill = '00000';
	this.mfill = '000';
	this.dfill = '000';
	this.calmin = -1;
	this.calmax = 1;
	this.calweeklang = 'en';
	this.input_class = 'dater_input';
	this.console_class = 'dater_console';
	this.console_left_pane_class = 'dater_console_left';
	this.console_right_pane_class = 'dater_console_right';
	this.suggest_list_class = 'dater_suggest_list';
	this.suggest_list_selected_class = 'dater_suggest_list_selected';
	this.suggest_list_hover_class = 'dater_suggest_list_hover';
	this.calendar_block_class = 'dater_calendar_block';
	this.calendar_control_class = 'dater_calendar_control';
	this.year_box_class = 'dater_year_box';
	this.year_prev_class = 'dater_year_prev';
	this.year_next_class = 'dater_yaer_next';
	this.year_class = 'dater_year';
	this.month_box_class = 'dater_month_box';
	this.month_prev_class = 'dater_month_prev';
	this.month_next_class = 'dater_month_next';
	this.month_class = 'dater_month';
	this.calendar_header_class = 'dater_calendar_header';
	this.calendar_class = 'dater_calendar';
	this.calendar_sunday_class = 'dater_calendar_sunday';
	this.calendar_saturday_class = 'dater_calendar_saturday';
	this.calendar_onday_class = 'dater_calendar_onday';
	this.calendar_today_class = 'dater_calendar_today';
	this.calendar_selected_day_class = 'dater_calendar_selected_day';
	this.calendar_out_of_month_class = 'dater_calendar_out_of_month';
	this.calendar_hover_day_class = 'dater_calendar_hover_day';
	
	if(args.inputname!=undefined)this.inputname = args.inputname;
	if(args.suggestbasedcalendar!=undefined)this.suggestbasedcalendar = args.suggestbasedcalendar;
	if(args.informat!=undefined)this.informat = args.informat;
	if(args.outformat!=undefined)this.outformat = args.outformat;
	if(args.outdemiliter!=undefined)this.outdemiliter = args.outdemiliter;
	if(args.outstrmonth!=undefined)this.outstrmonth = args.outstrmonth;
	if(args.outydigit!=undefined)this.outydigit = args.outydigit;
	if(args.outmzero!=undefined)this.outmzero = args.outmzero;
	if(args.outdzero!=undefined)this.outdzero = args.outdzero;
	if(args.sendformat!=undefined)this.sendformat = args.sendformat;
	if(args.senddemiliter!=undefined)this.senddemiliter = args.senddemiliter;
	if(args.sendstrmonth!=undefined)this.sendstrmonth = args.sendstrmonth;
	if(args.sendydigit!=undefined)this.sendydigit = args.sendydigit;
	if(args.sendmzero!=undefined)this.sendmzero = args.sendmzero;
	if(args.senddzero!=undefined)this.senddzero = args.senddzero;
	if(args.calmin!=undefined)this.calmin = args.calmin;
	if(args.calmax!=undefined)this.calmax = args.calmax;
	if(args.calweeklang!=undefined)this.calweeklang = args.calweeklang;
	if(args.console!=null){
		if(args.console.ydigit!=undefined)this.console.ydigit = args.console.ydigit;
		if(args.console.strmonth!=undefined)this.console.strmonth = args.console.strmonth;
		if(args.console.mzero!=undefined)this.console.mzero = args.console.mzero;
		if(args.console.dzero!=undefined)this.console.dzero = args.console.dzero;
	}
	if(args.input_class!=undefined)this.input_class = args.input_class;
	if(args.console_class!=undefined)this.console_class = args.console_class;
	if(args.console_left_pane_class!=undefined)this.console_left_pane_class = args.console_left_pane_class;
	if(args.console_right_pane_class!=undefined)this.console_right_pane_class = args.console_right_pane_class;
	if(args.suggest_list_class!=undefined)this.suggest_list_class = args.suggest_list_class;
	if(args.suggest_list_selected_class!=undefined)this.suggest_list_selected_class = args.suggest_list_selected_class;
	if(args.suggest_list_hover_class!=undefined)this.suggest_list_hover_class = args.suggest_list_hover_class;
	if(args.calendar_block_class!=undefined)this.calendar_block_class = args.calendar_block_class;
	if(args.calendar_control_class!=undefined)this.calendar_control_class = args.calendar_control_class;
	if(args.year_box_class!=undefined)this.year_box_class = args.year_box_class;
	if(args.year_prev_class!=undefined)this.year_prev_class = args.year_prev_class;
	if(args.year_next_class!=undefined)this.year_next_class = args.year_next_class;
	if(args.year_class!=undefined)this.year_class = args.year_class;
	if(args.month_box_class!=undefined)this.mont_boxh_class = args.month_box_class;
	if(args.month_prev_class!=undefined)this.month_prev_class = args.month_prev_class;
	if(args.month_next_class!=undefined)this.month_next_class = args.month_next_class;
	if(args.month_class!=undefined)this.month_class = args.month_class;
	if(args.calendar_header_class!=undefined)this.calendar_header_class = args.calendar_header_class;
	if(args.calendar_class!=undefined)this.calendar_class = args.calendar_class;
	if(args.calendar_sunday_class!=undefined)this.calendar_sunday_class = args.calendar_sunday_class;
	if(args.calendar_saturday_class!=undefined)this.calendar_saturday_class = args.calendar_saturday_class;
	if(args.calendar_onday_class!=undefined)this.calendar_onday_class = args.calendar_onday_class;
	if(args.calendar_today_class!=undefined)this.calendar_today_class = args.calendar_today_class;
	if(args.calendar_selected_day_class!=undefined)this.calendar_selected_day_class = args.calendar_selected_day_class;
	if(args.calendar_out_of_month_class!=undefined)this.calendar_out_of_month_class = args.calendar_out_of_month_class;
	if(args.calendar_hover_day_class!=undefined)this.calendar_hover_day_class = args.calendar_hover_day_class;
	
	this.today = new Date();
	this.yy = this.today.getFullYear();
	this.mm = this.today.getMonth();
	this.dd = this.today.getDate();
	this.todayyy = this.yy;
	this.todaymm = this.mm;
	this.todaydd = this.dd;
	this.trgdate = null;
	
	this.listindex = null;
	this.inputflg = false;
	
	this.onfocus = [];
	this.onblur = [];
	this.cancelblur = true;
	this.mouseuponinput = false;
	
	this.months = new Array(12);
	this.months[0] = "January";
	this.months[1] = "February";
	this.months[2] = "March";
	this.months[3] = "April";
	this.months[4] = "May";
	this.months[5] = "June";
	this.months[6] = "July";
	this.months[7] = "August";
	this.months[8] = "September";
	this.months[9] = "October";
	this.months[10] = "November";
	this.months[11] = "December";

	this.mons = new Array(12);
	this.mons[0] = "Jan";
	this.mons[1] = "Feb";
	this.mons[2] = "Mar";
	this.mons[3] = "Apr";
	this.mons[4] = "May";
	this.mons[5] = "Jun";
	this.mons[6] = "Jul";
	this.mons[7] = "Aug";
	this.mons[8] = "Sep";
	this.mons[9] = "Oct";
	this.mons[10] = "Nov";
	this.mons[11] = "Dec";

	this.week = new Array(7);
	if(this.calweeklang == 'ja'){
		this.week[0] = "日";
		this.week[1] = "月";
		this.week[2] = "火";
		this.week[3] = "水";
		this.week[4] = "木";
		this.week[5] = "金";
		this.week[6] = "土";
	}
	else{
		this.week[0] = "Su";
		this.week[1] = "Mo";
		this.week[2] = "Tu";
		this.week[3] = "We";
		this.week[4] = "Th";
		this.week[5] = "Fr";
		this.week[6] = "Sa";
	}
	
	this._send = $(document.createElement('input'));
	this._send.attr('id', this._id+'_hidden');
	this._send.attr('type', 'hidden');
	this._send.attr('name', this._input.attr('name'));
	this._input.attr('name', this.inputname);
	
	this._console = $(document.createElement('div'));
	this._console.addClass(this.console_class);
	var lft = $(document.createElement('div'));
	lft.addClass(this.console_left_pane_class);
	var rht = $(document.createElement('div'));
	rht.addClass(this.console_right_pane_class);
	var lst = $(document.createElement('ul'));
	lst.addClass(this.suggest_list_class);
	lft.append(lst);
	this._console.append(this._send);
	this._console.append(lft);
	this._console.append(rht);
	this._console.left = lft;
	this._console.list = lst;
	this._console.right = rht;
	this._console.css('position', 'absolute');
	this._console.css('top', this._input.position().top + this._input.height);
	this._console.css('left', this._input.position().left);
	
	this._input.after(this._console);
	
	this._input.addClass(this.input_class);
	
	this._input.on('focus', {tgt: this}, this.doFocus);
	this._input.on('keyup', {tgt: this}, this.doKeyup);
	this._input.on('keydown', {tgt: this}, this.doKeydown);
	if(document.ontouchstart !== undefined){
		this._input.on('touchend', {tgt: this}, this.doMouseup);
		this._console.on('touchstart', {tgt: this}, function(evt){var dater = evt.data.tgt;dater.cancelblur = true;dater.mouseuponinput = true;});
		$(document).on('touchend', {tgt: this}, function(evt){var dater = evt.data.tgt;dater.cancelblur = false;dater.doBlur(evt);dater.mouseuponinput = false;});
	}
	else{
		this._input.on('mouseup', {tgt: this}, this.doMouseup);
		this._console.on('mousedown', {tgt: this}, function(evt){var dater = evt.data.tgt;dater.cancelblur = true;dater.mouseuponinput = true;});
		$(document).on('mouseup', {tgt: this}, function(evt){var dater = evt.data.tgt;dater.cancelblur = false;dater.doBlur(evt);dater.mouseuponinput = false;});
	}
	
	this.drawCalendar();
	this._console.hide();
};
Dater.prototype.openConsole = function(){
	var t = this;
	this._console.fadeIn(100, function(){t._input.select();});
};
Dater.prototype.closeConsole = function(){
	this._console.fadeOut(100);
};
Dater.prototype.calcDay = function(refdate, addDays){
	var targetSec = refdate.getTime() + (addDays * 86400000);
	var re = new Date();
	re.setTime(targetSec);
	return re;
};
Dater.prototype.getMonthEndDay = function(year, month){
	var dt = new Date(year, month, 0);
	return dt.getDate();
};
Dater.prototype.calcMonth = function(refdate, addMonths){
	var year = refdate.getFullYear();
	var month = refdate.getMonth();
	var day = refdate.getDate();
	month += addMonths;
	var endDay = this.getMonthEndDay(year, month + 1);
	if(day > endDay)day = endDay;
	return new Date(year, month, day);
};
/* mode 0:output 1:formsend */
Dater.prototype.getDateString = function(date, mode){
	var format = 0;
	var dem = '';
	var ydig = -4;
	var mstr = false;
	var mzero = true;
	var dzero = true;
	if(mode==0){
		format = this.outformat;
		dem = this.outdemiliter;
		ydig = this.outydigit * -1;
		mstr = this.outstrmonth;
		mzero = this.outmzero;
		dzero = this.outdzero;
	}
	else if(mode==1){
		format = this.sendformat;
		dem = this.senddemiliter;
		ydig = this.sendydigit * -1;
		mstr = this.sendstrmonth;
		mzero = this.sendmzero;
		dzero = this.senddzero;
	}
	var y = (this.yfill + date.getFullYear()).slice(ydig);
	var m = (mstr?this.mons[date.getMonth()]:(mzero?(this.mfill + (date.getMonth()+1)).slice(this.mdig):(date.getMonth()+1)));
	var d = (dzero?(this.dfill + (date.getDate())).slice(this.ddig):(date.getDate()));
	var ymd = '';
	if(format==0){
		ymd = y+dem+m+dem+d;
	}
	else if(format==1){
		ymd = d+dem+m+dem+y;
	}
	else if(format==2){
		ymd = m+dem+d+dem+y;
	}
	return ymd;
};
Dater.prototype.drawCalendar = function(){
	this._console.right.html('');
	var header = $(document.createElement('div'));
	header.addClass(this.calendar_control_class);
	var yybox = $(document.createElement('div'));
	var yl = $(document.createElement('div'));
	var yy = $(document.createElement('div'));
	var yr = $(document.createElement('div'));
	var mmbox = $(document.createElement('div'));
	var ml = $(document.createElement('div'));
	var mm = $(document.createElement('div'));
	var mr = $(document.createElement('div'));
	yybox.addClass(this.year_box_class);
	yl.addClass(this.year_prev_class);
	yy.addClass(this.year_class);
	yr.addClass(this.year_next_class);
	mmbox.addClass(this.month_box_class);
	ml.addClass(this.month_prev_class);
	mm.addClass(this.month_class);
	mr.addClass(this.month_next_class);
	yl.on('mousedown', {tgt: this}, function(evt){evt.preventDefault();});
	yr.on('mousedown', {tgt: this}, function(evt){evt.preventDefault();});
	ml.on('mousedown', {tgt: this}, function(evt){evt.preventDefault();});
	mr.on('mousedown', {tgt: this}, function(evt){evt.preventDefault();});
	yl.on('click', {tgt: this}, function(evt){var t = evt.data.tgt;t.yy--;if(t.suggestbasedcalendar){t.drawList();}t.drawCalendar();});
	yr.on('click', {tgt: this}, function(evt){var t = evt.data.tgt;t.yy++;if(t.suggestbasedcalendar){t.drawList();}t.drawCalendar();});
	ml.on('click', {tgt: this}, function(evt){var t = evt.data.tgt;t.mm--;if(t.suggestbasedcalendar){t.drawList();}t.drawCalendar();});
	mr.on('click', {tgt: this}, function(evt){var t = evt.data.tgt;t.mm++;if(t.suggestbasedcalendar){t.drawList();}t.drawCalendar();});
	
	var cdate = new Date(this.yy, this.mm, 1);
	this.yy = cdate.getFullYear();
	this.mm = cdate.getMonth();
	
	yy.html((this.yfill + this.yy).slice(this.console.ydigit*-1));
	mm.html(this.console.strmonth?this.mons[this.mm]:(this.console.mzero?(this.mfill + (this.mm+1)).slice(this.mdig):(this.mm+1)));
	
	yybox.append(yl);
	yybox.append(yy);
	yybox.append(yr);
	mmbox.append(ml);
	mmbox.append(mm);
	mmbox.append(mr);
	header.append(yybox);
	header.append(mmbox);
	this._console.right.append(header);
	
	for(var i = this.calmin; i <= this.calmax; i++){
		var d = this.calcMonth(cdate, i);
		var m = d.getMonth();
		var cal = $(document.createElement('div'));
		cal.addClass(this.calendar_block_class);
		var hd = $(document.createElement('div'));
		hd.addClass(this.calendar_header_class);
		hd.html(this.console.strmonth?this.mons[m]:(this.console.mzero?(this.mfill + (m+1)).slice(this.mdig):(m+1)));
		cal.append(hd);
		var tbl = $(document.createElement('table'));
		tbl.addClass(this.calendar_class);
		var thd = $(document.createElement('tr'));
		for(var k = 0; k < 7; k++){
			var th = $(document.createElement('th'));
			if(k==0){
				th.addClass(this.calendar_sunday_class);
			}
			else if(k==6){
				th.addClass(this.calendar_saturday_class);
			}
			else{
				th.addClass(this.calendar_onday_class);
			}
			th.html(this.week[k]);
			thd.append(th);
		}
		tbl.append(thd);
		var curdate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
		while(true){
			var tr = $(document.createElement('tr'));
			for(var k = 0; k < 7; k++){
				var td = $(document.createElement('td'));
				tr.append(td);
				if(k==0){
					td.addClass(this.calendar_sunday_class);
				}
				else if(k==6){
					td.addClass(this.calendar_saturday_class);
				}
				else{
					td.addClass(this.calendar_onday_class);
				}
				if(curdate.getDay()>k || curdate.getMonth()!=m){
					td.addClass(this.calendar_out_of_month_class);
					continue;
				}
				if(curdate.getFullYear()==this.todayyy && curdate.getMonth()==this.todaymm && curdate.getDate()==this.todaydd){
					td.addClass(this.calendar_today_class);
				}
				if(this.trgdate!=null && curdate.getFullYear()==this.trgdate.getFullYear() && curdate.getMonth()==this.trgdate.getMonth() && curdate.getDate()==this.trgdate.getDate()){
					td.addClass(this.calendar_selected_day_class);
				}
				var d = (this.console.dzero?(this.dfill + (curdate.getDate())).slice(this.ddig):(curdate.getDate()));
				td.html(d);
				td.attr('yy', curdate.getFullYear());
				td.attr('mm', curdate.getMonth());
				td.attr('dd', curdate.getDate());
				td.on('click', {tgt: this}, this.calendar_on_click);
				td.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.calendar_hover_day_class);});
				td.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.calendar_hover_day_class);});
				curdate = this.calcDay(curdate, 1);
			}
			tbl.append(tr);
			if(curdate.getMonth()!=m)break;
		}
		cal.append(tbl);
		this._console.right.append(cal);
	}
};
Dater.prototype.drawList = function(){
	this.listindex = null;
	try{
		this._console.list.html('');
		var txt = this._input.val().split(/\D/, 3);
		var yyyy;
		var mmmm;
		if(this.suggestbasedcalendar){
			yyyy = this.yy;
			mmmm = this.mm;
		}
		else{
			yyyy = this.todayyy;
			mmmm = this.todaymm;
		}
		if(txt.length==0){
		}
		else if(txt.length==1){
			var t = txt[0];
			if(t.length==1){
				var itm = new Date(yyyy, mmmm, t);
				var li = $(document.createElement('li'));
				li.html(this.getDateString(itm, 0));
				li.attr('yy', itm.getFullYear());
				li.attr('mm', itm.getMonth());
				li.attr('dd', itm.getDate());
				li.on('click', {tgt: this}, this.list_on_click);
				li.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
				li.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				this._console.list.append(li);
			}
			else if(t.length==2){
				var ed = this.getMonthEndDay(yyyy, mmmm + 1);
				var dd = parseInt(t);
				var ad = null;
				if(t<=ed){
					var aditm = new Date(yyyy, mmmm, dd);
					ad = $(document.createElement('li'));
					ad.html(this.getDateString(aditm, 0));
					ad.attr('yy', aditm.getFullYear());
					ad.attr('mm', aditm.getMonth());
					ad.attr('dd', aditm.getDate());
					ad.on('click', {tgt: this}, this.list_on_click);
					ad.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					ad.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				var m;
				var d;
				if(this.informat==1){
					m = parseInt(t.charAt(1))-1;
					d = parseInt(t.charAt(0));
				}
				else{
					m = parseInt(t.charAt(0))-1;
					d = parseInt(t.charAt(1));
				}
				var itm = new Date(yyyy, m, d);
				var li = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					li = $(document.createElement('li'));
					li.html(this.getDateString(itm, 0));
					li.attr('yy', itm.getFullYear());
					li.attr('mm', itm.getMonth());
					li.attr('dd', itm.getDate());
					li.on('click', {tgt: this}, this.list_on_click);
					li.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					li.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				if(ad!=null){
					this._console.list.append(ad);
				}
				if(li!=null){
					this._console.list.append(li);
				}
			}
			else if(t.length==3){
				var m;
				var d;
				if(this.informat==1){
					m = parseInt(t.slice(2))-1;
					d = parseInt(t.slice(0, 2));
				}
				else{
					m = parseInt(t.slice(0, 1))-1;
					d = parseInt(t.slice(1));
				}
				var itm = new Date(yyyy, m, d);
				var ad = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					ad = $(document.createElement('li'));
					ad.html(this.getDateString(itm, 0));
					ad.attr('yy', itm.getFullYear());
					ad.attr('mm', itm.getMonth());
					ad.attr('dd', itm.getDate());
					ad.on('click', {tgt: this}, this.list_on_click);
					ad.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					ad.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				if(this.informat==1){
					m = parseInt(t.slice(1))-1;
					d = parseInt(t.slice(0, 1));
				}
				else{
					m = parseInt(t.slice(0, 2))-1;
					d = parseInt(t.slice(2));
				}
				itm = new Date(yyyy, m, d);
				var li = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					li = $(document.createElement('li'));
					li.html(this.getDateString(itm, 0));
					li.attr('yy', itm.getFullYear());
					li.attr('mm', itm.getMonth());
					li.attr('dd', itm.getDate());
					li.on('click', {tgt: this}, this.list_on_click);
					li.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					li.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				if(ad!=null){
					this._console.list.append(ad);
				}
				if(li!=null){
					this._console.list.append(li);
				}
			}
			else if(t.length==4){
				var m;
				var d;
				if(this.informat==1){
					m = parseInt(t.slice(2))-1;
					d = parseInt(t.slice(0, 2));
				}
				else{
					m = parseInt(t.slice(0, 2))-1;
					d = parseInt(t.slice(2));
				}
				var itm = new Date(yyyy, m, d);
				var ad = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					ad = $(document.createElement('li'));
					ad.html(this.getDateString(itm, 0));
					ad.attr('yy', itm.getFullYear());
					ad.attr('mm', itm.getMonth());
					ad.attr('dd', itm.getDate());
					ad.on('click', {tgt: this}, this.list_on_click);
					ad.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					ad.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				var y;
				if(this.informat==0){
					y = t.slice(0, 2);
					m = parseInt(t.slice(2, 3))-1;
					d = parseInt(t.slice(3));
				}
				else if(this.informat==1){
					y = t.slice(2);
					m = parseInt(t.slice(1, 2))-1;
					d = parseInt(t.slice(0, 1));
				}
				else if(this.informat==2){
					y = t.slice(2);
					m = parseInt(t.slice(0, 1))-1;
					d = parseInt(t.slice(1, 2));
				}
				itm = new Date(String(yyyy).slice(0, 2)+y, m, d);
				var li = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					li = $(document.createElement('li'));
					li.html(this.getDateString(itm, 0));
					li.attr('yy', itm.getFullYear());
					li.attr('mm', itm.getMonth());
					li.attr('dd', itm.getDate());
					li.on('click', {tgt: this}, this.list_on_click);
					li.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					li.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				if(this.informat==0){
					y = t.slice(0, 1);
					m = parseInt(t.slice(1, 3))-1;
					d = parseInt(t.slice(3));
				}
				else if(this.informat==1){
					y = t.slice(3);
					m = parseInt(t.slice(1, 3))-1;
					d = parseInt(t.slice(0, 1));
				}
				else if(this.informat==2){
					y = t.slice(3);
					m = parseInt(t.slice(0, 2))-1;
					d = parseInt(t.slice(2, 3));
				}
				itm = new Date(String(yyyy).slice(0, 3)+y, m, d);
				var li1 = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					li1 = $(document.createElement('li'));
					li1.html(this.getDateString(itm, 0));
					li1.attr('yy', itm.getFullYear());
					li1.attr('mm', itm.getMonth());
					li1.attr('dd', itm.getDate());
					li1.on('click', {tgt: this}, this.list_on_click);
					li1.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					li1.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				if(this.informat==0){
					y = t.slice(0, 1);
					m = parseInt(t.slice(1, 2))-1;
					d = parseInt(t.slice(2));
				}
				else if(this.informat==1){
					y = t.slice(3);
					m = parseInt(t.slice(2, 3))-1;
					d = parseInt(t.slice(0, 2));
				}
				else if(this.informat==2){
					y = t.slice(3);
					m = parseInt(t.slice(0, 2))-1;
					d = parseInt(t.slice(2, 3));
				}
				itm = new Date(String(yyyy).slice(0, 3)+y, m, d);
				var li2 = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					li2 = $(document.createElement('li'));
					li2.html(this.getDateString(itm, 0));
					li2.attr('yy', itm.getFullYear());
					li2.attr('mm', itm.getMonth());
					li2.attr('dd', itm.getDate());
					li2.on('click', {tgt: this}, this.list_on_click);
					li2.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					li2.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				if(ad!=null){
					this._console.list.append(ad);
				}
				if(li!=null){
					this._console.list.append(li);
				}
				if(li1!=null){
					this._console.list.append(li1);
				}
				if(li2!=null){
					this._console.list.append(li2);
				}
			}
			else if(t.length==5){
				var y;
				var m;
				var d;
				if(this.informat==0){
					y = t.slice(0, 1);
					m = parseInt(t.slice(1, 3))-1;
					d = parseInt(t.slice(3));
				}
				else if(this.informat==1){
					y = t.slice(4);
					m = parseInt(t.slice(2, 4))-1;
					d = parseInt(t.slice(0, 2));
				}
				else if(this.informat==2){
					y = t.slice(4);
					m = parseInt(t.slice(0, 2))-1;
					d = parseInt(t.slice(2, 4));
				}
				var itm = new Date(String(yyyy).slice(0, 3)+y, m, d);
				var ad = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					ad = $(document.createElement('li'));
					ad.html(this.getDateString(itm, 0));
					ad.attr('yy', itm.getFullYear());
					ad.attr('mm', itm.getMonth());
					ad.attr('dd', itm.getDate());
					ad.on('click', {tgt: this}, this.list_on_click);
					ad.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					ad.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				if(this.informat==0){
					y = t.slice(0, 2);
					m = parseInt(t.slice(2, 3))-1;
					d = parseInt(t.slice(3));
				}
				else if(this.informat==1){
					y = t.slice(3);
					m = parseInt(t.slice(2, 3))-1;
					d = parseInt(t.slice(0, 2));
				}
				else if(this.informat==2){
					y = t.slice(3);
					m = parseInt(t.slice(0, 1))-1;
					d = parseInt(t.slice(1, 3));
				}
				itm = new Date(String(yyyy).slice(0, 2)+y, m, d);
				var li = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					li = $(document.createElement('li'));
					li.html(this.getDateString(itm, 0));
					li.attr('yy', itm.getFullYear());
					li.attr('mm', itm.getMonth());
					li.attr('dd', itm.getDate());
					li.on('click', {tgt: this}, this.list_on_click);
					li.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					li.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				if(this.informat==0){
					y = t.slice(0, 2);
					m = parseInt(t.slice(2, 4))-1;
					d = parseInt(t.slice(4));
				}
				else if(this.informat==1){
					y = t.slice(3);
					m = parseInt(t.slice(1, 3))-1;
					d = parseInt(t.slice(0, 1));
				}
				else if(this.informat==2){
					y = t.slice(3);
					m = parseInt(t.slice(0, 2))-1;
					d = parseInt(t.slice(2, 3));
				}
				itm = new Date(String(yyyy).slice(0, 2)+y, m, d);
				var li1 = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					li1 = $(document.createElement('li'));
					li1.html(this.getDateString(itm, 0));
					li1.attr('yy', itm.getFullYear());
					li1.attr('mm', itm.getMonth());
					li1.attr('dd', itm.getDate());
					li1.on('click', {tgt: this}, this.list_on_click);
					li1.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					li1.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				if(this.informat==0){
					y = t.slice(0, 3);
					m = parseInt(t.slice(3, 4))-1;
					d = parseInt(t.slice(4));
				}
				else if(this.informat==1){
					y = t.slice(2);
					m = parseInt(t.slice(1, 2))-1;
					d = parseInt(t.slice(0, 1));
				}
				else if(this.informat==2){
					y = t.slice(2);
					m = parseInt(t.slice(0, 1))-1;
					d = parseInt(t.slice(1, 2));
				}
				itm = new Date(String(yyyy).slice(0, 1)+y, m, d);
				var li2 = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					li2 = $(document.createElement('li'));
					li2.html(this.getDateString(itm, 0));
					li2.attr('yy', itm.getFullYear());
					li2.attr('mm', itm.getMonth());
					li2.attr('dd', itm.getDate());
					li2.on('click', {tgt: this}, this.list_on_click);
					li2.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					li2.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				if(ad!=null){
					this._console.list.append(ad);
				}
				if(li!=null){
					this._console.list.append(li);
				}
				if(li1!=null){
					this._console.list.append(li1);
				}
				if(li2!=null){
					this._console.list.append(li2);
				}
			}
			else if(t.length==6){
				var y;
				var m;
				var d;
				if(this.informat==0){
					y = t.slice(0, 2);
					m = parseInt(t.slice(2, 4))-1;
					d = parseInt(t.slice(4));
				}
				else if(this.informat==1){
					y = t.slice(4);
					m = parseInt(t.slice(2, 4))-1;
					d = parseInt(t.slice(0, 2));
				}
				else if(this.informat==2){
					y = t.slice(4);
					m = parseInt(t.slice(0, 2))-1;
					d = parseInt(t.slice(2, 4));
				}
				var itm = new Date(String(yyyy).slice(0, 2)+y, m, d);
				var ad = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					ad = $(document.createElement('li'));
					ad.html(this.getDateString(itm, 0));
					ad.attr('yy', itm.getFullYear());
					ad.attr('mm', itm.getMonth());
					ad.attr('dd', itm.getDate());
					ad.on('click', {tgt: this}, this.list_on_click);
					ad.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					ad.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				if(this.informat==0){
					y = t.slice(0, 3);
					m = parseInt(t.slice(3, 4))-1;
					d = parseInt(t.slice(4));
				}
				else if(this.informat==1){
					y = t.slice(3);
					m = parseInt(t.slice(2, 3))-1;
					d = parseInt(t.slice(0, 2));
				}
				else if(this.informat==2){
					y = t.slice(3);
					m = parseInt(t.slice(0, 1))-1;
					d = parseInt(t.slice(1, 3));
				}
				itm = new Date(String(yyyy).slice(0, 1)+y, m, d);
				var li = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					li = $(document.createElement('li'));
					li.html(this.getDateString(itm, 0));
					li.attr('yy', itm.getFullYear());
					li.attr('mm', itm.getMonth());
					li.attr('dd', itm.getDate());
					li.on('click', {tgt: this}, this.list_on_click);
					li.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					li.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				if(this.informat==0){
					y = t.slice(0, 3);
					m = parseInt(t.slice(3, 5))-1;
					d = parseInt(t.slice(5));
				}
				else if(this.informat==1){
					y = t.slice(3);
					m = parseInt(t.slice(1, 3))-1;
					d = parseInt(t.slice(0, 1));
				}
				else if(this.informat==2){
					y = t.slice(3);
					m = parseInt(t.slice(0, 2))-1;
					d = parseInt(t.slice(2, 3));
				}
				itm = new Date(String(yyyy).slice(0, 1)+y, m, d);
				var li1 = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					li1 = $(document.createElement('li'));
					li1.html(this.getDateString(itm, 0));
					li1.attr('yy', itm.getFullYear());
					li1.attr('mm', itm.getMonth());
					li1.attr('dd', itm.getDate());
					li1.on('click', {tgt: this}, this.list_on_click);
					li1.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					li1.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				if(this.informat==0){
					y = t.slice(0, 4);
					m = parseInt(t.slice(4, 5))-1;
					d = parseInt(t.slice(5));
				}
				else if(this.informat==1){
					y = t.slice(2);
					m = parseInt(t.slice(1, 2))-1;
					d = parseInt(t.slice(0, 1));
				}
				else if(this.informat==2){
					y = t.slice(2);
					m = parseInt(t.slice(0, 1))-1;
					d = parseInt(t.slice(1, 2));
				}
				itm = new Date(y, m, d);
				var li2 = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					li2 = $(document.createElement('li'));
					li2.html(this.getDateString(itm, 0));
					li2.attr('yy', itm.getFullYear());
					li2.attr('mm', itm.getMonth());
					li2.attr('dd', itm.getDate());
					li2.on('click', {tgt: this}, this.list_on_click);
					li2.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					li2.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				if(ad!=null){
					this._console.list.append(ad);
				}
				if(li!=null){
					this._console.list.append(li);
				}
				if(li1!=null){
					this._console.list.append(li1);
				}
				if(li2!=null){
					this._console.list.append(li2);
				}
			}
			else if(t.length==7){
				var y;
				var m;
				var d;
				if(this.informat==0){
					y = t.slice(0, 3);
					m = parseInt(t.slice(3, 5))-1;
					d = parseInt(t.slice(5));
				}
				else if(this.informat==1){
					y = t.slice(4);
					m = parseInt(t.slice(2, 4))-1;
					d = parseInt(t.slice(0, 2));
				}
				else if(this.informat==2){
					y = t.slice(4);
					m = parseInt(t.slice(0, 2))-1;
					d = parseInt(t.slice(2, 4));
				}
				var itm = new Date(String(yyyy).slice(0, 1)+y, m, d);
				var ad = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					ad = $(document.createElement('li'));
					ad.html(this.getDateString(itm, 0));
					ad.attr('yy', itm.getFullYear());
					ad.attr('mm', itm.getMonth());
					ad.attr('dd', itm.getDate());
					ad.on('click', {tgt: this}, this.list_on_click);
					ad.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					ad.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				if(this.informat==0){
					y = t.slice(0, 4);
					m = parseInt(t.slice(4, 5))-1;
					d = parseInt(t.slice(5));
				}
				else if(this.informat==1){
					y = t.slice(3);
					m = parseInt(t.slice(2, 3))-1;
					d = parseInt(t.slice(0, 2));
				}
				else if(this.informat==2){
					y = t.slice(3);
					m = parseInt(t.slice(0, 1))-1;
					d = parseInt(t.slice(1, 3));
				}
				itm = new Date(y, m, d);
				var li = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					li = $(document.createElement('li'));
					li.html(this.getDateString(itm, 0));
					li.attr('yy', itm.getFullYear());
					li.attr('mm', itm.getMonth());
					li.attr('dd', itm.getDate());
					li.on('click', {tgt: this}, this.list_on_click);
					li.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					li.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				if(this.informat==0){
					y = t.slice(0, 4);
					m = parseInt(t.slice(4, 6))-1;
					d = parseInt(t.slice(6));
				}
				else if(this.informat==1){
					y = t.slice(3);
					m = parseInt(t.slice(1, 3))-1;
					d = parseInt(t.slice(0, 1));
				}
				else if(this.informat==2){
					y = t.slice(3);
					m = parseInt(t.slice(0, 2))-1;
					d = parseInt(t.slice(2, 3));
				}
				itm = new Date(y, m, d);
				var li1 = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					li1 = $(document.createElement('li'));
					li1.html(this.getDateString(itm, 0));
					li1.attr('yy', itm.getFullYear());
					li1.attr('mm', itm.getMonth());
					li1.attr('dd', itm.getDate());
					li1.on('click', {tgt: this}, this.list_on_click);
					li1.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					li1.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				if(ad!=null){
					this._console.list.append(ad);
				}
				if(li!=null){
					this._console.list.append(li);
				}
				if(li1!=null){
					this._console.list.append(li1);
				}
			}
			else if(t.length==8){
				var y;
				var m;
				var d;
				if(this.informat==0){
					y = t.slice(0, 4);
					m = parseInt(t.slice(4, 6))-1;
					d = parseInt(t.slice(6));
				}
				else if(this.informat==1){
					y = t.slice(4);
					m = parseInt(t.slice(2, 4))-1;
					d = parseInt(t.slice(0, 2));
				}
				else if(this.informat==2){
					y = t.slice(4);
					m = parseInt(t.slice(0, 2))-1;
					d = parseInt(t.slice(2, 4));
				}
				var itm = new Date(String(yyyy).slice(0, 1)+y, m, d);
				var ad = null;
				if(itm.getMonth()==m && itm.getDate()==d){
					ad = $(document.createElement('li'));
					ad.html(this.getDateString(itm, 0));
					ad.attr('yy', itm.getFullYear());
					ad.attr('mm', itm.getMonth());
					ad.attr('dd', itm.getDate());
					ad.on('click', {tgt: this}, this.list_on_click);
					ad.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
					ad.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
				}
				if(ad!=null){
					this._console.list.append(ad);
				}
			}
		}
		else if(txt.length==2){
			var m;
			var d;
			if(this.informat==0){
				m = parseInt(txt[0])-1;
				d = parseInt(txt[1]);
			}
			else if(this.informat==1){
				m = parseInt(txt[1])-1;
				d = parseInt(txt[0]);
			}
			else if(this.informat==2){
				m = parseInt(txt[0])-1;
				d = parseInt(txt[1]);
			}
			var itm = new Date(yyyy, m, d);
			var ad = null;
			if(itm.getMonth()==m && itm.getDate()==d){
				ad = $(document.createElement('li'));
				ad.html(this.getDateString(itm, 0));
				ad.attr('yy', itm.getFullYear());
				ad.attr('mm', itm.getMonth());
				ad.attr('dd', itm.getDate());
				ad.on('click', {tgt: this}, this.list_on_click);
				ad.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
				ad.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
			}
			if(ad!=null){
				this._console.list.append(ad);
			}
		}
		else if(txt.length==3){
			var y;
			var m;
			var d;
			if(this.informat==0){
				y = txt[0];
				m = parseInt(txt[1])-1;
				d = parseInt(txt[2]);
			}
			else if(this.informat==1){
				y = txt[2];
				m = parseInt(txt[1])-1;
				d = parseInt(txt[0]);
			}
			else if(this.informat==2){
				y = txt[2];
				m = parseInt(txt[0])-1;
				d = parseInt(txt[1]);
			}
			var stryy = String(yyyy);
			var itm = new Date(stryy.slice(0, stryy.length-y.length)+y, m, d);
			var ad = null;
			if(itm.getMonth()==m && itm.getDate()==d){
				ad = $(document.createElement('li'));
				ad.html(this.getDateString(itm, 0));
				ad.attr('yy', itm.getFullYear());
				ad.attr('mm', itm.getMonth());
				ad.attr('dd', itm.getDate());
				ad.on('click', {tgt: this}, this.list_on_click);
				ad.on('mouseenter', {tgt: this}, function(evt){$(this).addClass(evt.data.tgt.suggest_list_hover_class);});
				ad.on('mouseleave', {tgt: this}, function(evt){$(this).removeClass(evt.data.tgt.suggest_list_hover_class);});
			}
			if(ad!=null){
				this._console.list.append(ad);
			}
		}
	}catch(e){}
};
Dater.prototype.calendar_on_click = function(evt){
	var dater = evt.data.tgt;
	var t = $(this);
	dater.setDate(parseInt(t.attr('yy')), parseInt(t.attr('mm')), parseInt(t.attr('dd')));
	dater.closeConsole();
};
Dater.prototype.list_on_click = function(evt){
	var dater = evt.data.tgt;
	var t = $(this);
	dater.setDate(parseInt(t.attr('yy')), parseInt(t.attr('mm')), parseInt(t.attr('dd')));
	dater.closeConsole();
};
Dater.prototype.setDate = function(yy, mm, dd){
	this.yy = yy;
	this.mm = mm;
	this.dd = dd;
	this.trgdate = new Date(this.yy, this.mm, this.dd);
	this._input.val(this.getDateString(this.trgdate, 0));
	this._send.val(this.getDateString(this.trgdate, 1));
	this.inputflg = false;
	this.drawCalendar();
};
Dater.prototype.setOnFocus = function(f){
	this.onfocus.push(f);
};
Dater.prototype.doFocus = function(evt){
	var dater = evt.data.tgt;
	for(var i = 0; i < dater.onfocus.length; i++){
		var f = dater.onfocus[i];
		f.apply(dater, []);
	}
	dater.cancelblur = false;
	dater.openConsole();
	if(dater.trgdate!=null){
		var txt = '';
		if(dater.informat==0){
			txt = (dater.yfill + String(dater.trgdate.getFullYear())).slice(dater.ydig)+(dater.mfill + (dater.trgdate.getMonth()+1)).slice(dater.mdig)+(dater.dfill + (dater.trgdate.getDate())).slice(dater.ddig);
		}
		else if(dater.informat==1){
			txt = (dater.dfill + (dater.trgdate.getDate())).slice(dater.ddig)+(dater.mfill + (dater.trgdate.getMonth()+1)).slice(dater.mdig)+(dater.yfill + String(dater.trgdate.getFullYear())).slice(dater.ydig);
		}
		else if(dater.informat==2){
			txt = (dater.mfill + (dater.trgdate.getMonth()+1)).slice(dater.mdig)+(dater.dfill + (dater.trgdate.getDate())).slice(dater.ddig)+(dater.yfill + String(dater.trgdate.getFullYear())).slice(dater.ydig);
		}
		dater._input.val(txt);
	}
	dater.drawList();
};
Dater.prototype.setOnBlur = function(f){
	this.onblur.push(f);
};
Dater.prototype.doBlur = function(evt){
	var dater = evt.data.tgt;
	if(dater.cancelblur)return;
	if(dater.mouseuponinput)return;
	for(var i = 0; i < dater.onblur.length; i++){
		var f = dater.onblur[i];
		f.apply(dater, []);
	}
	if(dater.inputflg){
		var sugs = dater._console.list.children();
		if(sugs.size()==1){
			dater.setDate(parseInt(sugs.attr('yy')), parseInt(sugs.attr('mm')), parseInt(sugs.attr('dd')));
		}
		else if(dater._input.val()==''){
			dater.trgdate = null;
			dater.yy = dater.today.getFullYear();
			dater.mm = dater.today.getMonth();
			dater.dd = dater.today.getDate();
			dater._input.val('');
			dater._send.val('');
		}
		else if(dater.trgdate!=null){
			dater.setDate(dater.trgdate.getFullYear(), dater.trgdate.getMonth(), dater.trgdate.getDate());
		}
		else{
			dater.trgdate = null;
			dater.yy = dater.today.getFullYear();
			dater.mm = dater.today.getMonth();
			dater.dd = dater.today.getDate();
			dater._input.val('');
			dater._send.val('');
		}
	}
	else{
		if(dater.trgdate!=null)dater.setDate(dater.trgdate.getFullYear(), dater.trgdate.getMonth(), dater.trgdate.getDate());
	}
	dater.closeConsole();
};
Dater.prototype.doMouseup = function(evt){
	var dater = evt.data.tgt;
	dater.mouseuponinput = true;
};
Dater.prototype.doKeyup = function(evt){
	var dater = evt.data.tgt;
	if(evt.keyCode==38){
		if(dater.listindex==null || dater.listindex<=0){
			dater.listindex = dater._console.list.children().size()-1;
		}
		else{
			dater.listindex--;
		}
		var sel = dater._console.list.children().eq(dater.listindex);
		dater._console.list.children().removeClass(dater.suggest_list_selected_class);
		sel.addClass(dater.suggest_list_selected_class);
		dater.setDate(parseInt(sel.attr('yy')), parseInt(sel.attr('mm')), parseInt(sel.attr('dd')));
		dater.inputflg = false;
	}
	else if(evt.keyCode==40){
		if(dater.listindex==null || dater.listindex>=dater._console.list.children().size()-1){
			dater.listindex = 0;
		}
		else{
			dater.listindex++;
		}
		var sel = dater._console.list.children().eq(dater.listindex);
		dater._console.list.children().removeClass(dater.suggest_list_selected_class);
		sel.addClass(dater.suggest_list_selected_class);
		dater.setDate(parseInt(sel.attr('yy')), parseInt(sel.attr('mm')), parseInt(sel.attr('dd')));
		dater.inputflg = false;
	}
	else{
		dater.inputflg = true;
		dater.drawList();
	}
};
Dater.prototype.doKeydown = function(evt){
	var dater = evt.data.tgt;
	if(evt.keyCode==9){
		dater.cancelblur = false;
		dater.mouseuponinput = false;
		dater.doBlur(evt);
	}
};
