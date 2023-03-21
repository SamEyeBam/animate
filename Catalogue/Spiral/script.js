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

const degPerSec = 0.000005;
const maxTime = 99999999;

let startingRotation = 0.5;
let currentFrame = 0;

let fps = 0;
let fpsCounter = 0;
let lastTime = 0;

function render(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsedTime = timestamp - startTime;

  clearCanvas();
  drawSpiral(startingRotation + degPerSec * elapsedTime,elapsedTime);

  if (elapsedTime < maxTime) {
    requestAnimationFrame(render);
  }

  displayFPS(timestamp);
}
let startTime = null;
requestAnimationFrame(render);

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawSpiral(angle,elapsedTime) {
  const startColor = [45, 129, 252];
  const endColor = [252, 3, 98];
  const distanceMultiplier = 3;
  const maxIterations = 200;
//   angle=0;
  for (let n = 0; n < maxIterations; n++) {
    ctx.beginPath();
    const nColor = lerpRGB(startColor, endColor, Math.cos(rad(n / 2)));

    // const nAngle = n* angle ;
    // const nAngle = n*angle+ Math.sin(rad(n*1+angle*4000))/1 ;
    const nAngle = n*angle +Math.sin(rad(n*1+angle*40000))/2 ;
    const radius = distanceMultiplier * n;
    const xCoord = radius * Math.cos(nAngle) + centerX;
    const yCoord = radius * Math.sin(nAngle) + centerY;
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

function displayFPS(timestamp) {
  // Calculate FPS
  fpsCounter++;
  if (timestamp > lastTime + 1000) {
    fps = Math.round((fpsCounter * 1000) / (timestamp - lastTime));
    fpsCounter = 0;
    lastTime = timestamp;
  }

  // Display FPS
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`FPS: ${fps}`, 10, 30);
}

function colourToText(colour) {
  return `rgb(${colour[0]}, ${colour[1]}, ${colour[2]})`;
}
