"use strict";
exports.__esModule = true;
var Matrix = (function () {
    function Matrix(arr) {
        this.shape = [arr.length, arr[0].length];
        for (var i = 0; i < this.shape[0]; ++i) {
            if (arr[i].length != this.shape[1]) {
                throw "Error: shape of mat invalid";
            }
        }
        this.content = new Array(this.shape[0] * this.shape[1]);
        for (var i = 0; i < this.shape[0]; ++i) {
            for (var j = 0; j < this.shape[1]; ++j) {
                this.set(i, j, arr[i][j]);
            }
        }
    }
    Matrix.create_matrix = function (shape, element_wise_setter) {
        var arr = new Array(shape[0]);
        for (var i = 0; i < arr.length; ++i) {
            arr[i] = new Array(shape[1]);
        }
        for (var i = 0; i < shape[0]; ++i) {
            for (var j = 0; j < shape[1]; ++j) {
                arr[i][j] = element_wise_setter([i, j]);
            }
        }
        return new Matrix(arr);
    };
    Matrix.eye = function (shape) {
        return Matrix.create_matrix(shape, function (index) { return index[0] == index[1] ? 1 : 0; });
    };
    Matrix.zeros = function (shape) {
        return Matrix.create_matrix(shape, function () { return 0; });
    };
    Matrix.ones = function (shape) {
        return Matrix.create_matrix(shape, function () { return 1; });
    };
    Matrix.full = function (shape, val) {
        return Matrix.create_matrix(shape, function () { return val; });
    };
    Matrix.random = function (shape, max, min) {
        return Matrix.create_matrix(shape, function () { return min + Math.random() * (max - min); });
    };
    Matrix.tanh = function (mat) {
        return mat.map(function (val) { return (Math.exp(val) - Math.exp(-val)) / (Math.exp(val) + Math.exp(-val)); });
    };
    Matrix.exp = function (mat) {
        return mat.map(function (val) { return Math.exp(val); });
    };
    Matrix.pow = function (mat, n) {
        return mat.map(function (val) { return Math.pow(val, n); });
    };
    Matrix.reduce_sum = function (mat) {
        var sum = 0;
        for (var i = 0; i < mat.shape[0]; ++i) {
            for (var j = 0; j < mat.shape[1]; ++j) {
                sum += mat.get(i, j);
            }
        }
        return sum;
    };
    Matrix.prototype.map = function (element_wise_setter, other) {
        var arr = new Array(this.shape[0]);
        for (var i = 0; i < arr.length; ++i) {
            arr[i] = new Array(this.shape[1]);
        }
        if (typeof other == 'number') {
            for (var i = 0; i < this.shape[0]; ++i) {
                for (var j = 0; j < this.shape[1]; ++j) {
                    arr[i][j] = element_wise_setter(this.get(i, j), other, [i, j], this);
                }
            }
        }
        else if (other instanceof Matrix) {
            for (var i = 0; i < this.shape[0]; ++i) {
                for (var j = 0; j < this.shape[1]; ++j) {
                    arr[i][j] = element_wise_setter(this.get(i, j), other.get(i, j), [i, j], this, other);
                }
            }
        }
        else {
            for (var i = 0; i < this.shape[0]; ++i) {
                for (var j = 0; j < this.shape[1]; ++j) {
                    arr[i][j] = element_wise_setter(this.get(i, j), [i, j], this);
                }
            }
        }
        return new Matrix(arr);
    };
    Matrix.prototype.add = function (other) {
        return this.map(function (x, y) { return x + y; }, other);
    };
    Matrix.prototype.subtract = function (other) {
        return this.map(function (x, y) { return x - y; }, other);
    };
    Matrix.prototype.multiply = function (other) {
        return this.map(function (x, y) { return x * y; }, other);
    };
    Matrix.prototype.matmul = function (other) {
        if (this.shape[1] !== other.shape[0]) {
            throw "Error: Matrix mismatch matmul";
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
    Matrix.prototype.get = function (i, j) {
        return this.content[i * this.shape[1] + j];
    };
    Matrix.prototype.set = function (i, j, val) {
        this.content[i * this.shape[1] + j] = val;
    };
    Matrix.prototype.transpose = function () {
        return this.map(function (val, index, matrix) {
            return matrix.get(index[1], index[0]);
        });
    };
    Matrix.prototype.neg = function () {
        return this.map(function (val) {
            return -val;
        });
    };
    return Matrix;
}());
exports.Matrix = Matrix;
;
