import { MTracer } from "./mtracer";

declare let Vue;
declare let $;

let cvs = document.getElementById('cvs');
let ctx = cvs.getContext('2d');

let horizantal = window.innerWidth > window.innerHeight;

let WIDTH = Math.min(window.innerWidth, window.innerHeight) * (horizantal ? 0.7 : 0.95);
let HEIGHT = WIDTH;
let UNIT = WIDTH / 400;
let RADIUS = 8 * UNIT;

let COLOR_CLEAR = '#ffff52';
let COLOR_USER = '#0000ca';
let COLOR_TRACER = '#c7009e';

cvs.setAttribute('width', WIDTH.toString());
cvs.setAttribute('height', HEIGHT.toString());


function drawPoint(x: number, y: number) {
    ctx.beginPath();
    ctx.arc(x, y, RADIUS, 0, 2 * Math.PI);
    ctx.fill();
};

function clear() {
    ctx.fillStyle = COLOR_CLEAR;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function getCanvasPos(cvs: any, e: any) {
    var rect = cvs.getBoundingClientRect();
    return [e.clientX - rect.left * (cvs.width / rect.width),
    e.clientY - rect.top * (cvs.height / rect.height)];
}

cvs.addEventListener("mouseup", function (e) {
    mt.target = [];
});

cvs.addEventListener("mousedown", function (e) {
    if (e.buttons > 0) {
        let [x, y] = getCanvasPos(cvs, e);
        mt.target = [x / WIDTH, y / HEIGHT];
    }
});

cvs.addEventListener("mousemove", function (e) {
    if (e.buttons > 0) {
        let [x, y] = getCanvasPos(cvs, e);
        mt.target = [x / WIDTH, y / HEIGHT];
    }
});

cvs.addEventListener("touchstart", function (e) {
    e.preventDefault();
    let [x, y] = getCanvasPos(cvs, e.touches[0]);
    mt.target = [x / WIDTH, y / HEIGHT];
});

cvs.addEventListener("touchmove", function (e) {
    e.preventDefault();
    let [x, y] = getCanvasPos(cvs, e.touches[0]);
    mt.target = [x / WIDTH, y / HEIGHT];
});

cvs.addEventListener("touchend", function (e) {
    e.preventDefault();
    mt.target = [];
});

// let accelerationSpan = document.getElementById('acceleration');
// let targetSpan = document.getElementById('target');
// let outputSpan = document.getElementById('output');
// let lossSpan = document.getElementById('loss');

let mt = new MTracer(15, 30);

mt.run((acceleration, target, output, loss) => {
    clear();

    // if (acceleration.length > 0)
    //     accelerationSpan.innerHTML = acceleration.map((val) => { return val.toFixed(2) }).join(', ');
    // if (target.length > 0)
    //     targetSpan.innerHTML = target.map((val) => { return val.toFixed(2) }).join(', ');
    // if (output.length > 0)
    //     outputSpan.innerHTML = output.map((val) => { return val.toFixed(2) }).join(', ');
    // if (loss)
    //     lossSpan.innerHTML = loss.toFixed(2);

    if (target.length == 2) {
        ctx.fillStyle = COLOR_USER;
        drawPoint(target[0] * WIDTH, target[1] * HEIGHT);
    }

    if (output.length == 2) {
        ctx.fillStyle = COLOR_TRACER;
        drawPoint(output[0] * WIDTH, output[1] * HEIGHT);
    }
});


// document.getElementById('reset-btn').onclick = () => { mt.reset(); };
let monitor = new Vue({
    el: '#monitor',
    data: {
        mt: mt,
    }
});

$('#reset-btn').click(() => { mt.reset(); });
$('#setting-btn').click(() => {
    $('#settings').modal('show');
});

let setting = new Vue({
    el: '#settings',
    data: {
        mt: mt,
        updateFramePerSecond(event, sign) {
            mt.framePerSecond += sign > 0 ? 1 : -1;
        },
        updateLearningRate(event, sign) {
            mt.eta += sign > 0 ? 0.01 : -0.01;
        },
        toggleAcceleration(event, on) {
            mt.accelerationEnabled = on;
        },
        toggleOrientation(event, on) {
            mt.orientationEnabled = on;
        },
        hideModal() {
            $('#settings').modal('hide');
        }
    }
});