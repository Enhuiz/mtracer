import { RNN } from "./rnn";
import {Matrix} from "../math/matrix";

// RNN
((skip?: any) => {
    if (skip) return;

    let input_dim = 10;
    let hidden_dim = 10;
    let output_dim = 10;
    let series_len = 100;

    function series_start_at(series_len: number, input_dim: number, n: number): Matrix {
        let ret = Matrix.zeros([series_len, input_dim]);
        for (let i = 0; i < series_len; ++i) {
            ret.set(i, (i + n) % 10, 1);
        }
        return ret;
    }

    let inputs_series = series_start_at(series_len, input_dim, 0);
    let targets_series = series_start_at(series_len, input_dim, 3);
    let test_inputs_series = series_start_at(series_len, input_dim, 5);

    let rnn = new RNN(series_len, input_dim, hidden_dim, output_dim);
    console.log("\ntraining");
    for (let i = 0; i < 100; ++i) {
        console.log(rnn.train(
            inputs_series,
            targets_series,
            1e-3
        ));
    }
    console.log("\npredicting");
    let outputs_series = rnn.predict(test_inputs_series);
    console.log(Matrix.argmax(test_inputs_series, 1).content.join(', '));
    console.log(Matrix.argmax(outputs_series, 1).content.join(', '));
})(1);

