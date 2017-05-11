"use strict";
exports.__esModule = true;
var matrix_1 = require("./matrix");
var rnn_1 = require("./rnn");
var tracer_1 = require("./tracer");
// Test Matrix
(function (skip) {
    if (skip)
        return;
    var x = new matrix_1.Matrix([[1, 0], [3, 4]]);
    var y = new matrix_1.Matrix([[5, 6], [7, 8]]);
    console.log(x.add(y));
    console.log(x.subtract(y));
    console.log(x.multiply(y));
    console.log(x.matmul(y));
    console.log(y.transpose());
    console.log(matrix_1.Matrix.argmax(x, 0));
    console.log(matrix_1.Matrix.argmax(x, 1));
})(1);
// RNN
(function (skip) {
    if (skip)
        return;
    var input_dim = 10;
    var hidden_dim = 10;
    var output_dim = 10;
    var seq_len = 100;
    function series_start_at(seq_len, input_dim, n) {
        var ret = matrix_1.Matrix.zeros([seq_len, input_dim]);
        for (var i = 0; i < seq_len; ++i) {
            ret.set(i, (i + n) % 10, 1);
        }
        return ret;
    }
    var inputs_series = series_start_at(seq_len, input_dim, 0);
    var targets_series = series_start_at(seq_len, input_dim, 3);
    var test_inputs_series = series_start_at(seq_len, input_dim, 5);
    var rnn = new rnn_1.RNN(seq_len, input_dim, hidden_dim, output_dim);
    console.log("\ntraining");
    for (var i = 0; i < 100; ++i) {
        console.log(rnn.train(inputs_series, targets_series, 1e-3));
    }
    console.log("\npredicting");
    var outputs_series = rnn.predict(test_inputs_series);
    console.log(matrix_1.Matrix.argmax(test_inputs_series, 1).content.join(', '));
    console.log(matrix_1.Matrix.argmax(outputs_series, 1).content.join(', '));
})(1);
// RNN
(function (skip) {
    if (skip)
        return;
    var input_dim = 10;
    var hidden_dim = 20;
    var output_dim = 10;
    var seq_len = 1000;
    function series_start_at(seq_len, input_dim, n) {
        var ret = matrix_1.Matrix.fillArray2D([seq_len, input_dim]);
        for (var i = 0; i < seq_len; ++i) {
            ret[i][(i + n) % 10] = 1;
        }
        return ret;
    }
    var inputs_series = series_start_at(seq_len, input_dim, 0);
    var targets_series = series_start_at(seq_len, input_dim, 3);
    var test_inputs_series = series_start_at(seq_len, input_dim, 5);
    var tracer = new tracer_1.Tracer(20, input_dim, hidden_dim, output_dim);
    for (var epoch = 0; epoch < 1; ++epoch)
        for (var i = 0; i < seq_len; ++i) {
            tracer.tick(inputs_series[i], targets_series[i], 1e-2);
        }
    for (var i = 0; i < seq_len; ++i) {
        console.log(tracer.tick(inputs_series[i]));
    }
})();
