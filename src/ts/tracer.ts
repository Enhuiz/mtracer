import { Matrix } from "./matrix";
import { RNN } from "./rnn";

export class Tracer {
    private rnn: RNN;
    private inputs_series: number[][];
    private target_series: number[][];

    constructor(seq_len, input_dim, hidden_dim, output_dim) {
        this.rnn = new RNN(seq_len, input_dim, hidden_dim, output_dim);
        this.inputs_series = Matrix.fillArray2D([seq_len, input_dim], 0)
        this.target_series = Matrix.fillArray2D([seq_len, output_dim], 0)
    }

    tick(input: number[], target:number[] = [], eta: number = 0.3) {
        this.inputs_series.splice(0, 1);
        this.target_series.splice(0, 1);
        this.inputs_series.push(input);
        this.target_series.push(target);
        if (input && target.length != 0) {
            console.log(this.rnn.train(new Matrix(this.inputs_series), new Matrix(this.target_series), eta));
        }
        return this.rnn.predict(new Matrix(this.inputs_series)).row(-1).content;
    }
}
