function LoopContext() {
    var stopped = false;

    this.stop = function () {
        stopped = true;
    };

    this.stopped = function () {
        return stopped;
    };

    this.reset = function () {
        stopped = false;
    };
}