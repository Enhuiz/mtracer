import { Tracer } from "../tracer";

export class MTracer extends Tracer {
    private acceleration: number[]
    private orientation: number[]

    accelerationEnabled: boolean;
    orientationEnabled: boolean;

    framePerSecond: number;
    eta: number
    target: number[]
    output: number[]

    constructor(series_len: number, hidden_dim: number) {
        super(series_len, 6, hidden_dim, 2);

        this.accelerationEnabled = true;
        this.orientationEnabled = true;

        window.addEventListener('devicemotion', (event) => {
            if (event.acceleration && this.accelerationEnabled) {
                this.acceleration = [event.acceleration.x || 0, event.acceleration.y || 0, event.acceleration.z || 0];
            } else {
                this.acceleration = [0, 0, 0];
            }
        });

        window.addEventListener('deviceorientation', (event) => {
            if (this.orientationEnabled) {
                this.orientation = [event.alpha || 0, event.beta || 0, event.gamma || 0];
            } else {
                this.orientation = [0, 0, 0];
            }
        });

        this.acceleration = [];
        this.orientation = [];
        this.target = [];
        this.output = [];
        this.eta = 0.05;
        this.framePerSecond = 50;
    }

    run(callback?: (acceleration: number[], target: number[], output: number[], loss: number) => void) {
        setTimeout(() => { this.frame(callback); }, 1000 / this.framePerSecond);
    }

    private frame(callback?: (acceleration: number[], target: number[], output: number[], loss: number) => void) {
        let input = []
            .concat(this.accelerationEnabled ? this.acceleration : [0, 0, 0])
            .concat(this.orientationEnabled ? this.orientation : [0, 0, 0]);
        if (input.length === 6 && this.target.length === 2) {
            this.output = super.update(this.acceleration.concat(this.orientation), this.target, this.eta);
        }
        if (callback) {
            callback(this.acceleration, this.target, this.output, this.loss);
        }
        setTimeout(() => { this.frame(callback); }, 1000 / this.framePerSecond);
    }

    reset() {
        super.reset();
        this.target = [];
        this.output = [];
        this.loss = 0;
    }
}