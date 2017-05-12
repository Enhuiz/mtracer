import { Matrix } from "../math/matrix";
import { RNN } from "../model/rnn";

export class Tracer {
    private rnn: RNN;
    private inputs_series: number[][];
    private target_series: number[][];

    private inputs_matrix: Matrix;
    private target_matrix: Matrix;

    protected input_dim: number;
    protected output_dim: number;
    protected loss: number;

    eta: number;

    constructor(series_len: number, input_dim: number, hidden_dim: number, output_dim: number) {
        this.rnn = new RNN(series_len, input_dim, hidden_dim, output_dim);

        this.inputs_matrix = new Matrix([series_len, input_dim]);
        this.target_matrix = new Matrix([series_len, output_dim]);

        this.inputs_series = this.inputs_matrix.toArray2D();
        this.target_series = this.target_matrix.toArray2D();

        this.input_dim = input_dim;
        this.output_dim = output_dim;
    }

    update(input: number[] = [], target: number[] = []) {
        if (input.length === this.input_dim) {
            this.inputs_series.shift();
            this.inputs_series.push(input);
            this.inputs_matrix = Matrix.createFromArray2D(this.inputs_series);
            if (input && target.length === this.output_dim) {
                this.target_series.shift();
                this.target_series.push(target);
                this.target_matrix = Matrix.createFromArray2D(this.target_series);
                this.loss = this.rnn.train(
                    this.inputs_matrix,
                    this.target_matrix,
                    this.eta);
            }
        }
        return this.rnn.predict(this.inputs_matrix).row(-1).content;
    }

    reset() {
        this.rnn.reset();
    }
}
