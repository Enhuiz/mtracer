import { Matrix } from "./matrix";
import { RNN } from "./rnn";
import { Tracer } from "./tracer";

export class GaitTracer extends Tracer {
    private acceleration: number[]

    eta: number
    target: number[]
    output: number[]

    constructor(series_len: number, hidden_dim: number, output_dim: number) {
        super(series_len, 3, hidden_dim, output_dim);

        window.addEventListener('devicemotion', (event) => {
            if (event.acceleration) {
                this.acceleration = [event.acceleration.x || 0, event.acceleration.y || 0, event.acceleration.z || 0];
            }
        });
    }

    run(deltaTime: number) {
        setInterval(() => {
            this.output = super.tick(this.acceleration, this.target, this.eta);
        }, deltaTime);
    }
}