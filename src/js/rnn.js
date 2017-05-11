"use strict";
exports.__esModule = true;
var matrix_1 = require("./matrix");
var RNN = (function () {
    function RNN(seq_len, input_dim, hidden_dim, output_dim) {
        this.seq_len = seq_len;
        this.input_dim = input_dim;
        this.hidden_dim = hidden_dim;
        this.output_dim = output_dim;
        this.Wih = matrix_1.Matrix.random([input_dim, hidden_dim], 0, 1);
        this.Whh = matrix_1.Matrix.random([hidden_dim, hidden_dim], 0, 1);
        this.bh = matrix_1.Matrix.zeros([1, hidden_dim]);
        this.Who = matrix_1.Matrix.random([hidden_dim, output_dim], 0, 1);
        this.bo = matrix_1.Matrix.zeros([1, output_dim]);
    }
    RNN.prototype.feedforward = function (inputs_series, targets_series, prev_state) {
        if (prev_state === void 0) { prev_state = matrix_1.Matrix.zeros([1, this.hidden_dim]); }
        var states_series = matrix_1.Matrix.zeros([inputs_series.shape[0] + 1, this.hidden_dim]);
        var outputs_series = matrix_1.Matrix.zeros([inputs_series.shape[0], this.output_dim]);
        var loss = 0;
        for (var t = 0; t < inputs_series.shape[0]; ++t) {
            states_series.setRow(t, matrix_1.Matrix.tanh(inputs_series.row(t).matmul(this.Wih)
                .add(states_series.row(t).matmul(this.Whh))
                .add(this.bh)));
            outputs_series.setRow(t + 1, states_series.row(t).matmul(this.Who).add(this.bo));
            if (targets_series) {
                loss += matrix_1.Matrix.sum(matrix_1.Matrix.pow(targets_series.row(t).subtract(outputs_series.row(t)), 2));
            }
        }
        return [states_series, outputs_series, loss];
    };
    RNN.prototype.train = function (inputs_series, targets_series, eta, prev_state) {
        if (eta === void 0) { eta = 0.3; }
        if (prev_state === void 0) { prev_state = matrix_1.Matrix.zeros([1, this.hidden_dim]); }
        if (inputs_series.shape[1] !== this.input_dim
            || targets_series.shape[1] !== this.output_dim
            || prev_state.shape[1] !== this.hidden_dim
            || inputs_series.shape[0] !== this.seq_len
            || targets_series.shape[0] !== this.seq_len) {
            throw new Error("Input mismatch");
        }
        var _a = this.feedforward(inputs_series, targets_series, prev_state), states_series = _a[0], outputs_series = _a[1], loss = _a[2];
        // backward
        var dWih = matrix_1.Matrix.zeros([this.input_dim, this.hidden_dim]);
        var dWhh = matrix_1.Matrix.zeros([this.hidden_dim, this.hidden_dim]);
        var dbh = matrix_1.Matrix.zeros([1, this.hidden_dim]);
        var dWho = matrix_1.Matrix.zeros([this.hidden_dim, this.output_dim]);
        var dbo = matrix_1.Matrix.zeros([1, this.output_dim]);
        var dhnext = matrix_1.Matrix.zeros([1, this.hidden_dim]);
        for (var t = inputs_series.shape[0] - 1; t >= Math.max(inputs_series.shape[0] - this.seq_len, 0); --t) {
            var dout = targets_series.row(t).subtract(outputs_series.row(t)); // 1 * output_dim
            dWho = dWho.add(states_series.row(t + 1).transpose().matmul(dout)); // hidden_dim * output_dim
            dbo = dbo.add(dout); // 1 * output_dim
            var dh = dout.matmul(this.Who.transpose()).add(dhnext); // 1 * hidden_dim
            var dhraw = matrix_1.Matrix.pow(states_series.row(t + 1), 2).neg().add(1).multiply(dh); // 1 * hidden_dim
            dbh = dbh.add(dhraw); // 1 * hidden_dim
            dWhh = dWhh.add(states_series.row(t).transpose().matmul(dhraw));
            dWih = dWih.add(inputs_series.row(t).transpose().matmul(states_series.row(t)));
            dhnext = dhraw.matmul(this.Whh.transpose());
        }
        this.Wih = this.Wih.add(dWih.multiply(-eta));
        this.Whh = this.Whh.add(dWhh.multiply(-eta));
        this.bh = this.bh.add(dbh.multiply(-eta));
        this.Who = this.Who.add(dWho.multiply(-eta));
        this.bo = this.bo.add(dbo.multiply(-eta));
        // console.log(this.Wih.toString());
        // console.log(this.Whh.toString());
        // console.log(this.bh.toString());
        // console.log(this.Who.toString());
        // console.log(this.bo.toString());
        return loss;
    };
    RNN.prototype.predict = function (inputs_series) {
        if (inputs_series.shape[1] !== this.input_dim
            || inputs_series.shape[0] !== this.seq_len) {
            throw new Error("Input mismatch");
        }
        var _a = this.feedforward(inputs_series), states_series = _a[0], outputs_series = _a[1], loss = _a[2];
        return outputs_series;
    };
    return RNN;
}());
exports.RNN = RNN;
;
