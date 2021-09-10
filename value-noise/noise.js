let index = 0;
setInterval(() => {
    draw();
    permutation = getPermutation(maxPoints, index / 100)
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

let distance = 20;
let height = 50;

const maxPoints = Math.floor(canvas.width / distance + 1);

function getPermutation(max, seed = 0){
    function hashCode(str){
            let hash = 0, i, chr;
            if (str.length === 0) return hash;
            for (i = 0; i < str.length; i++) {
                chr   = str.charCodeAt(i);
                hash  = ((hash << 5) - hash) + chr;
                hash |= 0;
            }
            return hash;
    }
    if (typeof seed === 'string') seed = hashCode(seed);
    const interpolation = [];
    for (let x = 0; x < max; x++){
        const val = Math.sin(x * x) * seed;
        interpolation[x] = Math.sin(val);
    }
    return interpolation;
}
let permutation = getPermutation(maxPoints);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2 - (getPoint(0 / distance) * height));
    for (let i = 0; i < canvas.width; i+=.5) {
        ctx.lineTo(i, canvas.height / 2 - (getPoint(i / distance) * height));
    }
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.stroke();
}

function getPoint(x) {
    const linearInterpolation = (v, v2, f) => v*(1-f)+v2*f;
    const fade = (t) => ((6*t - 15)*t + 10)*t*t*t;
    const leftBase = parseInt(x) % maxPoints;
    const rightBase = leftBase + 1;
    return linearInterpolation(permutation[leftBase], permutation[rightBase], fade(x % 1));
}
