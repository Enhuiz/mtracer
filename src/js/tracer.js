"use strict";
exports.__esModule = true;
var matrix_1 = require("./matrix");
var rnn_1 = require("./rnn");
var Tracer = (function () {
    function Tracer(seq_len, input_dim, hidden_dim, output_dim) {
        this.rnn = new rnn_1.RNN(seq_len, input_dim, hidden_dim, output_dim);
        this.inputs_series = matrix_1.Matrix.fillArray2D([seq_len, input_dim], 0);
        this.target_series = matrix_1.Matrix.fillArray2D([seq_len, output_dim], 0);
    }
    Tracer.prototype.tick = function (input, target, eta) {
        if (target === void 0) { target = []; }
        if (eta === void 0) { eta = 0.3; }
        this.inputs_series.splice(0, 1);
        this.target_series.splice(0, 1);
        this.inputs_series.push(input);
        this.target_series.push(target);
        if (input && target.length != 0) {
            console.log(this.rnn.train(new matrix_1.Matrix(this.inputs_series), new matrix_1.Matrix(this.target_series), eta));
        }
        return this.rnn.predict(new matrix_1.Matrix(this.inputs_series)).row(-1).content;
    };
    return Tracer;
}());
exports.Tracer = Tracer;
