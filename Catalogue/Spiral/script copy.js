const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let centerX, centerY;

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
}

setCanvasSize();
window.addEventListener("resize", setCanvasSize);

const degPerSec = 0.00000015;
const time = 99999999;
const fps = 60;

let rotation = 0;
let currentFrame = 0;

function render() {
  if (currentFrame < maxTime / (1 / fps)) {
    setTimeout(() => {
      render();
      clearCanvas();

      drawSpiral(rotation + 1);

      rotation += degPerSec * fps;
      currentFrame++;
    }, 1000 / fps);
  }
}
render();

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawSpiral(angle) {
  const startColor = [45, 129, 252];
  const endColor = [252, 3, 98];
  const distanceMultiplier = 2;
  const maxIterations = 1000;

  for (let n = 0; n < maxIterations; n++) {
    const nColor = lerpRGB(startColor, endColor, Math.cos(rad(n / 2)));
    const nAngle = n * angle + Math.sin(angle * n * 3);
    const radius = distanceMultiplier * n;
    const xCoord = radius * Math.cos(nAngle) + centerX;
    const yCoord = radius * Math.sin(nAngle) + centerY;

    ctx.beginPath();
    ctx.arc(xCoord, yCoord, 8, 0, 2 * Math.PI);
    ctx.fillStyle = colourToText(nColor);
    ctx.fill();
  }
}

function rad(degrees) {
  return degrees * (Math.PI / 180);
}

function lerpRGB(a, b, t) {
  const result = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    result[i] = (1 - t) * a[i] + t * b[i];
  }
  return result;
}

function colourToText(colour) {
  return `rgb(${colour[0]}, ${colour[1]}, ${colour[2]})`;
}
