/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Matrix = (function () {
    function Matrix(shape, callback) {
        this.shape = shape;
        this.content = new Array(this.shape[0] * this.shape[1]);
        for (var i = 0; i < this.shape[0]; ++i) {
            for (var j = 0; j < this.shape[1]; ++j) {
                this.set(i, j, callback ? callback([i, j]) : 0);
            }
        }
    }
    Matrix.createFromArray2D = function (arr) {
        var shape = [arr.length, arr[0].length];
        for (var i = 0; i < shape[0]; ++i) {
            if (arr[i].length != shape[1]) {
                throw new Error("Invalid shape");
            }
        }
        return new Matrix(shape, function (index) { return arr[index[0]][index[1]]; });
    };
    Matrix.eye = function (shape) {
        return new Matrix(shape, function (index) { return index[0] === index[1] ? 1 : 0; });
    };
    Matrix.zeros = function (shape) {
        return new Matrix(shape);
    };
    Matrix.ones = function (shape) {
        return new Matrix(shape, function () { return 1; });
    };
    Matrix.full = function (shape, val) {
        return new Matrix(shape, function () { return val; });
    };
    Matrix.random = function (shape, max, min) {
        return new Matrix(shape, function () { return min + Math.random() * (max - min); });
    };
    Matrix.tanh = function (mat) {
        return mat.map(function (val) { return (Math.exp(val) - Math.exp(-val)) / (Math.exp(val) + Math.exp(-val)); });
    };
    Matrix.tanh_d = function (mat) {
        return Matrix.pow(Matrix.tanh(mat), 2).neg().add(1);
    };
    Matrix.sigmoid = function (mat) {
        return mat.map(function (val) { return 1 / (1 + Math.exp(-val)); });
    };
    Matrix.sigmoid_d = function (mat) {
        return Matrix.sigmoid(mat).multiply(Matrix.sigmoid(mat).neg().add(1));
    };
    Matrix.exp = function (mat) {
        return mat.map(function (val) { return Math.exp(val); });
    };
    Matrix.pow = function (mat, n) {
        return mat.map(function (val) { return Math.pow(val, n); });
    };
    Matrix.sum = function (mat, axis) {
        if (axis) {
            throw new Error("not implemented");
        }
        else {
            var sum = 0;
            for (var i = 0; i < mat.shape[0]; ++i) {
                for (var j = 0; j < mat.shape[1]; ++j) {
                    sum += mat.get(i, j);
                }
            }
            return sum;
        }
    };
    Matrix.mean = function (mat, axis) {
        if (axis) {
            throw new Error("not implemented");
        }
        else {
            var sum = 0;
            for (var i = 0; i < mat.shape[0]; ++i) {
                var subsum = 0;
                for (var j = 0; j < mat.shape[1]; ++j) {
                    subsum += mat.get(i, j);
                }
                sum += subsum / mat.shape[1];
            }
            return sum / mat.shape[1];
        }
    };
    Matrix.argmax = function (mat, axis) {
        if (axis === 0) {
            return new Matrix([1, mat.shape[1]], function (index) {
                var ret = 0;
                for (var i = 1; i < mat.shape[0]; ++i) {
                    ret = mat.get(i, index[1]) > mat.get(ret, index[1]) ? i : ret;
                }
                return ret;
            });
        }
        else if (axis === 1) {
            return new Matrix([mat.shape[0], 1], function (index) {
                var ret = 0;
                for (var j = 1; j < mat.shape[1]; ++j) {
                    ret = mat.get(index[0], j) > mat.get(index[0], ret) ? j : ret;
                }
                return ret;
            });
        }
        throw new Error("Axis should be either 0 or 1 but get " + axis);
    };
    Matrix.prototype.toArray2D = function () {
        var ret = new Array(this.shape[0]);
        for (var i = 0; i < this.shape[0]; ++i) {
            ret[i] = new Array(this.shape[1]);
            for (var j = 0; j < this.shape[1]; ++j) {
                ret[i][j] = this.get(i, j);
            }
        }
        return ret;
    };
    Matrix.prototype.map = function (callback) {
        var _this = this;
        return new Matrix(this.shape, function (index) {
            return callback(_this.get(index[0], index[1]), index, _this);
        });
    };
    Matrix.prototype.clip = function (min, max) {
        return this.map(function (val) {
            return Math.max(Math.min(val, max), min);
        });
    };
    Matrix.prototype.add = function (other) {
        if (other instanceof Matrix) {
            return this.map(function (val, index, matrix) { return val + other.get(index[0], index[1]); });
        }
        else {
            return this.map(function (val) { return val + other; });
        }
    };
    Matrix.prototype.foreach = function (callback) {
        for (var i = 0; i < this.shape[0]; ++i) {
            for (var j = 0; j < this.shape[1]; ++j) {
                callback(this.get(i, j), [i, j], this);
            }
        }
    };
    Matrix.prototype.addAssign = function (other) {
        if (other instanceof Matrix) {
            return this.foreach(function (val, index, matrix) { matrix.set(index[0], index[1], val + other.get(index[0], index[1])); });
        }
        else {
            return this.foreach(function (val, index, matrix) { matrix.set(index[0], index[1], val + other); });
        }
    };
    Matrix.prototype.subtract = function (other) {
        if (other instanceof Matrix) {
            return this.map(function (val, index, matrix) { return val - other.get(index[0], index[1]); });
        }
        else {
            return this.map(function (val) { return val - other; });
        }
    };
    Matrix.prototype.subtractAssign = function (other) {
        if (other instanceof Matrix) {
            return this.foreach(function (val, index, matrix) { matrix.set(index[0], index[1], val - other.get(index[0], index[1])); });
        }
        else {
            return this.foreach(function (val, index, matrix) { matrix.set(index[0], index[1], val - other); });
        }
    };
    Matrix.prototype.multiply = function (other) {
        if (other instanceof Matrix) {
            return this.map(function (val, index, matrix) { return val * other.get(index[0], index[1]); });
        }
        else {
            return this.map(function (val) { return val * other; });
        }
    };
    Matrix.prototype.multiplyAssign = function (other) {
        if (other instanceof Matrix) {
            return this.foreach(function (val, index, matrix) { matrix.set(index[0], index[1], val * other.get(index[0], index[1])); });
        }
        else {
            return this.foreach(function (val, index, matrix) { matrix.set(index[0], index[1], val * other); });
        }
    };
    Matrix.prototype.matmul = function (other) {
        if (this.shape[1] !== other.shape[0]) {
            throw new Error("Matrix mismatch between " + this.shape + " and " + other.shape);
        }
        var ret = Matrix.zeros([this.shape[0], other.shape[1]]);
        for (var i = 0; i < this.shape[0]; ++i) {
            for (var j = 0; j < other.shape[1]; ++j) {
                var el = 0;
                for (var k = 0; k < other.shape[0]; ++k) {
                    el += this.get(i, k) * other.get(k, j);
                }
                ret.set(i, j, el);
            }
        }
        return ret;
    };
    Matrix.prototype.transpose = function () {
        var _this = this;
        return new Matrix([this.shape[1], this.shape[0]], function (index) {
            return _this.get(index[1], index[0]);
        });
    };
    Matrix.prototype.neg = function () {
        return this.map(function (val) {
            return -val;
        });
    };
    Matrix.prototype.row = function (n) {
        var _this = this;
        if (n < 0)
            n += this.shape[0];
        return new Matrix([1, this.shape[1]], function (index) {
            return _this.get(n, index[1]);
        });
    };
    Matrix.prototype.col = function (n) {
        var _this = this;
        if (n < 0)
            n += this.shape[1];
        return new Matrix([this.shape[0], 1], function (index) {
            return _this.get(index[0], n);
        });
    };
    Matrix.prototype.slice = function (n, axis) {
        if (axis !== 0 && axis != 1) {
            throw new Error("Axis should be either 0 or 1" + n);
        }
        else if (axis === 0) {
            return this.row(n);
        }
        else {
            return this.col(n);
        }
    };
    Matrix.prototype.setRow = function (n, mat) {
        if (mat.shape[0] !== 1 || mat.shape[1] !== this.shape[1]) {
            throw new Error("Column mismatch between " + this.shape[1] + " and " + mat.shape[1]);
        }
        for (var j = 0; j < mat.shape[1]; ++j) {
            this.set(n, j, mat.get(0, j));
        }
    };
    Matrix.prototype.setCol = function (n, mat) {
        if (mat.shape[1] !== 1 || mat.shape[0] !== this.shape[0]) {
            throw new Error("Row mismatch between " + this.shape[0] + " and " + mat.shape[0]);
        }
        for (var i = 0; i < mat.shape[0]; ++i) {
            this.set(i, n, mat.get(i, 0));
        }
    };
    Matrix.prototype.get = function (i, j) {
        var offset = i * this.shape[1] + j;
        if (offset >= this.content.length) {
            throw new Error("Index " + [i, j] + " out range");
        }
        return this.content[offset];
    };
    Matrix.prototype.set = function (i, j, val) {
        var offset = i * this.shape[1] + j;
        if (offset >= this.content.length) {
            throw new Error("Index " + [i, j] + " out range");
        }
        this.content[offset] = val;
    };
    Matrix.prototype.toString = function () {
        var ret = '[\n';
        for (var i = 0; i < this.shape[0]; ++i) {
            ret += i === 0 ? '[' : '\n[';
            for (var j = 0; j < this.shape[1]; ++j) {
                if (j === 0) {
                    ret += this.get(i, j).toFixed(2);
                }
                else {
                    ret += ', ' + this.get(i, j).toFixed(2);
                }
            }
            ret += ']';
        }
        ret += '\n]';
        return ret;
    };
    return Matrix;
}());
exports.Matrix = Matrix;
;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var tracer_1 = __webpack_require__(4);
var MTracer = (function (_super) {
    __extends(MTracer, _super);
    function MTracer(series_len, hidden_dim) {
        var _this = _super.call(this, series_len, 6, hidden_dim, 2) || this;
        _this.accelerationEnabled = true;
        _this.orientationEnabled = true;
        window.addEventListener('devicemotion', function (event) {
            if (event.acceleration && _this.accelerationEnabled) {
                _this.acceleration = [event.acceleration.x || 0, event.acceleration.y || 0, event.acceleration.z || 0];
            }
            else {
                _this.acceleration = [];
            }
        });
        window.addEventListener('deviceorientation', function (event) {
            if (_this.orientationEnabled) {
                _this.orientation = [event.alpha / 360 || 0, event.beta / 360 || 0, event.gamma / 360 || 0];
            }
            else {
                _this.orientation = [];
            }
        });
        _this.acceleration = [];
        _this.orientation = [];
        _this.target = [];
        _this.output = [];
        _this.eta = 0.02;
        _this.framePerSecond = 60;
        return _this;
    }
    MTracer.prototype.run = function (callback) {
        var _this = this;
        setTimeout(function () { _this.frame(callback); }, 1000 / this.framePerSecond);
    };
    MTracer.prototype.frame = function (callback) {
        var _this = this;
        var input = []
            .concat(this.accelerationEnabled && this.acceleration.length > 0 ? this.acceleration : [0, 0, 0])
            .concat(this.orientationEnabled && this.orientation.length > 0 ? this.orientation : [0, 0, 0]);
        if (input.length === 6) {
            this.output = _super.prototype.update.call(this, input, this.target, this.eta);
        }
        if (callback) {
            callback(this.acceleration, this.orientation, this.target, this.output, this.loss);
        }
        setTimeout(function () { _this.frame(callback); }, 1000 / this.framePerSecond);
    };
    MTracer.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.target = [];
        this.output = [];
        this.loss = 0;
    };
    return MTracer;
}(tracer_1.Tracer));
exports.MTracer = MTracer;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var matrix_1 = __webpack_require__(0);
var RNN = (function () {
    function RNN(series_len, input_dim, hidden_dim, output_dim) {
        this.series_len = series_len;
        this.input_dim = input_dim;
        this.hidden_dim = hidden_dim;
        this.output_dim = output_dim;
        this.reset();
    }
    RNN.prototype.reset = function () {
        this.Wih = matrix_1.Matrix.random([this.input_dim, this.hidden_dim], -0.1, 0.1);
        this.Whh = matrix_1.Matrix.random([this.hidden_dim, this.hidden_dim], -0.1, 0.1);
        this.bh = matrix_1.Matrix.zeros([1, this.hidden_dim]);
        this.Who = matrix_1.Matrix.random([this.hidden_dim, this.output_dim], -0.1, 0.1);
        this.bo = matrix_1.Matrix.zeros([1, this.output_dim]);
    };
    RNN.prototype.feedforward = function (inputs, targets, prev_state) {
        if (prev_state === void 0) { prev_state = matrix_1.Matrix.zeros([1, this.hidden_dim]); }
        var states = matrix_1.Matrix.zeros([inputs.shape[0] + 1, this.hidden_dim]);
        var outputs = matrix_1.Matrix.zeros([inputs.shape[0], this.output_dim]);
        var loss = 0;
        states.setRow(0, prev_state);
        for (var t = 0; t < inputs.shape[0]; ++t) {
            var currentState = matrix_1.Matrix.tanh(inputs.row(t)
                .matmul(this.Wih)
                .add(states.row(t).matmul(this.Whh))
                .add(this.bh));
            states.setRow(t + 1, currentState);
            var currentOutput = currentState.matmul(this.Who).add(this.bo);
            outputs.setRow(t, currentOutput);
            if (targets) {
                loss += matrix_1.Matrix.mean(matrix_1.Matrix.pow(currentOutput.subtract(targets.row(t)), 2));
            }
        }
        return [states, outputs, loss];
    };
    RNN.prototype.train = function (inputs, targets, eta, prev_state) {
        if (eta === void 0) { eta = 0.3; }
        if (prev_state === void 0) { prev_state = matrix_1.Matrix.zeros([1, this.hidden_dim]); }
        if (inputs.shape[1] !== this.input_dim
            || targets.shape[1] !== this.output_dim
            || prev_state.shape[1] !== this.hidden_dim
            || inputs.shape[0] !== this.series_len
            || targets.shape[0] !== this.series_len) {
            throw new Error("Input mismatch");
        }
        var _a = this.feedforward(inputs, targets, prev_state), states = _a[0], outputs = _a[1], loss = _a[2];
        // backward
        var dWih = matrix_1.Matrix.zeros([this.input_dim, this.hidden_dim]);
        var dWhh = matrix_1.Matrix.zeros([this.hidden_dim, this.hidden_dim]);
        var dbh = matrix_1.Matrix.zeros([1, this.hidden_dim]);
        var dWho = matrix_1.Matrix.zeros([this.hidden_dim, this.output_dim]);
        var dbo = matrix_1.Matrix.zeros([1, this.output_dim]);
        var dhnext = matrix_1.Matrix.zeros([1, this.hidden_dim]);
        var douts = outputs.subtract(targets);
        for (var t = inputs.shape[0] - 1; t >= Math.max(inputs.shape[0] - this.series_len, 0); --t) {
            var dout = douts.row(t);
            var currentState = states.row(t + 1);
            dWho.addAssign(currentState.transpose().matmul(dout)); // hidden_dim * output_dim
            dbo.addAssign(dout); // 1 * output_dim
            var dh = dout.matmul(this.Who.transpose()).add(dhnext); // 1 * hidden_dim
            var dhraw = matrix_1.Matrix.tanh_d(currentState).multiply(dh); // 1 * hidden_dim 
            dbh.addAssign(dhraw); // 1 * hidden_dim
            dWhh.addAssign(states.row(t).transpose().matmul(dhraw));
            dWih.addAssign(inputs.row(t).transpose().matmul(dhraw));
            dhnext = dhraw.matmul(this.Whh.transpose());
        }
        this.Wih.subtractAssign(dWih.clip(-2, 2).multiply(eta));
        this.Whh.subtractAssign(dWhh.clip(-2, 2).multiply(eta));
        this.bh.subtractAssign(dbh.clip(-2, 2).multiply(eta));
        this.Who.subtractAssign(dWho.clip(-2, 2).multiply(eta));
        this.bo.subtractAssign(dbo.clip(-2, 2).multiply(eta));
        return loss;
    };
    RNN.prototype.predict = function (inputs) {
        if (inputs.shape[1] !== this.input_dim
            || inputs.shape[0] !== this.series_len) {
            throw new Error("Input mismatch");
        }
        var _a = this.feedforward(inputs), states = _a[0], outputs = _a[1], loss = _a[2];
        return outputs;
    };
    return RNN;
}());
exports.RNN = RNN;
;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mtracer_1 = __webpack_require__(1);
var cvs = document.getElementById('cvs');
var ctx = cvs.getContext('2d');
var horizantal = window.innerWidth > window.innerHeight;
var WIDTH = Math.min(window.innerWidth, window.innerHeight) * (horizantal ? 0.7 : 0.95);
var HEIGHT = WIDTH;
var UNIT = WIDTH / 400;
var RADIUS = 8 * UNIT;
var COLOR_CLEAR = '#ffff52';
var COLOR_USER = '#0000ca';
var COLOR_TRACER = '#c7009e';
cvs.setAttribute('width', WIDTH.toString());
cvs.setAttribute('height', HEIGHT.toString());
function drawPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, RADIUS, 0, 2 * Math.PI);
    ctx.fill();
}
;
function clear() {
    ctx.fillStyle = COLOR_CLEAR;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}
function getCanvasPos(cvs, e) {
    var rect = cvs.getBoundingClientRect();
    return [e.clientX - rect.left * (cvs.width / rect.width),
        e.clientY - rect.top * (cvs.height / rect.height)];
}
cvs.addEventListener("mouseup", function (e) {
    mt.target = [];
});
cvs.addEventListener("mousedown", function (e) {
    if (e.buttons > 0) {
        var _a = getCanvasPos(cvs, e), x = _a[0], y = _a[1];
        mt.target = [x / WIDTH, y / HEIGHT];
    }
});
cvs.addEventListener("mousemove", function (e) {
    if (e.buttons > 0) {
        var _a = getCanvasPos(cvs, e), x = _a[0], y = _a[1];
        mt.target = [x / WIDTH, y / HEIGHT];
    }
});
cvs.addEventListener("touchstart", function (e) {
    e.preventDefault();
    var _a = getCanvasPos(cvs, e.touches[0]), x = _a[0], y = _a[1];
    mt.target = [x / WIDTH, y / HEIGHT];
});
cvs.addEventListener("touchmove", function (e) {
    e.preventDefault();
    var _a = getCanvasPos(cvs, e.touches[0]), x = _a[0], y = _a[1];
    mt.target = [x / WIDTH, y / HEIGHT];
});
cvs.addEventListener("touchend", function (e) {
    e.preventDefault();
    mt.target = [];
});
var accelerationSpan = $('#acceleration-span');
var targetSpan = $('#target-span');
var outputSpan = $('#output-span');
var lossSpan = $('#loss-span');
var orientationSpan = $('#orientation-span');
var mt = new mtracer_1.MTracer(15, 30);
mt.run(function (acceleration, orientation, target, output, loss) {
    clear();
    accelerationSpan.text(acceleration.length > 0 ? acceleration.map(function (val) { return val.toFixed(2); }).join(', ') : '-');
    orientationSpan.text(orientation.length > 0 ? orientation.map(function (val) { return val.toFixed(2); }).join(', ') : '0');
    // targetSpan.text(target.length > 0 ? target.map(val => { return val.toFixed(2) }).join(', ') : '-');
    // outputSpan.text(output.length > 0 ? output.map(val => { return val.toFixed(2) }).join(', ') : '-');
    lossSpan.text(loss ? loss.toFixed(2) : '-');
    if (target.length === 2) {
        ctx.fillStyle = COLOR_USER;
        drawPoint(target[0] * WIDTH, target[1] * HEIGHT);
    }
    if (output.length === 2) {
        ctx.fillStyle = COLOR_TRACER;
        drawPoint(output[0] * WIDTH, output[1] * HEIGHT);
    }
});
$('#reset-btn').click(function () { mt.reset(); });
$('#setting-btn').click(function () {
    $('#settings').modal('show');
    $('#fps-span').text(mt.framePerSecond);
    $('#eta-span').text(mt.eta);
    $('#acc-span').text(mt.accelerationEnabled ? "On" : "Off");
    $('#ori-span').text(mt.orientationEnabled ? "On" : "Off");
    $('#toggle-acc-btn').html(mt.accelerationEnabled ? '<i  class="toggle on icon "></i>' : '<i  class="toggle off icon"></i>');
    $('#toggle-ori-btn').html(mt.orientationEnabled ? '<i  class="toggle on icon "></i>' : '<i  class="toggle off icon"></i>');
});
var monitor = $("#monitor");
var hideMonitorBtn = $('#hide-monitor-btn');
hideMonitorBtn.click(function () {
    if (monitor.is(":visible")) {
        monitor.hide(200);
        hideMonitorBtn.text("Show Monitor");
    }
    else {
        monitor.show(200);
        hideMonitorBtn.text("Hide Monitor");
    }
});
$('#go-back-btn').click(function () { $('#settings').modal('hide'); });
$('#add-fps-btn').click(function () {
    mt.framePerSecond += 1;
    if (mt.framePerSecond > 79) {
        $('#add-fps-btn').attr('disabled', 'disabled');
    }
    $('#fps-span').text(mt.framePerSecond);
    $('#subtract-fps-btn').removeAttr('disabled');
});
$('#subtract-fps-btn').click(function () {
    mt.framePerSecond -= 1;
    if (mt.framePerSecond < 31) {
        $('#subtract-fps-btn').attr('disabled', 'disabled');
    }
    $('#add-fps-btn').removeAttr('disabled');
    $('#fps-span').text(mt.framePerSecond);
});
$('#add-eta-btn').click(function () {
    mt.eta += 0.01;
    if (mt.eta > 0.09) {
        $('#add-eta-btn').attr('disabled', 'disabled');
    }
    $('#eta-span').text(mt.eta.toFixed(2));
    $('#subtract-eta-btn').removeAttr('disabled');
});
$('#subtract-eta-btn').click(function () {
    mt.eta -= 0.01;
    if (mt.eta < 0.02) {
        $('#subtract-eta-btn').attr('disabled', 'disabled');
    }
    $('#add-eta-btn').removeAttr('disabled');
    $('#eta-span').text(mt.eta.toFixed(2));
});
$('#toggle-acc-btn').click(function () {
    mt.accelerationEnabled = !mt.accelerationEnabled;
    $('#toggle-acc-btn').html(mt.accelerationEnabled ? '<i  class="toggle on icon "></i>' : '<i  class="toggle off icon"></i>');
    $('#acc-span').text(mt.accelerationEnabled ? "On" : "Off");
});
$('#toggle-ori-btn').click(function () {
    mt.orientationEnabled = !mt.orientationEnabled;
    $('#toggle-ori-btn').html(mt.orientationEnabled ? '<i  class="toggle on icon "></i>' : '<i  class="toggle off icon"></i>');
    $('#ori-span').text(mt.orientationEnabled ? "On" : "Off");
});


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var matrix_1 = __webpack_require__(0);
var rnn_1 = __webpack_require__(2);
var Tracer = (function () {
    function Tracer(series_len, input_dim, hidden_dim, output_dim) {
        this.rnn = new rnn_1.RNN(series_len, input_dim, hidden_dim, output_dim);
        this.inputs_matrix = new matrix_1.Matrix([series_len, input_dim]);
        this.target_matrix = new matrix_1.Matrix([series_len, output_dim]);
        this.inputs_series = this.inputs_matrix.toArray2D();
        this.target_series = this.target_matrix.toArray2D();
        this.input_dim = input_dim;
        this.output_dim = output_dim;
    }
    Tracer.prototype.update = function (input, target, eta) {
        if (input === void 0) { input = []; }
        if (target === void 0) { target = []; }
        if (eta === void 0) { eta = 0.3; }
        if (input.length === this.input_dim) {
            this.inputs_series.shift();
            this.inputs_series.push(input);
            this.inputs_matrix = matrix_1.Matrix.createFromArray2D(this.inputs_series);
            if (input && target.length === this.output_dim) {
                this.target_series.shift();
                this.target_series.push(target);
                this.target_matrix = matrix_1.Matrix.createFromArray2D(this.target_series);
                this.loss = this.rnn.train(this.inputs_matrix, this.target_matrix, eta);
            }
        }
        return this.rnn.predict(this.inputs_matrix).row(-1).content;
    };
    Tracer.prototype.reset = function () {
        this.rnn.reset();
    };
    return Tracer;
}());
exports.Tracer = Tracer;


/***/ })
/******/ ]);
//# sourceMappingURL=motion-tracer.js.map