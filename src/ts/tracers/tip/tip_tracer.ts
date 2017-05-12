import { Tracer } from "../tracer";

export class TipTracer extends Tracer {
    target: number[];
    framePerSecond: number;

    private output: number[];
    private prevTarget: number[];

    constructor(series_len: number, hidden_dim: number) {
        super(series_len, 2, hidden_dim, 2);

        this.target = [];
        this.output = [];
        this.eta = 0.05;
        this.framePerSecond = 40;
        this.prevTarget = [];
    }

    run(callback: (target: number[], output: number[], loss: number) => void) {
        setTimeout(() => { this.frame(callback); }, 1000 / this.framePerSecond);
    }

    private frame(callback?: (target: number[], output: number[], loss: number) => void) {
        let input = this.prevTarget.length > 0 ? this.prevTarget : this.output;
        this.output = super.update(input, this.target);
        if (callback) {
            callback(this.target, this.output, this.loss);
        }
        this.prevTarget = this.target;
        setTimeout(() => { this.frame(callback); }, 1000 / this.framePerSecond);
    }

    reset() {
        super.reset();
        this.target = [];
        this.output = [];
        this.loss = 0;
    }
}