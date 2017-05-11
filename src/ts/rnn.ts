import { Matrix } from "./matrix";

export class RNN {
    seq_len: number;
    input_dim: number;
    hidden_dim: number;
    output_dim: number;

    Wih: Matrix;
    Whh: Matrix;
    bh: Matrix;
    Who: Matrix;
    bo: Matrix;

    constructor(seq_len, input_dim, hidden_dim, output_dim) {
        this.seq_len = seq_len;
        this.input_dim = input_dim;
        this.hidden_dim = hidden_dim;
        this.output_dim = output_dim;

        // this.Wih = Matrix.zeros([input_dim, hidden_dim]);
        // this.Whh = Matrix.zeros([hidden_dim, hidden_dim]);
        this.Wih = Matrix.random([input_dim, hidden_dim], 0, 1);
        this.Whh = Matrix.random([hidden_dim, hidden_dim], 0, 1);
        this.bh = Matrix.zeros([1, hidden_dim]);

        this.Who = Matrix.random([hidden_dim, output_dim], 0, 1);
        this.bo = Matrix.zeros([1, output_dim]);
    }


    feedforward(inputs_series: Matrix, targets_series?: Matrix,
        prev_state: Matrix = Matrix.zeros([1, this.hidden_dim]))
        : [Matrix, Matrix, number] {

        let states_series: Matrix = Matrix.zeros([inputs_series.shape[0] + 1, this.hidden_dim]);
        let outputs_series: Matrix = Matrix.zeros([targets_series.shape[0], this.output_dim]);
        let loss = 0;

        for (let t = 0; t < inputs_series.shape[0]; ++t) {
            states_series.setRow(t,
                Matrix.tanh(
                    inputs_series[t].matmul(this.Wih)
                        .add(states_series[t].matmul(this.Whh))
                        .add(this.bh)
                ));

            outputs_series.setRow(t + 1, states_series[t].matmul(this.Who).add(this.bo));

            if (targets_series) {
                loss += Matrix.reduce_sum(Matrix.pow(
                    targets_series[t].subtract(outputs_series[t]),
                    2
                ));
            }
        }

        return [states_series, outputs_series, loss];
    }

    train(inputs_series: Matrix, targets_series: Matrix,
        eta: number = 0.3, prev_state: Matrix = Matrix.zeros([1, this.hidden_dim])): number {
        let [states_series, outputs_series, loss] = this.feedforward(inputs_series, targets_series, prev_state);

        // backward
        let dWih = Matrix.zeros([this.input_dim, this.hidden_dim]);
        let dWhh = Matrix.zeros([this.hidden_dim, this.hidden_dim]);
        let dbh = Matrix.zeros([1, this.hidden_dim]);

        let dWho = Matrix.zeros([this.hidden_dim, this.output_dim]);
        let dbo = Matrix.zeros([1, this.output_dim]);
        let dhnext = Matrix.zeros([1, this.hidden_dim]);

        for (let t = inputs_series.shape[0] - 1; t >= Math.max(inputs_series.shape[0] - this.seq_len, 0); --t) {
            let dout = targets_series.row(t).subtract(outputs_series.row(t)); // 1 * output_dim

            dWho = dWho.add(states_series.row(t + 1).transpose().matmul(dout)); // hidden_dim * output_dim
            dbo = dbo.add(dout); // 1 * output_dim

            let dh = dout.matmul(this.Who.transpose()).add(dhnext);  // 1 * hidden_dim
            let dhraw = Matrix.pow(states_series.row(t + 1), 2).neg().add(1).multiply(dh); // 1 * hidden_dim

            dbh = dbh.add(dhraw); // 1 * hidden_dim
            dWhh = dWhh.add(states_series.row(t).transpose().matmul(dhraw));
            dWih = dWih.add(inputs_series.row(t).transpose().matmul(states_series.row(t)));

            dhnext = this.Whh.matmul(dhraw);
        }

        this.Wih = this.Wih.add(dWih.multiply(-eta));
        this.Whh = this.Whh.add(dWhh.multiply(-eta));
        this.bh = this.bh.add(dbh.multiply(-eta));

        this.Who = this.Who.add(dWho.multiply(-eta));
        this.bo = this.bo.add(dbo.multiply(-eta));

        return loss;
    }

    predict(inputs_series : Matrix) : Matrix
    {
        let [states_series, outputs_series, loss] = this.feedforward(inputs_series);
        return outputs_series;
    }
};