export class Matrix {
    readonly content: number[];
    readonly shape: [number, number];

    constructor(arr: number[][]) {
        this.shape = [arr.length, arr[0].length];
        for (let i = 0; i < this.shape[0]; ++i) {
            if (arr[i].length != this.shape[1]) {
                throw "Error: shape of mat invalid";
            }
        }

        this.content = new Array(this.shape[0] * this.shape[1]);
        for (let i = 0; i < this.shape[0]; ++i) {
            for (let j = 0; j < this.shape[1]; ++j) {
                this.set(i, j, arr[i][j]);
            }
        }
    }

    private static create_matrix(shape, element_wise_setter) {
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
        return Matrix.create_matrix(shape, (index) => { return index[0] == index[1] ? 1 : 0; })
    }

    static zeros(shape: [number, number]): Matrix {
        return Matrix.create_matrix(shape, () => { return 0; })
    }

    static ones(shape: [number, number]): Matrix {
        return Matrix.create_matrix(shape, () => { return 1; })
    }

    static full(shape: [number, number], val: number): Matrix {
        return Matrix.create_matrix(shape, () => { return val; })
    }

    static random(shape: [number, number], max: number, min: number): Matrix {
        return Matrix.create_matrix(shape, () => { return min + Math.random() * (max - min); })
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

    static reduce_sum(mat: Matrix): number {
        let sum = 0;
        for (let i = 0; i < mat.shape[0]; ++i) {
            for (let j = 0; j < mat.shape[1]; ++j) {
                sum += mat.get(i, j);
            }
        }
        return sum;
    }

    map(element_wise_setter, other?: Matrix | number): Matrix {
        let arr = new Array(this.shape[0]);
        for (let i = 0; i < arr.length; ++i) {
            arr[i] = new Array(this.shape[1]);
        }
        if (typeof other == 'number') {
            for (let i = 0; i < this.shape[0]; ++i) {
                for (let j = 0; j < this.shape[1]; ++j) {
                    arr[i][j] = element_wise_setter(this.get(i, j), other, [i, j], this);
                }
            }
        }
        else if (other instanceof Matrix) {
            for (let i = 0; i < this.shape[0]; ++i) {
                for (let j = 0; j < this.shape[1]; ++j) {
                    arr[i][j] = element_wise_setter(this.get(i, j), other.get(i, j), [i, j], this, other);
                }
            }
        }
        else {
            for (let i = 0; i < this.shape[0]; ++i) {
                for (let j = 0; j < this.shape[1]; ++j) {
                    arr[i][j] = element_wise_setter(this.get(i, j), [i, j], this);
                }
            }
        }
        return new Matrix(arr);
    }

    add(other: Matrix | number): Matrix {
        return this.map((x, y) => { return x + y; }, other);
    }

    subtract(other: Matrix | number): Matrix {
        return this.map((x, y) => { return x - y; }, other);
    }

    multiply(other: Matrix): Matrix {
        return this.map((x, y) => { return x * y; }, other);
    }

    matmul(other: Matrix): Matrix {
        if (this.shape[1] !== other.shape[0]) {
            throw "Error: Matrix mismatch matmul";
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

    get(i: number, j: number): number {
        return this.content[i * this.shape[1] + j];
    }

    set(i: number, j: number, val: number) {
        this.content[i * this.shape[1] + j] = val;
    }

    transpose(): Matrix {
        return this.map((val, index, matrix) => {
            return matrix.get(index[1], index[0]);
        });
    }

    neg(): Matrix {
        return this.map((val) => {
            return -val;
        });
    }
};