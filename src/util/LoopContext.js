function LoopContext() {
	var broken = false;

	this.break = function () {
		broken = true;
	};

	this.broken = function (){
		return broken;
	};

	this.reset = function () {
		broken = false;
	};
}