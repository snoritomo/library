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
Function.prototype.applyTimeout = function (ms, self, args)
{
	var f = this;
	return setTimeout(
	function () {
		f.apply(self, args);
	},
	ms);
};

Function.prototype.callTimeout = function (ms, self)
{
	return this.applyTimeout(
		ms,
		self,
		Array.prototype.slice.call(arguments, 2));
};

Function.prototype.applyInterval = function (ms, self, args)
{
	var f = this;
	return setInterval(
		function () {
			f.apply(self, args);
		},
	ms);
};

Function.prototype.callInterval = function (ms, self)
{
	return this.applyInterval(
		ms,
		self,
		Array.prototype.slice.call(arguments, 2));
};
var raise_on_wheel_event_functions = [];
function addWheelEventHandler(f, arg){
	var obj = {};
	obj.fn = f;
	obj.arg = arg;
	raise_on_wheel_event_functions.push(obj);
}
function wheel(event){
	var delta = 0;
	if (!event) /* For IE. */
		event = window.event;
	if (event.wheelDelta) { /* IE/Opera. */
		delta = event.wheelDelta/120;
		if (window.opera)
			delta = -delta;
	} else if (event.detail) { /** Mozilla case. */
		delta = -event.detail/3;
	}
	/** If delta is nonzero, handle it.
	 * Basically, delta is now positive if wheel was scrolled up,
	 * and negative, if wheel was scrolled down.
	 */
	if (delta){
		for(var i = 0; i < raise_on_wheel_event_functions.length; i++){
			var f = raise_on_wheel_event_functions[i];
			if(f.fn == undefined)continue;
			f.fn(delta, event, f.arg);
		}
	}
	if (event.preventDefault) {
		event.preventDefault();
	}
	event.returnValue = false;
}
if(document.addEventListener){
	document.addEventListener("mousewheel", wheel, false);
	document.addEventListener('DOMMouseScroll', wheel, false);
}
else{
	window.onmousewheel = document.onmousewheel = wheel;
}
