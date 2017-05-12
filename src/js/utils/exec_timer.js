"use strict";
exports.__esModule = true;
var ExecTimer = (function () {
    function ExecTimer() {
        this.startTime = new Date();
    }
    ExecTimer.prototype.read = function () {
        return "Duration: " + this.getDeltaTime() + " ms";
    };
    ExecTimer.prototype.getDeltaTime = function () {
        return new Date().getTime() - this.startTime.getTime();
    };
    return ExecTimer;
}());
exports.ExecTimer = ExecTimer;
