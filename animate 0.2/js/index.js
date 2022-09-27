//jshint esversion:8
i = 0;
const canvas = document.getElementById("mainCanvas");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var ctx = canvas.getContext("2d");
centerX = canvas.width / 2;
centerY = canvas.height / 2;
let DEBUGTools = new DebugTools(ctx, centerX, centerY);
let testPoly = new RandomPolygon(ctx, 300, centerX, centerY, 6, "crimson");
let testSquare = new Square(
  ctx,
  500,
  centerX,
  centerY,
  0,
  0,
  0,
  0,
  "blueViolet",
  false
);
let testCube = new Cube(
  ctx,
  500,
  centerX,
  centerY,
  0,
  0,
  0,
  0,
  "blueViolet",
  false
);
let testTet = new Tetrahedron(
  ctx,
  300,
  centerX,
  centerY,
  0,
  0,
  0,
  0,
  "blueViolet",
  false
);

let tetArray = [];
// for (let i = 0; i < 100; i++) {
//   tetArray.push(
//     new Tetrahedron(
//       ctx,
//       300 - i * (300/100),
//       centerX,
//       centerY + 140,
//       0,
//       45,
//       0,
//       35.264,
//       "rgb(" + (255 - i * (255/100)) + ", 0, 0)",
//       false
//     )
//   );
// }

// testTet.rotateSetOrg(60,0,35.264);
// testTet.rotateAddY(15);
// testTet.rotateAddX(15);
// testCube.rotateSetOrg(45,0,35.264);
// testTet.globalY +=140;
// testTet.rotateAddY(15);

tetArray.push(
  new Tetrahedron(
    ctx,
    200,
    centerX,
    centerY,
    0,
    0,
    0,
    0,
    "rgb(255, 0, 0)",
    false
  )
);
tetArray.push(
  new Tetrahedron(
    ctx,
    115,
    centerX,
    centerY,
    0,
    0,
    0,
    0,
    "rgb(200, 0, 0)",
    false
  )
);

let drawStack = [];
// drawStack.push(testTet);
drawStack.push(...tetArray);

// drawStack[0].rotateAddY(30);
drawStack[1].rotateAddY(45);
drawStack[1].rotateAddX(35.264);
drawStack[1].rotateAddZ(30);
drawStack[0].rotateAddY(45);
drawStack[0].rotateAddX(35.264);
function main() {
  setTimeout(() => {
    main();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStack[1].rotateAddX(1);
    drawStack[1].rotateAddY(1);
    drawStack[1].rotateAddZ(.2);
    
    // for (let i = 0; i < drawStack.length; i++) {
    //   drawStack[i].rotateAddY(0.005*(i+1));

    // }

    // drawStack.push(testCube);
    // testTet.rotateAddX(.3);
    // testTet.rotateAddY(.05);
    // testTet.rotateAddZ(.5);

    // testCube.rotateAddX(1);
    //  testCube.rotateAddY(1);
    // testCube.rotateAddZ(1);
    
    for (let i = 0; i < drawStack.length; i++) {
      drawStack[i].draw();
    }
    DEBUGTools.drawCenter(50);
  }, 1000 / 60);
}

window.onload = main;
