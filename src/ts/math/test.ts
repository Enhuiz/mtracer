import { Matrix } from "./matrix";

// Test Matrix
((skip?: any) => {
    if (skip) return;

    let x: Matrix = new Matrix([[1, 0], [3, 4]]);
    let y: Matrix = new Matrix([[5, 6], [7, 8]]);

    console.log(x.add(y));
    console.log(x.subtract(y));
    console.log(x.multiply(y));
    console.log(x.matmul(y));
    console.log(y.transpose());
    console.log(Matrix.argmax(x, 0));
    console.log(Matrix.argmax(x, 1));

})(1);