/**
	ブラウザ判定クラス
	auth: noritomo.suzuki@nolib.jp
	条件
		なし
	引数
		なし
**/
function Browser(){
	this.w3c = false;
	this.opera = false;
	this.lowie = false;
	this.hiie = false;
	this.webkit = false;
	this.moz = false;
	
	this.userAgent = window.navigator.userAgent.toLowerCase();
	this.appVersion = window.navigator.appVersion.toLowerCase();
	this.btype = 'default';
	if (this.userAgent.indexOf('opera') != -1) {
		this.btype = 'opera';
		this.opera = true;
	}
	else if(this.userAgent.indexOf("msie") != -1) {
		if (this.appVersion.indexOf("msie 4.") != -1) {
			this.btype = 'ie4';
			this.lowie = true;
		}
		else if (this.appVersion.indexOf("msie 5.") != -1) {
			this.btype = 'ie5';
			this.lowie = true;
		}
		else if (this.appVersion.indexOf("msie 6.") != -1) {
			this.btype = 'ie6';
			this.lowie = true;
		}
		else if (this.appVersion.indexOf("msie 7.") != -1) {
			this.btype = 'ie7';
			this.lowie = true;
		}
		else if (this.appVersion.indexOf("msie 8.") != -1) {
			this.btype = 'ie8';
			this.hiie = true;
		}
		else if (this.appVersion.indexOf("msie 9.") != -1) {
			this.btype = 'ie9';
			this.hiie = true;
		}
		else {
			this.w3c = true;
		}
	}
	else if (this.userAgent.indexOf('chrome') != -1) {
		this.btype = 'chrome';
		this.webkit = true;
	}
	else if (this.userAgent.indexOf('safari') != -1) {
		this.btype = 'safari';
		this.webkit = true;
	}
	else if (this.userAgent.indexOf('gecko') != -1) {
		this.btype = 'gecko';
		this.moz = true;
	}
}