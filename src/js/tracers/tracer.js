"use strict";
exports.__esModule = true;
var matrix_1 = require("../math/matrix");
var rnn_1 = require("../model/rnn");
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
