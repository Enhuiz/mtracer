import { GaitTracer } from "./gait_tracer";

(() => {

    let cvs = document.getElementById('cvs');
    let ctx = cvs.getContext('2d');

    let WIDTH = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    let HEIGHT = WIDTH;
    let UNIT = WIDTH / 400;
    let RADIUS = 8 * UNIT;

    cvs.setAttribute('width', WIDTH.toString());
    cvs.setAttribute('height', HEIGHT.toString());

    function drawPoint(x: number, y: number) {
        ctx.beginPath();
        ctx.arc(x, y, RADIUS, 0, 2 * Math.PI);
        ctx.fill();
    };

    function clear() {
        ctx.fillStyle = '#FFF731';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    function getCanvasPos(cvs: any, e: any) {
        var rect = cvs.getBoundingClientRect();
        return [e.clientX - rect.left * (cvs.width / rect.width),
        e.clientY - rect.top * (cvs.height / rect.height)];
    }

    cvs.addEventListener("mouseup", function (e) {
        gt.target = [];
    });

    cvs.addEventListener("mousedown", function (e) {
        if (e.buttons > 0) {
            let [x, y] = getCanvasPos(cvs, e);
            gt.target = [x / WIDTH, y / HEIGHT];
        }
    });

    cvs.addEventListener("mousemove", function (e) {
        if (e.buttons > 0) {
            let [x, y] = getCanvasPos(cvs, e);
            gt.target = [x / WIDTH, y / HEIGHT];
        }
    });

    cvs.addEventListener("touchstart", function (e) {
        e.preventDefault();
        let [x, y] = getCanvasPos(cvs, e.touches[0]);
        gt.target = [x / WIDTH, y / HEIGHT];
    });

    cvs.addEventListener("touchmove", function (e) {
        e.preventDefault();
        let [x, y] = getCanvasPos(cvs, e.touches[0]);
        gt.target = [x / WIDTH, y / HEIGHT];
    });

    cvs.addEventListener("touchend", function (e) {
        e.preventDefault();
        gt.target = [];
    });

    let accelerationSpan = document.getElementById('acceleration');
    let targetSpan = document.getElementById('target');
    let outputSpan = document.getElementById('output');
    let lossSpan = document.getElementById('loss');

    let gt = new GaitTracer(15, 25, 2);
    gt.eta = 1e-2;
    gt.run(40, (acceleration, target, output, loss) => {
        clear();

        if (acceleration.length > 0)
            accelerationSpan.innerHTML = acceleration.map((val) => { return val.toFixed(2) }).join(', ');
        if (target.length > 0)
            targetSpan.innerHTML = target.map((val) => { return val.toFixed(2) }).join(', ');
        if (output.length > 0)
            outputSpan.innerHTML = output.map((val) => { return val.toFixed(2) }).join(', ');
        if (loss)
            lossSpan.innerHTML = loss.toFixed(2);

        if (target.length == 2) {
            ctx.fillStyle = '#c77800';
            drawPoint(target[0] * WIDTH, target[1] * HEIGHT);
        }

        if (output.length == 2) {
            ctx.fillStyle = '#00838f';
            drawPoint(output[0] * WIDTH, output[1] * HEIGHT);
        }
    });

    document.getElementById('reset-btn').onclick = () => { gt.reset(); };
})();
