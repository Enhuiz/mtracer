import { Matrix } from "./matrix";

export class RNN {
    private seq_len: number;
    private input_dim: number;
    private hidden_dim: number;
    private output_dim: number;

    private Wih: Matrix;
    private Whh: Matrix;
    private bh: Matrix;
    private Who: Matrix;
    private bo: Matrix;

    constructor(seq_len, input_dim, hidden_dim, output_dim) {
        this.seq_len = seq_len;
        this.input_dim = input_dim;
        this.hidden_dim = hidden_dim;
        this.output_dim = output_dim;

        this.Wih = Matrix.random([input_dim, hidden_dim], -0.1, 0.1);
        this.Whh = Matrix.random([hidden_dim, hidden_dim], -0.1, 0.1);
        this.bh = Matrix.zeros([1, hidden_dim]);

        this.Who = Matrix.random([hidden_dim, output_dim], -0.1, 0.1);
        this.bo = Matrix.zeros([1, output_dim]);
    }


    private feedforward(inputs: Matrix, targets?: Matrix,
        prev_state: Matrix = Matrix.zeros([1, this.hidden_dim])): [Matrix, Matrix, number] {

        let states: Matrix = Matrix.zeros([inputs.shape[0] + 1, this.hidden_dim]);
        let outputs: Matrix = Matrix.zeros([inputs.shape[0], this.output_dim]);
        let loss = 0;

        states.setRow(0, prev_state);

        for (let t = 0; t < inputs.shape[0]; ++t) {
            states.setRow(t + 1,
                Matrix.tanh(
                    inputs.row(t).matmul(this.Wih)
                        .add(states.row(t).matmul(this.Whh))
                        .add(this.bh)
                ));

            outputs.setRow(t, states.row(t + 1).matmul(this.Who).add(this.bo));

            if (targets) {
                loss += Matrix.mean(Matrix.pow(
                    outputs.row(t).subtract(targets.row(t)),
                    2
                ));
            }
        }
        return [states, outputs, loss];
    }

    train(inputs: Matrix, targets: Matrix,
        eta: number = 0.3, prev_state: Matrix = Matrix.zeros([1, this.hidden_dim])): number {
        if (inputs.shape[1] !== this.input_dim
            || targets.shape[1] !== this.output_dim
            || prev_state.shape[1] !== this.hidden_dim
            || inputs.shape[0] !== this.seq_len
            || targets.shape[0] !== this.seq_len) {
            throw new Error("Input mismatch");
        }

        let [states, outputs, loss] = this.feedforward(inputs, targets, prev_state);

        // backward
        let dWih = Matrix.zeros([this.input_dim, this.hidden_dim]);
        let dWhh = Matrix.zeros([this.hidden_dim, this.hidden_dim]);
        let dbh = Matrix.zeros([1, this.hidden_dim]);

        let dWho = Matrix.zeros([this.hidden_dim, this.output_dim]);
        let dbo = Matrix.zeros([1, this.output_dim]);
        let dhnext = Matrix.zeros([1, this.hidden_dim]);

        for (let t = inputs.shape[0] - 1; t >= Math.max(inputs.shape[0] - this.seq_len, 0); --t) {
            let dout = outputs.row(t).subtract(targets.row(t)); // 1 * output_dim

            dWho = dWho.add(states.row(t + 1).transpose().matmul(dout)); // hidden_dim * output_dim
            dbo = dbo.add(dout); // 1 * output_dim

            let dh = dout.matmul(this.Who.transpose()).add(dhnext);  // 1 * hidden_dim

            let dhraw = Matrix.tanh_d(states.row(t + 1)).multiply(dh); // 1 * hidden_dim 

            dbh = dbh.add(dhraw); // 1 * hidden_dim
            dWhh = dWhh.add(states.row(t).transpose().matmul(dhraw));
            dWih = dWih.add(inputs.row(t).transpose().matmul(dhraw));

            dhnext = dhraw.matmul(this.Whh.transpose());

            if (isNaN(dhnext.get(0, 0))) throw Error("Nan appear when training");
        }

        this.Wih = this.Wih.subtract(dWih.clip(-3, 3).multiply(eta));
        this.Whh = this.Whh.subtract(dWhh.clip(-3, 3).multiply(eta));
        this.bh = this.bh.subtract(dbh.clip(-3, 3).multiply(eta));

        this.Who = this.Who.subtract(dWho.clip(-3, 3).multiply(eta));
        this.bo = this.bo.subtract(dbo.clip(-3, 3).multiply(eta));

        return loss;
    }

    predict(inputs: Matrix): Matrix {
        if (inputs.shape[1] !== this.input_dim
            || inputs.shape[0] !== this.seq_len) {
            throw new Error("Input mismatch");
        }

        let [states, outputs, loss] = this.feedforward(inputs);
        return outputs;
    }
};