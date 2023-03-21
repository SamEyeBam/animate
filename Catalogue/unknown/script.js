const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 500; //window.innerWidth;
canvas.height = 500; //window.innerHeight;

let gridSizeX = canvas.width;
let gridSizeY = canvas.height;

let gridA = create2DArray(gridSizeX, gridSizeY);
let gridB = create2DArray(gridSizeX, gridSizeY);
let nextGridA = create2DArray(gridSizeX, gridSizeY);
let nextGridB = create2DArray(gridSizeX, gridSizeY);

function create2DArray(rows, cols) {
  let arr = new Array(rows);
  for (let i = 0; i < rows; i++) {
    arr[i] = new Array(cols).fill(0);
  }
  return arr;
}

function seedGrid() {
  for (let i = 0; i < gridSizeX; i++) {
    for (let j = 0; j < gridSizeY; j++) {
      gridA[i][j] = 1;
      gridB[i][j] = Math.random() < 0.1 ? 0.5 : 0;
    }
  }
}

seedGrid();

let dA = 1;
let dB = 0.5;
let feed = 0.055;
let kill = 0.062;

function updateGrid() {
    const centerX = gridSizeX / 2;
    const centerY = gridSizeY / 2;
    const radialFlowStrength = 0.01;

    let tempGridA = create2DArray(gridSizeX, gridSizeY);
    let tempGridB = create2DArray(gridSizeX, gridSizeY);

    for (let x = 1; x < gridSizeX - 1; x++) {
        for (let y = 1; y < gridSizeY - 1; y++) {
            let deltaX = x - centerX;
            let deltaY = y - centerY;
            let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            let flowFactor = radialFlowStrength * (distance + 1);

            let dx = Math.round(deltaX * flowFactor);
            let dy = Math.round(deltaY * flowFactor);
            let sourceX = (x + Math.abs(dx) % gridSizeX) % gridSizeX;
            let sourceY = (y + Math.abs(dy) % gridSizeY) % gridSizeY;

            tempGridA[x][y] = gridA[sourceX][sourceY];
            tempGridB[x][y] = gridB[sourceX][sourceY];
        }
    }

    for (let x = 1; x < gridSizeX - 1; x++) {
        for (let y = 1; y < gridSizeY - 1; y++) {
            let a = tempGridA[x][y];
            let b = tempGridB[x][y];

            nextGridA[x][y] = a + (dA * laplaceA(x, y)) - (a * b * b) + (feed * (1 - a));
            nextGridB[x][y] = b + (dB * laplaceB(x, y)) + (a * b * b) - ((kill + feed) * b);

            nextGridA[x][y] = Math.min(Math.max(nextGridA[x][y], 0), 1);
            nextGridB[x][y] = Math.min(Math.max(nextGridB[x][y], 0), 1);
        }
    }

    let temp = gridA;
    gridA = nextGridA;
    nextGridA = temp;

    temp = gridB;
    gridB = nextGridB;
    nextGridB = temp;
}


function laplaceA(x, y) {
  let sum = 0;
  let weights = [
    [0.05, 0.2, 0.05],
    [0.2, -1, 0.2],
    [0.05, 0.2, 0.05],
  ];

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let row = (x + i + gridSizeX) % gridSizeX;
      let col = (y + j + gridSizeY) % gridSizeY;
      sum += gridA[row][col] * weights[i + 1][j + 1];
    }
  }

  return sum;
}

function laplaceB(x, y) {
  let sum = 0;
  let weights = [
    [0.05, 0.2, 0.05],
    [0.2, -1, 0.2],
    [0.05, 0.2, 0.05],
  ];

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let row = (x + i + gridSizeX) % gridSizeX;
      let col = (y + j + gridSizeY) % gridSizeY;
      sum += gridB[row][col] * weights[i + 1][j + 1];
    }
  }

  return sum;
}

function draw() {
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const data = imageData.data;

  for (let x = 0; x < gridSizeX; x++) {
    for (let y = 0; y < gridSizeY; y++) {
      const index = (x + y * gridSizeX) * 4;
      const a = gridA[x][y];
      const b = gridB[x][y];
      const color = {
        r: 206 * b,
        g: 66 * b,
        b: 245 * b,
      };

      data[index + 0] = color.r;
      data[index + 1] = color.g;
      data[index + 2] = color.b;
      data[index + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function loop() {
  draw();
  updateGrid();

  requestAnimationFrame(loop);
}

loop();
