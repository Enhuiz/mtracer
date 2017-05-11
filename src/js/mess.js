function f() {
    var a;
    return a.count();
}
;
var C = (function () {
    function C() {
    }
    C.prototype.count = function () {
    };
    return C;
}());
f();
