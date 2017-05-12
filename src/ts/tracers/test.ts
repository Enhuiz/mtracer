import { Tracer } from "./tracer";
import { Matrix } from "../math/matrix";
import { ExecTimer } from "../utils/exec_timer"

// test tracer
((skip?: any) => {
    if (skip) return;

    let input_dim = 10;
    let hidden_dim = 20;
    let output_dim = 10;
    let series_len = 1000;

    function series_start_at(series_len: number, input_dim: number, n: number): number[][] {
        let ret = Matrix.fillArray2D([series_len, input_dim]);
        for (let i = 0; i < series_len; ++i) {
            ret[i][(i + n) % 10] = 1;
        }
        return ret;
    }

    let inputs_series = series_start_at(series_len, input_dim, 0);
    let targets_series = series_start_at(series_len, input_dim, 3);
    let test_inputs_series = series_start_at(series_len, input_dim, 5);

    let etimer = new ExecTimer();

    let tracer = new Tracer(20, input_dim, hidden_dim, output_dim);

    for (let epoch = 0; epoch < 1; ++epoch) {
        for (let i = 0; i < series_len; ++i) {
            tracer.update(inputs_series[i], targets_series[i], 1e-2);
        }
    }

    for (let i = 0; i < series_len; ++i) {
        tracer.update(inputs_series[i]);
    }

    console.log(etimer.read());
})();