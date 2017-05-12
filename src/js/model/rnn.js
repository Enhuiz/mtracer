"use strict";
exports.__esModule = true;
var matrix_1 = require("../math/matrix");
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
            dWho.addAssign(currentState.transpose().matmul(dout));
            dbo.addAssign(dout);
            var dh = dout.matmul(this.Who.transpose()).add(dhnext);
            var dhraw = matrix_1.Matrix.tanh_d(currentState).multiply(dh);
            dbh.addAssign(dhraw);
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
