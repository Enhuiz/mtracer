"use strict";
exports.__esModule = true;
var tracer_1 = require("./tracer");
var matrix_1 = require("../math/matrix");
var exec_timer_1 = require("../utils/exec_timer");
(function (skip) {
    if (skip)
        return;
    var input_dim = 10;
    var hidden_dim = 20;
    var output_dim = 10;
    var series_len = 1000;
    function series_start_at(series_len, input_dim, n) {
        var ret = matrix_1.Matrix.fillArray2D([series_len, input_dim]);
        for (var i = 0; i < series_len; ++i) {
            ret[i][(i + n) % 10] = 1;
        }
        return ret;
    }
    var inputs_series = series_start_at(series_len, input_dim, 0);
    var targets_series = series_start_at(series_len, input_dim, 3);
    var test_inputs_series = series_start_at(series_len, input_dim, 5);
    var etimer = new exec_timer_1.ExecTimer();
    var tracer = new tracer_1.Tracer(20, input_dim, hidden_dim, output_dim);
    for (var epoch = 0; epoch < 1; ++epoch) {
        for (var i = 0; i < series_len; ++i) {
            tracer.update(inputs_series[i], targets_series[i], 1e-2);
        }
    }
    for (var i = 0; i < series_len; ++i) {
        tracer.update(inputs_series[i]);
    }
    console.log(etimer.read());
})();
