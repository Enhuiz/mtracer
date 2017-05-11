"use strict";
exports.__esModule = true;
var matrix_1 = require("./matrix");
var rnn_1 = require("./rnn");
var x = new matrix_1.Matrix([[1, 0], [3, 4]]);
var y = new matrix_1.Matrix([[5, 6], [7, 8]]);
console.log(x.add(y));
console.log(x.subtract(y));
console.log(x.multiply(y));
console.log(x.matmul(y));
console.log(y.transpose());
console.log(matrix_1.Matrix.argmax(x, 0));
console.log(matrix_1.Matrix.argmax(x, 1));
var input_dim = 5;
var hidden_dim = 10;
var output_dim = 5;
var seq_len = 3;
var inputs_series = (function () {
    var ret = matrix_1.Matrix.zeros([seq_len, input_dim]);
    for (var i = 0; i < seq_len; ++i) {
        ret.set(i, i % 10, 1);
    }
    return ret;
})();
var targets_series = (function () {
    var ret = matrix_1.Matrix.zeros([seq_len, output_dim]);
    for (var i = 0; i < seq_len; ++i) {
        ret.set(i, (i + 1) % 10, 1);
    }
    return ret;
})();
var test_inputs_series = (function () {
    var ret = matrix_1.Matrix.zeros([seq_len, input_dim]);
    for (var i = 0; i < seq_len; ++i) {
        ret.set(i, (i + 2) % 10, 1);
    }
    return ret;
})();
var rnn = new rnn_1.RNN(seq_len, input_dim, hidden_dim, output_dim);
console.log("training");
for (var i = 0; i < 10; ++i) {
    console.log(rnn.train(inputs_series, targets_series, 3e-2));
}
console.log("predicting");
var outputs_series = rnn.predict(test_inputs_series);
console.log(outputs_series.toString());
console.log(matrix_1.Matrix.argmax(outputs_series, 1).toString());
