"use strict";
exports.__esModule = true;
var matrix_1 = require("./matrix");
var RNN = (function () {
    function RNN(seq_len, input_dim, hidden_dim, output_dim) {
        this.seq_len = seq_len;
        this.input_dim = input_dim;
        this.hidden_dim = hidden_dim;
        this.output_dim = output_dim;
        // this.Wih = Matrix.zeros([input_dim, hidden_dim]);
        // this.Whh = Matrix.zeros([hidden_dim, hidden_dim]);
        this.Whi = matrix_1.Matrix.random([hidden_dim, input_dim], 0, 1);
        this.Whh = matrix_1.Matrix.random([hidden_dim, hidden_dim], 0, 1);
        this.bh = matrix_1.Matrix.zeros([hidden_dim, 1]);
        this.Woh = matrix_1.Matrix.random([output_dim, hidden_dim], 0, 1);
        this.bo = matrix_1.Matrix.zeros([output_dim, 1]);
    }
    RNN.prototype.lossFunc = function (inputs_series, targets_series, prev_state) {
        var states_series = [prev_state];
        var outputs_series = [];
        var loss = 0;
        // forward
        for (var t = 0; t < inputs_series.length; ++t) {
            states_series.push(matrix_1.Matrix.tanh(this.Whi.matmul(inputs_series[t])
                .add(this.Whh.matmul(states_series[t]))
                .add(this.bh)));
            outputs_series.push(this.Woh.matmul(states_series[t]).add(this.bo));
            loss += matrix_1.Matrix.reduce_sum(matrix_1.Matrix.pow(targets_series[t].subtract(outputs_series[t]), 2));
        }
        // backward
        var dWih = matrix_1.Matrix.zeros([this.input_dim, this.hidden_dim]);
        var dWhh = matrix_1.Matrix.zeros([this.hidden_dim, this.hidden_dim]);
        var dbh = matrix_1.Matrix.zeros([this.hidden_dim, 1]);
        var dWho = matrix_1.Matrix.zeros([this.hidden_dim, this.output_dim]);
        var dbo = matrix_1.Matrix.zeros([this.output_dim, 1]);
        var dhnext = matrix_1.Matrix.zeros([this.hidden_dim, 1]);
        for (var t = inputs_series.length - 1; t >= Math.max(inputs_series.length - this.seq_len, 0); --t) {
            var dout = targets_series[t].subtract(outputs_series[t]);
            dWho = dWho.add(states_series[t + 1].matmul(dout.transpose()));
            dbo = dbo.add(dout);
            var dh = this.Woh.transpose().matmul(dout).add(dhnext);
            var dhraw = matrix_1.Matrix.pow(states_series[t + 1], 2).neg().add(1).multiply(dh);
            // dbh = math.add(
            //     dbh,
            //     dhraw
            // );
            // dWih = math.add(
            //     dWih,
            //     math.multiply(
            //         inputs_series[t],
            //         math.resize(dhraw, []),
            //     )
            // )
        }
    };
    return RNN;
}());
;
var input_dim = 10;
var hidden_dim = 20;
var output_dim = 30;
var rnn = new RNN(10, input_dim, hidden_dim, output_dim);
rnn.lossFunc([matrix_1.Matrix.zeros([input_dim, 1])], [matrix_1.Matrix.zeros([output_dim, 1])], matrix_1.Matrix.zeros([hidden_dim, 1]));
