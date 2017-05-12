"use strict";
exports.__esModule = true;
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
        var _this = this;
        return new Matrix(this.shape, function (index) {
            return callback(_this.get(index), index, _this);
        });
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
