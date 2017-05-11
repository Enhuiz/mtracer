import { Matrix } from "./matrix";
import { RNN } from "./rnn";

let x: Matrix = new Matrix([[1, 2], [3, 4]]);
let y: Matrix = new Matrix([[5, 6], [7, 8]]);

console.log(x.add(y));
console.log(x.subtract(y));
console.log(x.multiply(y));
console.log(x.matmul(y));
console.log(y.transpose());


let input_dim = 10
let hidden_dim = 20
let output_dim = 30

let rnn = new RNN(10, input_dim, hidden_dim, output_dim);
rnn.train(
    [Matrix.zeros([1, input_dim])],
    [Matrix.zeros([1, output_dim])],
    0.3
);