import { Matrix } from "./matrix";

let x: Matrix = new Matrix([[1, 2], [3, 4]]);
let y: Matrix = new Matrix([[5, 6], [7, 8]]);

console.log(x.add(y));
console.log(x.subtract(y));
console.log(x.multiply(y));
console.log(x.matmul(y));

console.log(y.transpose());