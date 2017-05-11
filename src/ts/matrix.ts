export class Matrix {
    readonly content: number[];
    readonly shape: [number, number];

    constructor(arr: number[][]) {
        this.shape = [arr.length, arr[0].length];
        for (let i = 0; i < this.shape[0]; ++i) {
            if (arr[i].length != this.shape[1]) {
                throw new Error("Invalid shape");
            }
        }

        this.content = new Array(this.shape[0] * this.shape[1]);
        for (let i = 0; i < this.shape[0]; ++i) {
            for (let j = 0; j < this.shape[1]; ++j) {
                this.set(i, j, arr[i][j]);
            }
        }
    }

    private static create(shape: [number, number], element_wise_setter: (index: [number, number]) => number) {
        let arr = new Array(shape[0]);
        for (let i = 0; i < arr.length; ++i) {
            arr[i] = new Array(shape[1]);
        }
        for (let i = 0; i < shape[0]; ++i) {
            for (let j = 0; j < shape[1]; ++j) {
                arr[i][j] = element_wise_setter([i, j]);
            }
        }
        return new Matrix(arr);
    }

    static eye(shape: [number, number]): Matrix {
        return Matrix.create(shape, (index) => { return index[0] === index[1] ? 1 : 0; })
    }

    static zeros(shape: [number, number]): Matrix {
        return Matrix.create(shape, () => { return 0; })
    }

    static ones(shape: [number, number]): Matrix {
        return Matrix.create(shape, () => { return 1; })
    }

    static full(shape: [number, number], val: number): Matrix {
        return Matrix.create(shape, () => { return val; })
    }

    static random(shape: [number, number], max: number, min: number): Matrix {
        return Matrix.create(shape, () => { return min + Math.random() * (max - min); })
    }

    static tanh(mat: Matrix): Matrix {
        return mat.map((val) => { return (Math.exp(val) - Math.exp(-val)) / (Math.exp(val) + Math.exp(-val)); });
    }

    static exp(mat: Matrix): Matrix {
        return mat.map((val) => { return Math.exp(val); });
    }

    static pow(mat: Matrix, n): Matrix {
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

    static argmax(mat: Matrix, axis?: number): Matrix {
        if (axis) {
            if (axis != 0 && axis != 1) {
                throw new Error("Axis should be either 0 or 1 but get " + axis);
            }
            let sum = mat.slice(0, axis);
            for (let i = 1; i < mat.shape[0]; ++i) {
                sum.add(mat.slice(i, axis));
            }
            return sum;
        } else {
            throw new Error("not implemented");
        }
    }

    map(element_wise_setter: (val: number, index: [number, number], matrix: Matrix) => number): Matrix {
        let arr = new Array(this.shape[0]);
        for (let i = 0; i < arr.length; ++i) {
            arr[i] = new Array(this.shape[1]);
        }
        for (let i = 0; i < this.shape[0]; ++i) {
            for (let j = 0; j < this.shape[1]; ++j) {
                arr[i][j] = element_wise_setter(this.get(i, j), [i, j], this);
            }
        }
        return new Matrix(arr);
    }

    add(other: Matrix | number): Matrix {
        if (other instanceof Matrix) {
            return this.map((val, index, matrix) => { return val + other.get(index); })
        } else {
            return this.map((val) => { return val + other; })
        }
    }

    subtract(other: Matrix | number): Matrix {
        if (other instanceof Matrix) {
            return this.map((val, index, matrix) => { return val - other.get(index); })
        } else {
            return this.map((val) => { return val + other; })
        }
    }

    multiply(other: Matrix | number): Matrix {
        if (other instanceof Matrix) {
            return this.map((val, index, matrix) => { return val * other.get(index); })
        } else {
            return this.map((val) => { return val + other; })
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

    get(i: number, j: number);
    get(i: [number, number]);
    get(i: number | [number, number], j?: number): number {
        let offset;
        if (typeof i === 'number' && typeof j === 'number') {
            offset = i * this.shape[1] + j;
        } else {
            offset = i[0] * this.shape[1] + i[1];
        }
        if (offset >= this.content.length) {
            throw new Error("Index " + [i, j] + " out range");
        }
        return this.content[offset];
    }

    row(n: number): Matrix {
        return Matrix.create([1, this.shape[1]], index => {
            return this.get(n, index[1]);
        });
    }

    col(n: number): Matrix {
        return Matrix.create([this.shape[1], 1], index => {
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

    set(i: number, j: number, val: number) {
        this.content[i * this.shape[1] + j] = val;
    }

    transpose(): Matrix {
        let ret = Matrix.zeros([this.shape[1], this.shape[0]]);
        return ret.map((val, index) => {
            return this.get(index[1], index[0]);
        });
    }

    neg(): Matrix {
        return this.map((val) => {
            return -val;
        });
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