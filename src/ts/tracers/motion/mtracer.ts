import { Tracer } from "../tracer";

export class MTracer extends Tracer {
    private acceleration: number[]
    private orientation: number[]

    accelerationEnabled: boolean;
    orientationEnabled: boolean;
    eta: number
    target: number[]
    framePerSecond: number;

    private output: number[]

    constructor(series_len: number, hidden_dim: number) {
        super(series_len, 6, hidden_dim, 2);

        this.accelerationEnabled = true;
        this.orientationEnabled = true;

        window.addEventListener('devicemotion', (event) => {
            if (event.acceleration && this.accelerationEnabled) {
                this.acceleration = [event.acceleration.x || 0, event.acceleration.y || 0, event.acceleration.z || 0];
            } else {
                this.acceleration = [];
            }
        });

        window.addEventListener('deviceorientation', (event) => {
            if (this.orientationEnabled) {
                this.orientation = [event.alpha / 360 || 0, event.beta / 360 || 0, event.gamma / 360 || 0];
            } else {
                this.orientation = [];
            }
        });

        this.acceleration = [];
        this.orientation = [];
        this.target = [];
        this.output = [];
        this.eta = 0.02;
        this.framePerSecond = 60;
    }

    run(callback: (acceleration: number[], orientation: number[], target: number[], output: number[], loss: number) => void) {
        setTimeout(() => { this.frame(callback); }, 1000 / this.framePerSecond);
    }

    private frame(callback?: (acceleration: number[], orientation: number[], target: number[], output: number[], loss: number) => void) {
        let input = []
            .concat(this.accelerationEnabled && this.acceleration.length > 0 ? this.acceleration : [0, 0, 0])
            .concat(this.orientationEnabled && this.orientation.length > 0 ? this.orientation : [0, 0, 0]);

        if (input.length === 6) {
            this.output = super.update(input, this.target, this.eta);
        }

        if (callback) {
            callback(this.acceleration, this.orientation, this.target, this.output, this.loss);
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