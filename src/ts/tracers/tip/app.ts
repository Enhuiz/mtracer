import { TipTracer } from "./tip_tracer";

declare let Vue;
declare let $;

let cvs: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('cvs');
let ctx = cvs.getContext('2d');

let horizantal = window.innerWidth > window.innerHeight;

let WIDTH = Math.min(window.innerWidth, window.innerHeight) * (horizantal ? 0.7 : 0.95);
let HEIGHT = WIDTH;
let UNIT = WIDTH / 400;
let RADIUS = 8 * UNIT;


let COLOR_CLEAR = '#ffffff';
let COLOR_TRACER = '#db2828';
let COLOR_USER = '#28db28';

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

let targetSpan = $('#target-span');
let outputSpan = $('#output-span');
let lossSpan = $('#loss-span');

let mt = new TipTracer(15, 30);

mt.run((target, output, loss) => {
    clear();

    targetSpan.text(target.length > 0 ? target.map(val => { return val.toFixed(2) }).join(', ') : '-');
    outputSpan.text(output.length > 0 ? output.map(val => { return val.toFixed(2) }).join(', ') : '-');
    lossSpan.text(loss ? loss.toFixed(2) : '-');

    if (target.length === 2) {
        ctx.fillStyle = COLOR_USER;
        drawPoint(target[0] * WIDTH, target[1] * HEIGHT);
    }

    if (output.length === 2) {
        ctx.fillStyle = COLOR_TRACER;
        drawPoint(output[0] * WIDTH, output[1] * HEIGHT);
    }
});

$('#reset-btn').click(() => { mt.reset(); });
$('#setting-btn').click(() => {
    $('#settings').modal('show');
    $('#fps-span').text(mt.framePerSecond);
    $('#eta-span').text(mt.eta);
});

let monitor = $("#monitor");
let hideMonitorBtn = $('#hide-monitor-btn');
hideMonitorBtn.click(() => {
    if (monitor.is(":visible")) {
        monitor.hide(300);
        hideMonitorBtn.text("Show Monitor");
    } else {
        monitor.show(300);
        hideMonitorBtn.text("Hide Monitor");
    }
});

$('#go-back-btn').click(() => { $('#settings').modal('hide'); })

$('#add-fps-btn').click(() => {
    mt.framePerSecond += 1;
    if (mt.framePerSecond > 79) {
        $('#add-fps-btn').attr('disabled', 'disabled');
    }
    $('#fps-span').text(mt.framePerSecond);
    $('#subtract-fps-btn').removeAttr('disabled');
});

$('#subtract-fps-btn').click(() => {
    mt.framePerSecond -= 1;
    if (mt.framePerSecond < 31) {
        $('#subtract-fps-btn').attr('disabled', 'disabled');
    }
    $('#add-fps-btn').removeAttr('disabled');
    $('#fps-span').text(mt.framePerSecond);
});

$('#add-eta-btn').click(() => {
    mt.eta += 0.01;
    if (mt.eta > 0.09) {
        $('#add-eta-btn').attr('disabled', 'disabled');
    }
    $('#eta-span').text(mt.eta.toFixed(2));
    $('#subtract-eta-btn').removeAttr('disabled');
});

$('#subtract-eta-btn').click(() => {
    mt.eta -= 0.01;
    if (mt.eta < 0.02) {
        $('#subtract-eta-btn').attr('disabled', 'disabled');
    }
    $('#add-eta-btn').removeAttr('disabled');
    $('#eta-span').text(mt.eta.toFixed(2));
});
