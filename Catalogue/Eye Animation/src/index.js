const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const points = [
  [50, 250],
  [450, 250],
];
let step = 0;
let speed = 8;
let opening = true;
let counter = 0;

let cooldown = 0;
function draw() {
  ctx.strokeStyle = "orange";
  ctx.fillStyle = "black";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, 500, 500);

  // let newPath = new Path2D();
  // newPath.arc(150, 75, 75, 0, 2 * Math.PI);

  ctx.beginPath();
  ctx.rect(100, 100, 300, 300);
  ctx.stroke();

  drawEyelid(step);

  ctx.save();
  // squareCut();
  eyelidCut(step);

  if (counter % 100 == 0) {
    counter = 0;
  }
  drawGrowEye(100 + counter);

  drawCircle(100);

  ctx.restore();

  stepFunc();
  counter++;
  window.requestAnimationFrame(draw);
}

function stepFunc() {
  if (cooldown != 0) {
    cooldown--;
  } else {
    if (opening == true) {
      if (step >= 200) {
        cooldown = 200;
        opening = false;
        step -= speed;
      } else {
        step += speed;
      }
    } else {
      if (step <= 0) {
        opening = true;
        step += speed;
      } else {
        step -= speed;
      }
    }
  }
}

function squareCut() {
  let squarePath = new Path2D();
  squarePath.rect(100, 100, 300, 300);

  ctx.clip(squarePath);
}

function drawGrowEye(step) {
  ctx.strokeStyle = "aqua";
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.arc(250, 250, step, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.strokeStyle = "orange";
}

function eyelidCut(step) {
  // ctx.lineWidth = 1;
  let squarePath = new Path2D();
  squarePath.moveTo(points[0][0], points[0][1]);
  squarePath.quadraticCurveTo(250, 250 - step, points[1][0], points[0][1]);

  squarePath.moveTo(points[0][0], points[0][1]);
  squarePath.quadraticCurveTo(250, 250 + step, points[1][0], points[0][1]);

  ctx.clip(squarePath);
}

function drawCircle(step) {
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.arc(250, 250, step, 0, 2 * Math.PI);
  ctx.stroke();
}

function drawEyelid(step) {
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  ctx.quadraticCurveTo(250, 250 - step, points[1][0], points[0][1]);

  ctx.moveTo(points[0][0], points[0][1]);
  ctx.quadraticCurveTo(250, 250 + step, points[1][0], points[0][1]);
  ctx.stroke();
}

window.requestAnimationFrame(draw);
