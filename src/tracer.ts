import { Matrix } from "./matrix";
import { RNN } from "./rnn";

export class Tracer {
    protected rnn: RNN;
    protected inputs_series: number[][];
    protected target_series: number[][];
    protected input_dim: number;
    protected output_dim: number;
    protected loss: number;

    constructor(series_len: number, input_dim: number, hidden_dim: number, output_dim: number) {
        this.rnn = new RNN(series_len, input_dim, hidden_dim, output_dim);
        this.inputs_series = Matrix.fillArray2D([series_len, input_dim], 0)
        this.target_series = Matrix.fillArray2D([series_len, output_dim], 0)

        this.input_dim = input_dim;
        this.output_dim = output_dim;
    }

    tick(input: number[] = [], target: number[] = [], eta: number = 0.3) {
        if (input.length === this.input_dim) {
            this.inputs_series.splice(0, 1);
            this.inputs_series.push(input);
            if (input && target.length === this.output_dim) {
                this.target_series.splice(0, 1);
                this.target_series.push(target);
                this.loss = this.rnn.train(new Matrix(this.inputs_series), new Matrix(this.target_series), eta);
            }
        }
        return this.rnn.predict(new Matrix(this.inputs_series)).row(-1).content;
    }

    reset() {
        this.rnn.reset();
    }
}
