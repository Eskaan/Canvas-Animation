let index = 0;
setInterval(() => {
    draw();
    permutation = getPermutation(maxPoints, index / 100);
    //offset = index;
    index++;
}, 10);
const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let graphPoints = [];
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = '#fff';

let distance = 300;
let height = 400;
let offset = 590;
let roughness = 1;
let maxPoints = Math.floor((canvas.width / distance + 1) / 2) * 2 + 1;

let permutation = getPermutation(maxPoints, 'Code-Ac');

function getPermutation(max, seed = 0) {
    function hashCode(str) {
        let hash = 0, i, chr;
        if (str.length === 0) return hash;
        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr * chr;
            hash |= 0;
        }
        return hash;
    }

    if (typeof seed === 'string') seed = hashCode(seed);
    const interpolation = [];
    for (let x = 1; x <= max; x++) {
        const val = Math.sin(x * x) * (seed + 1);
        interpolation[x - 1] = Math.sin(val) % 1;
    }
    interpolation[interpolation.length] = interpolation[0];
    return interpolation;
}

let wrong;

function draw() {
    ctx.beginPath();

    //Draw graph
    ctx.moveTo(0, canvas.height / 2 - (getPoint(offset / distance) * height));
    for (let i = 0; i < canvas.width; i += roughness) {
        const noiseAt = getPoint((i + offset) / distance);
        if (noiseAt < -1 || noiseAt > 1) wrong = getPoint((i + offset) / distance, true);
        ctx.lineTo(i, canvas.height / 2 - noiseAt * height);
    }

    //Grid lines
    ctx.moveTo(canvas.width, canvas.height / 2);
    ctx.lineTo(0, canvas.height / 2);
    for (let i = -offset % (distance * maxPoints); i < canvas.width; i += distance*maxPoints) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
    }

    //Clear and paint new
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
}

function getPoint(x = 0, log = false) {
    const dotProduct = (x, x1) => (x - x1) * permutation[x];
    const interpolation = (v, v2, f) => v * (1 - f) + v2 * f;
    const fade = (t) => ((6 * t - 15) * t + 10) * t * t * t;

    const inputNegative = x < 0;
    x = Math.abs(x);
    x %= (maxPoints);
    const leftBase = parseInt(x);
    const rightDotP = dotProduct(leftBase + 1, x);
    const leftDotP = dotProduct(leftBase, x);
    let result = interpolation(leftDotP, rightDotP, fade(x % 1));
    if (inputNegative)
        result = result - (result * 2);
    if (log) return [x, leftBase, rightDotP, leftDotP, result];
    return result;
}
