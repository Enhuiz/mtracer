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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Matrix = (function () {
    function Matrix(arr) {
        this.shape = [arr.length, arr[0].length];
        for (var i = 0; i < this.shape[0]; ++i) {
            if (arr[i].length != this.shape[1]) {
                throw new Error("Invalid shape");
            }
        }
        this.content = new Array(this.shape[0] * this.shape[1]);
        for (var i = 0; i < this.shape[0]; ++i) {
            for (var j = 0; j < this.shape[1]; ++j) {
                this.set(i, j, arr[i][j]);
            }
        }
    }
    Matrix.create = function (shape, callback) {
        var arr = Matrix.createArray2D(shape, callback);
        return new Matrix(arr);
    };
    Matrix.eye = function (shape) {
        return Matrix.create(shape, function (index) { return index[0] === index[1] ? 1 : 0; });
    };
    Matrix.zeros = function (shape) {
        return Matrix.create(shape, function () { return 0; });
    };
    Matrix.ones = function (shape) {
        return Matrix.create(shape, function () { return 1; });
    };
    Matrix.full = function (shape, val) {
        return Matrix.create(shape, function () { return val; });
    };
    Matrix.random = function (shape, max, min) {
        return Matrix.create(shape, function () { return min + Math.random() * (max - min); });
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
            return Matrix.create([1, mat.shape[1]], function (index) {
                var ret = 0;
                for (var i = 1; i < mat.shape[0]; ++i) {
                    ret = mat.get(i, index[1]) > mat.get(ret, index[1]) ? i : ret;
                }
                return ret;
            });
        }
        else if (axis === 1) {
            return Matrix.create([mat.shape[0], 1], function (index) {
                var ret = 0;
                for (var j = 1; j < mat.shape[1]; ++j) {
                    ret = mat.get(index[0], j) > mat.get(index[0], ret) ? j : ret;
                }
                return ret;
            });
        }
        throw new Error("Axis should be either 0 or 1 but get " + axis);
    };
    Matrix.fillArray2D = function (shape, val) {
        if (val === void 0) { val = 0; }
        return Matrix.createArray2D(shape, function () { return val; });
    };
    Matrix.createArray2D = function (shape, callback) {
        var ret = new Array(shape[0]);
        for (var i = 0; i < shape[0]; ++i) {
            ret[i] = new Array(shape[1]);
            for (var j = 0; j < shape[1]; ++j) {
                ret[i][j] = callback ? callback([i, j]) : 0;
            }
        }
        return ret;
    };
    Matrix.prototype.map = function (callback) {
        var arr = Matrix.createArray2D(this.shape);
        for (var i = 0; i < this.shape[0]; ++i) {
            for (var j = 0; j < this.shape[1]; ++j) {
                arr[i][j] = callback(this.get(i, j), [i, j], this);
            }
        }
        return new Matrix(arr);
    };
    Matrix.prototype.clip = function (min, max) {
        return this.map(function (val) {
            return Math.max(Math.min(val, max), min);
        });
    };
    Matrix.prototype.add = function (other) {
        if (other instanceof Matrix) {
            return this.map(function (val, index, matrix) { return val + other.get(index); });
        }
        else {
            return this.map(function (val) { return val + other; });
        }
    };
    Matrix.prototype.subtract = function (other) {
        if (other instanceof Matrix) {
            return this.map(function (val, index, matrix) { return val - other.get(index); });
        }
        else {
            return this.map(function (val) { return val - other; });
        }
    };
    Matrix.prototype.multiply = function (other) {
        if (other instanceof Matrix) {
            return this.map(function (val, index, matrix) { return val * other.get(index); });
        }
        else {
            return this.map(function (val) { return val * other; });
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
        var ret = Matrix.zeros([this.shape[1], this.shape[0]]);
        return ret.map(function (val, index) {
            return _this.get(index[1], index[0]);
        });
    };
    Matrix.prototype.neg = function () {
        return this.map(function (val) {
            return -val;
        });
    };
    Matrix.prototype.get = function (i, j) {
        var offset;
        if (typeof i === 'number' && typeof j === 'number') {
            offset = i * this.shape[1] + j;
        }
        else {
            offset = i[0] * this.shape[1] + i[1];
        }
        if (offset >= this.content.length) {
            throw new Error("Index " + [i, j] + " out range");
        }
        return this.content[offset];
    };
    Matrix.prototype.row = function (n) {
        var _this = this;
        if (n < 0)
            n += this.shape[0];
        return Matrix.create([1, this.shape[1]], function (index) {
            return _this.get(n, index[1]);
        });
    };
    Matrix.prototype.col = function (n) {
        var _this = this;
        if (n < 0)
            n += this.shape[1];
        return Matrix.create([this.shape[0], 1], function (index) {
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
    Matrix.prototype.set = function (i, j, val) {
        this.content[i * this.shape[1] + j] = val;
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
var GaitTracer = (function (_super) {
    __extends(GaitTracer, _super);
    function GaitTracer(series_len, hidden_dim, output_dim) {
        var _this = _super.call(this, series_len, 3, hidden_dim, output_dim) || this;
        window.addEventListener('devicemotion', function (event) {
            if (event.acceleration) {
                _this.acceleration = [event.acceleration.x || 0, event.acceleration.y || 0, event.acceleration.z || 0];
            }
        });
        _this.eta = 0.3;
        _this.target = [];
        _this.output = [];
        return _this;
    }
    GaitTracer.prototype.run = function (deltaTime, callback) {
        var _this = this;
        setInterval(function () {
            _this.output = _super.prototype.tick.call(_this, _this.acceleration, _this.target, _this.eta);
            callback(_this.acceleration, _this.target, _this.output, _this.loss);
        }, deltaTime);
    };
    return GaitTracer;
}(tracer_1.Tracer));
exports.GaitTracer = GaitTracer;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gait_tracer_1 = __webpack_require__(1);
(function () {
    var cvs = document.getElementById('cvs');
    var ctx = cvs.getContext('2d');
    var WIDTH = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    var HEIGHT = WIDTH;
    var UNIT = WIDTH / 400;
    var RADIUS = 8 * UNIT;
    cvs.setAttribute('width', WIDTH.toString());
    cvs.setAttribute('height', HEIGHT.toString());
    function drawPoint(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, RADIUS, 0, 2 * Math.PI);
        ctx.fill();
    }
    ;
    function clear() {
        ctx.fillStyle = '#FFF731';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
    function getCanvasPos(cvs, e) {
        var rect = cvs.getBoundingClientRect();
        return [e.clientX - rect.left * (cvs.width / rect.width),
            e.clientY - rect.top * (cvs.height / rect.height)];
    }
    cvs.addEventListener("mouseup", function (e) {
        gt.target = [];
    });
    cvs.addEventListener("mousedown", function (e) {
        if (e.buttons > 0) {
            var _a = getCanvasPos(cvs, e), x = _a[0], y = _a[1];
            gt.target = [x / WIDTH, y / HEIGHT];
        }
    });
    cvs.addEventListener("mousemove", function (e) {
        if (e.buttons > 0) {
            var _a = getCanvasPos(cvs, e), x = _a[0], y = _a[1];
            gt.target = [x / WIDTH, y / HEIGHT];
        }
    });
    cvs.addEventListener("touchstart", function (e) {
        e.preventDefault();
        var _a = getCanvasPos(cvs, e.touches[0]), x = _a[0], y = _a[1];
        gt.target = [x / WIDTH, y / HEIGHT];
    });
    cvs.addEventListener("touchmove", function (e) {
        e.preventDefault();
        var _a = getCanvasPos(cvs, e.touches[0]), x = _a[0], y = _a[1];
        gt.target = [x / WIDTH, y / HEIGHT];
    });
    cvs.addEventListener("touchend", function (e) {
        e.preventDefault();
        gt.target = [];
    });
    var accelerationSpan = document.getElementById('acceleration');
    var targetSpan = document.getElementById('target');
    var outputSpan = document.getElementById('output');
    var lossSpan = document.getElementById('loss');
    var gt = new gait_tracer_1.GaitTracer(15, 25, 2);
    gt.eta = 1e-2;
    gt.run(40, function (acceleration, target, output, loss) {
        clear();
        if (acceleration.length > 0)
            accelerationSpan.innerHTML = acceleration.map(function (val) { return val.toFixed(2); }).join(', ');
        if (target.length > 0)
            targetSpan.innerHTML = target.map(function (val) { return val.toFixed(2); }).join(', ');
        if (output.length > 0)
            outputSpan.innerHTML = output.map(function (val) { return val.toFixed(2); }).join(', ');
        if (loss)
            lossSpan.innerHTML = loss.toFixed(2);
        if (target.length == 2) {
            ctx.fillStyle = '#c77800';
            drawPoint(target[0] * WIDTH, target[1] * HEIGHT);
        }
        if (output.length == 2) {
            ctx.fillStyle = '#00838f';
            drawPoint(output[0] * WIDTH, output[1] * HEIGHT);
        }
    });
    document.getElementById('reset-btn').onclick = function () { gt.reset(); };
})();


/***/ }),
/* 3 */
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
            states.setRow(t + 1, matrix_1.Matrix.tanh(inputs.row(t).matmul(this.Wih)
                .add(states.row(t).matmul(this.Whh))
                .add(this.bh)));
            outputs.setRow(t, states.row(t + 1).matmul(this.Who).add(this.bo));
            if (targets) {
                loss += matrix_1.Matrix.mean(matrix_1.Matrix.pow(outputs.row(t).subtract(targets.row(t)), 2));
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
        for (var t = inputs.shape[0] - 1; t >= Math.max(inputs.shape[0] - this.series_len, 0); --t) {
            var dout = outputs.row(t).subtract(targets.row(t)); // 1 * output_dim
            dWho = dWho.add(states.row(t + 1).transpose().matmul(dout)); // hidden_dim * output_dim
            dbo = dbo.add(dout); // 1 * output_dim
            var dh = dout.matmul(this.Who.transpose()).add(dhnext); // 1 * hidden_dim
            var dhraw = matrix_1.Matrix.tanh_d(states.row(t + 1)).multiply(dh); // 1 * hidden_dim 
            dbh = dbh.add(dhraw); // 1 * hidden_dim
            dWhh = dWhh.add(states.row(t).transpose().matmul(dhraw));
            dWih = dWih.add(inputs.row(t).transpose().matmul(dhraw));
            dhnext = dhraw.matmul(this.Whh.transpose());
        }
        this.Wih = this.Wih.subtract(dWih.clip(-2, 2).multiply(eta));
        this.Whh = this.Whh.subtract(dWhh.clip(-2, 2).multiply(eta));
        this.bh = this.bh.subtract(dbh.clip(-2, 2).multiply(eta));
        this.Who = this.Who.subtract(dWho.clip(-2, 2).multiply(eta));
        this.bo = this.bo.subtract(dbo.clip(-2, 2).multiply(eta));
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var matrix_1 = __webpack_require__(0);
var rnn_1 = __webpack_require__(3);
var Tracer = (function () {
    function Tracer(series_len, input_dim, hidden_dim, output_dim) {
        this.rnn = new rnn_1.RNN(series_len, input_dim, hidden_dim, output_dim);
        this.inputs_series = matrix_1.Matrix.fillArray2D([series_len, input_dim], 0);
        this.target_series = matrix_1.Matrix.fillArray2D([series_len, output_dim], 0);
        this.input_dim = input_dim;
        this.output_dim = output_dim;
    }
    Tracer.prototype.tick = function (input, target, eta) {
        if (input === void 0) { input = []; }
        if (target === void 0) { target = []; }
        if (eta === void 0) { eta = 0.3; }
        if (input.length === this.input_dim) {
            this.inputs_series.splice(0, 1);
            this.inputs_series.push(input);
            if (input && target.length === this.output_dim) {
                this.target_series.splice(0, 1);
                this.target_series.push(target);
                this.loss = this.rnn.train(new matrix_1.Matrix(this.inputs_series), new matrix_1.Matrix(this.target_series), eta);
            }
        }
        return this.rnn.predict(new matrix_1.Matrix(this.inputs_series)).row(-1).content;
    };
    Tracer.prototype.reset = function () {
        this.rnn.reset();
    };
    return Tracer;
}());
exports.Tracer = Tracer;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map