export class Matrix {
    readonly content: number[];
    readonly shape: [number, number];

    constructor(shape: [number, number], callback?: (index: [number, number]) => number) {
        this.shape = shape;

        this.content = new Array(this.shape[0] * this.shape[1]);
        for (let i = 0; i < this.shape[0]; ++i) {
            for (let j = 0; j < this.shape[1]; ++j) {
                this.set(i, j, callback ? callback([i, j]) : 0);
            }
        }
    }

    static createFromArray2D(arr: number[][]) {
        let shape: [number, number] = [arr.length, arr[0].length];
        for (let i = 0; i < shape[0]; ++i) {
            if (arr[i].length != shape[1]) {
                throw new Error("Invalid shape");
            }
        }
        return new Matrix(shape, index => { return arr[index[0]][index[1]]; });
    }

    static eye(shape: [number, number]): Matrix {
        return new Matrix(shape, index => { return index[0] === index[1] ? 1 : 0; });
    }

    static zeros(shape: [number, number]): Matrix {
        return new Matrix(shape);
    }

    static ones(shape: [number, number]): Matrix {
        return new Matrix(shape, () => { return 1; });
    }

    static full(shape: [number, number], val: number): Matrix {
        return new Matrix(shape, () => { return val; });
    }

    static random(shape: [number, number], max: number, min: number): Matrix {
        return new Matrix(shape, () => { return min + Math.random() * (max - min); })
    }

    static tanh(mat: Matrix): Matrix {
        return mat.map((val) => { return (Math.exp(val) - Math.exp(-val)) / (Math.exp(val) + Math.exp(-val)); });
    }

    static tanh_d(mat: Matrix): Matrix {
        return Matrix.pow(Matrix.tanh(mat), 2).neg().add(1);
    }

    static sigmoid(mat: Matrix): Matrix {
        return mat.map((val) => { return 1 / (1 + Math.exp(-val)); });
    }

    static sigmoid_d(mat: Matrix): Matrix {
        return Matrix.sigmoid(mat).multiply(Matrix.sigmoid(mat).neg().add(1));
    }

    static exp(mat: Matrix): Matrix {
        return mat.map((val) => { return Math.exp(val); });
    }

    static pow(mat: Matrix, n: number): Matrix {
        return mat.map((val) => { return Math.pow(val, n); });
    }

    static sum(mat: Matrix, axis?: number): number {
        if (axis) {
            throw new Error("not implemented");
        } else {
            let sum = 0;
            for (let i = 0; i < mat.shape[0]; ++i) {
                for (let j = 0; j < mat.shape[1]; ++j) {
                    sum += mat.get(i, j);
                }
            }
            return sum;
        }
    }

    static mean(mat: Matrix, axis?: number): number {
        if (axis) {
            throw new Error("not implemented");
        } else {
            let sum = 0;
            for (let i = 0; i < mat.shape[0]; ++i) {
                let subsum = 0;
                for (let j = 0; j < mat.shape[1]; ++j) {
                    subsum += mat.get(i, j);
                }
                sum += subsum / mat.shape[1];
            }
            return sum / mat.shape[1];
        }
    }

    static argmax(mat: Matrix, axis: number): Matrix {
        if (axis === 0) {
            return new Matrix([1, mat.shape[1]], index => {
                let ret = 0;
                for (let i = 1; i < mat.shape[0]; ++i) { // for each row
                    ret = mat.get(i, index[1]) > mat.get(ret, index[1]) ? i : ret;
                }
                return ret;
            });
        } else if (axis === 1) {
            return new Matrix([mat.shape[0], 1], index => {
                let ret = 0;
                for (let j = 1; j < mat.shape[1]; ++j) { // for each col
                    ret = mat.get(index[0], j) > mat.get(index[0], ret) ? j : ret;
                }
                return ret;
            });
        }
        throw new Error("Axis should be either 0 or 1 but get " + axis);
    }

    toArray2D(): number[][] {
        let ret = new Array(this.shape[0]);
        for (let i = 0; i < this.shape[0]; ++i) {
            ret[i] = new Array(this.shape[1]);
            for (let j = 0; j < this.shape[1]; ++j) {
                ret[i][j] = this.get(i, j);
            }
        }
        return ret;
    }

    map(callback: (val: number, index: [number, number], matrix: Matrix) => number): Matrix {
        return new Matrix(this.shape, index => {
            return callback(this.get(index[0], index[1]), index, this);
        });
    }

    clip(min: number, max: number): Matrix {
        return this.map(val => {
            return Math.max(Math.min(val, max), min);
        })
    }

    add(other: Matrix | number): Matrix {
        if (other instanceof Matrix) {
            return this.map((val, index, matrix) => { return val + other.get(index[0], index[1]); })
        } else {
            return this.map((val) => { return val + other; })
        }
    }

    foreach(callback: (val: number, index: [number, number], matrix: Matrix) => void): void {
        for (let i = 0; i < this.shape[0]; ++i) {
            for (let j = 0; j < this.shape[1]; ++j) {
                callback(this.get(i, j), [i, j], this);
            }
        }
    }

    addAssign(other: Matrix | number): void {
        if (other instanceof Matrix) {
            return this.foreach((val, index, matrix) => { matrix.set(index[0], index[1], val + other.get(index[0], index[1])); })
        } else {
            return this.foreach((val, index, matrix) => { matrix.set(index[0], index[1], val + other); })
        }
    }

    subtract(other: Matrix | number): Matrix {
        if (other instanceof Matrix) {
            return this.map((val, index, matrix) => { return val - other.get(index[0], index[1]); })
        } else {
            return this.map((val) => { return val - other; })
        }
    }


    subtractAssign(other: Matrix | number): void {
        if (other instanceof Matrix) {
            return this.foreach((val, index, matrix) => { matrix.set(index[0], index[1], val - other.get(index[0], index[1])); })
        } else {
            return this.foreach((val, index, matrix) => { matrix.set(index[0], index[1], val - other); })
        }
    }


    multiply(other: Matrix | number): Matrix {
        if (other instanceof Matrix) {
            return this.map((val, index, matrix) => { return val * other.get(index[0], index[1]); })
        } else {
            return this.map((val) => { return val * other; })
        }
    }

    multiplyAssign(other: Matrix | number): void {
        if (other instanceof Matrix) {
            return this.foreach((val, index, matrix) => { matrix.set(index[0], index[1], val * other.get(index[0], index[1])); })
        } else {
            return this.foreach((val, index, matrix) => { matrix.set(index[0], index[1], val * other); })
        }
    }


    matmul(other: Matrix): Matrix {
        if (this.shape[1] !== other.shape[0]) {
            throw new Error("Matrix mismatch between " + this.shape + " and " + other.shape);
        }
        let ret: Matrix = Matrix.zeros([this.shape[0], other.shape[1]]);
        for (let i = 0; i < this.shape[0]; ++i) {
            for (let j = 0; j < other.shape[1]; ++j) {
                let el: number = 0;
                for (let k = 0; k < other.shape[0]; ++k) {
                    el += this.get(i, k) * other.get(k, j);
                }
                ret.set(i, j, el);
            }
        }
        return ret;
    }

    transpose(): Matrix {
        return new Matrix([this.shape[1], this.shape[0]], index => {
            return this.get(index[1], index[0]);
        });
    }

    neg(): Matrix {
        return this.map((val) => {
            return -val;
        });
    }

    row(n: number): Matrix {
        if (n < 0) n += this.shape[0];
        return new Matrix([1, this.shape[1]], index => {
            return this.get(n, index[1]);
        });
    }

    col(n: number): Matrix {
        if (n < 0) n += this.shape[1];
        return new Matrix([this.shape[0], 1], index => {
            return this.get(index[0], n);
        });
    }

    slice(n: number, axis: number) {
        if (axis !== 0 && axis != 1) {
            throw new Error("Axis should be either 0 or 1" + n);
        } else if (axis === 0) {
            return this.row(n);
        } else {
            return this.col(n);
        }
    }

    setRow(n: number, mat: Matrix): void {
        if (mat.shape[0] !== 1 || mat.shape[1] !== this.shape[1]) {
            throw new Error("Column mismatch between " + this.shape[1] + " and " + mat.shape[1]);
        }
        for (let j = 0; j < mat.shape[1]; ++j) {
            this.set(n, j, mat.get(0, j));
        }
    }

    setCol(n: number, mat: Matrix): void {
        if (mat.shape[1] !== 1 || mat.shape[0] !== this.shape[0]) {
            throw new Error("Row mismatch between " + this.shape[0] + " and " + mat.shape[0]);
        }
        for (let i = 0; i < mat.shape[0]; ++i) {
            this.set(i, n, mat.get(i, 0));
        }
    }

    get(i: number, j: number): number {
        let offset = i * this.shape[1] + j;
        if (offset >= this.content.length) {
            throw new Error("Index " + [i, j] + " out range");
        }
        return this.content[offset];
    }

    set(i: number, j: number, val: number): void {
        let offset = i * this.shape[1] + j;
        if (offset >= this.content.length) {
            throw new Error("Index " + [i, j] + " out range");
        }
        this.content[offset] = val;
    }

    toString(): string {
        let ret = '[\n';
        for (let i = 0; i < this.shape[0]; ++i) {
            ret += i === 0 ? '[' : '\n[';
            for (let j = 0; j < this.shape[1]; ++j) {
                if (j === 0) {
                    ret += this.get(i, j).toFixed(2);
                } else {
                    ret += ', ' + this.get(i, j).toFixed(2);
                }
            }
            ret += ']';
        }
        ret += '\n]';
        return ret;
    }
};