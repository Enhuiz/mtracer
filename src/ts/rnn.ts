import { Matrix } from "./matrix";

class RNN {
    seq_len: number;
    input_dim: number;
    hidden_dim: number;
    output_dim: number;

    Whi: Matrix;
    Whh: Matrix;
    bh: Matrix;
    Woh: Matrix;
    bo: Matrix;

    constructor(seq_len, input_dim, hidden_dim, output_dim) {
        this.seq_len = seq_len;
        this.input_dim = input_dim;
        this.hidden_dim = hidden_dim;
        this.output_dim = output_dim;

        // this.Wih = Matrix.zeros([input_dim, hidden_dim]);
        // this.Whh = Matrix.zeros([hidden_dim, hidden_dim]);
        this.Whi = Matrix.random([hidden_dim, input_dim], 0, 1);
        this.Whh = Matrix.random([hidden_dim, hidden_dim], 0, 1);
        this.bh = Matrix.zeros([hidden_dim, 1]);

        this.Woh = Matrix.random([output_dim, hidden_dim], 0, 1);
        this.bo = Matrix.zeros([output_dim, 1]);
    }

    lossFunc(inputs_series, targets_series, prev_state) {
        let states_series = [prev_state];
        let outputs_series = [];

        let loss = 0;

        // forward
        for (let t = 0; t < inputs_series.length; ++t) {
            states_series.push(Matrix.tanh(
                this.Whi.matmul(inputs_series[t])
                    .add(this.Whh.matmul(states_series[t]))
                    .add(this.bh)
            ));

            outputs_series.push(this.Woh.matmul(states_series[t]).add(this.bo));

            // reduce_sum((targets_series[t] - outputs_series[t]) ** 2)
            loss += Matrix.reduce_sum(Matrix.pow(
                targets_series[t].subtract(outputs_series[t]),
                2
            ));
        }

        // backward
        let dWih = Matrix.zeros([this.input_dim, this.hidden_dim]);
        let dWhh = Matrix.zeros([this.hidden_dim, this.hidden_dim]);
        let dbh = Matrix.zeros([this.hidden_dim, 1]);

        let dWho = Matrix.zeros([this.hidden_dim, this.output_dim]);
        let dbo = Matrix.zeros([this.output_dim, 1]);
        let dhnext = Matrix.zeros([this.hidden_dim, 1]);

        for (let t = inputs_series.length - 1; t >= Math.max(inputs_series.length - this.seq_len, 0); --t) {
            let dout = targets_series[t].subtract(outputs_series[t]);

            dWho = dWho.add(states_series[t+1].matmul(dout.transpose()));
          
            dbo = dbo.add(dout);

            let dh = this.Woh.transpose().matmul(dout).add(dhnext);

            // let dhraw = 

            // let dhraw = this.element_multiply(
            //     math.subtract(
            //         1,
            //         this.pow(
            //             states_series[t],
            //             2)
            //     ),
            //     dh
            // );

            // dbh = math.add(
            //     dbh,
            //     dhraw
            // );

            // dWih = math.add(
            //     dWih,
            //     math.multiply(
            //         inputs_series[t],
            //         math.resize(dhraw, []),
            //     )
            // )
        }
    }



};

let input_dim = 10
let hidden_dim = 20
let output_dim = 30

let rnn = new RNN(10, input_dim, hidden_dim, output_dim);
rnn.lossFunc(
    [Matrix.zeros([input_dim, 1])],
    [Matrix.zeros([output_dim, 1])],
    Matrix.zeros([hidden_dim, 1])
);