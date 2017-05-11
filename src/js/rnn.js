"use strict";
exports.__esModule = true;
var matrix_1 = require("./matrix");
var RNN = (function () {
    function RNN(seq_len, input_dim, hidden_dim, output_dim) {
        this.seq_len = seq_len;
        this.input_dim = input_dim;
        this.hidden_dim = hidden_dim;
        this.output_dim = output_dim;
        this.Wih = matrix_1.Matrix.random([input_dim, hidden_dim], -0.1, 0.1);
        this.Whh = matrix_1.Matrix.random([hidden_dim, hidden_dim], -0.1, 0.1);
        this.bh = matrix_1.Matrix.zeros([1, hidden_dim]);
        this.Who = matrix_1.Matrix.random([hidden_dim, output_dim], -0.1, 0.1);
        this.bo = matrix_1.Matrix.zeros([1, output_dim]);
    }
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
            || inputs.shape[0] !== this.seq_len
            || targets.shape[0] !== this.seq_len) {
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
        for (var t = inputs.shape[0] - 1; t >= Math.max(inputs.shape[0] - this.seq_len, 0); --t) {
            var dout = outputs.row(t).subtract(targets.row(t)); // 1 * output_dim
            dWho = dWho.add(states.row(t + 1).transpose().matmul(dout)); // hidden_dim * output_dim
            dbo = dbo.add(dout); // 1 * output_dim
            var dh = dout.matmul(this.Who.transpose()).add(dhnext); // 1 * hidden_dim
            var dhraw = matrix_1.Matrix.tanh_d(states.row(t + 1)).multiply(dh); // 1 * hidden_dim 
            dbh = dbh.add(dhraw); // 1 * hidden_dim
            dWhh = dWhh.add(states.row(t).transpose().matmul(dhraw));
            dWih = dWih.add(inputs.row(t).transpose().matmul(dhraw));
            dhnext = dhraw.matmul(this.Whh.transpose());
            if (isNaN(dhnext.get(0, 0)))
                throw Error("Nan appear when training");
        }
        this.Wih = this.Wih.subtract(dWih.clip(-3, 3).multiply(eta));
        this.Whh = this.Whh.subtract(dWhh.clip(-3, 3).multiply(eta));
        this.bh = this.bh.subtract(dbh.clip(-3, 3).multiply(eta));
        this.Who = this.Who.subtract(dWho.clip(-3, 3).multiply(eta));
        this.bo = this.bo.subtract(dbo.clip(-3, 3).multiply(eta));
        return loss;
    };
    RNN.prototype.predict = function (inputs) {
        if (inputs.shape[1] !== this.input_dim
            || inputs.shape[0] !== this.seq_len) {
            throw new Error("Input mismatch");
        }
        var _a = this.feedforward(inputs), states = _a[0], outputs = _a[1], loss = _a[2];
        return outputs;
    };
    return RNN;
}());
exports.RNN = RNN;
;
