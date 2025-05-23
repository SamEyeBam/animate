//jshint esversion:8
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
let centerX = ctx.canvas.width / 2;
let centerY = ctx.canvas.height / 2;


let deg_per_sec = 10;
let targetFps = 60;
let frameDuration = 1000 / targetFps;

let rotation = 0; //was = j = angle
let paused = false;
let elapsedTime = 0;
let lastTimestamp = 0;
render_clear();

let drawObj = null;
function createInstance(className, args) {
  const classMap = {
    NewWave: NewWave,
    Countdown: Countdown,
    RaysInShape: RaysInShape,
    PolyTwistColourWidth: PolyTwistColourWidth,
    FloralPhyllo: FloralPhyllo,
    Spiral1: Spiral1,
    FloralAccident: FloralAccident,
    FloralPhyllo_Accident: FloralPhyllo_Accident,
    Nodal_expanding: Nodal_expanding,
    Phyllotaxis: Phyllotaxis,
    SquareTwist_angle: SquareTwist_angle,
    EyePrototype: EyePrototype,
    CircleExpand: CircleExpand,
    MaryFace: MaryFace,
    // Add more class constructors here as needed
  };

  if (classMap.hasOwnProperty(className)) {
    return new classMap[className](...args);
  } else {
    throw new Error(`Unknown class name: ${className}`);
  }
}



async function updateDrawObj() {
  const shapeSelector = document.getElementById("shape-selector");
  const selectedShape = shapeSelector.value;
  const config = await fetchConfig(selectedShape);
  if (drawObj) {
    drawObj.remove(); // Remove the previous instance
  }
  // Extract default values from the configuration
  const defaultValues = config
    // .filter((item) => item.type !== "color") // Exclude color inputs
    .map((item) => item.defaultValue);

  drawObj = createInstance(selectedShape, defaultValues);

  // drawObj = await createShapeWithRandomProperties(813311281, config1);
  console.log(drawObj)
  drawObj.initialise(config);
}

updateDrawObj();

function render(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  const deltaTime = timestamp - lastTimestamp;
  const adjustedElapsed = elapsedTime / 100; // Convert to seconds
  lastTimestamp = timestamp;
  let adjustedDeltaTime;
  if (!paused) {
    rotation += deg_per_sec / targetFps;
    elapsedTime += deltaTime;
    adjustedDeltaTime = deltaTime / 100; // Convert to seconds
    // console.log(adjustedDeltaTime)
  }
  // console.log(deltaTime)
  // console.log(elapsedTime)
  render_clear();
  if (drawObj) {
    // drawObj.draw(rotation);

    drawObj.draw(adjustedElapsed, adjustedDeltaTime);

  }

  // ctx.font = "48px serif";
  // ctx.fillStyle = "white"
  // ctx.fillText(Math.floor(elapsedTime) + "ms", centerX - 100, centerY + 400);
  // drawCenter(300)

  requestAnimationFrame(render);
}


document
  .getElementById("shape-selector")
  .addEventListener("change", updateDrawObj);

let toolbarShowing = true;
document.addEventListener("keydown", toggleSettings);

// Add resize event listener
window.addEventListener('resize', function () {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  centerX = ctx.canvas.width / 2;
  centerY = ctx.canvas.height / 2;

});

function manualToggleSettings() {
  console.log("hi")
  toolbarShowing = !toolbarShowing;
  let tb = document.getElementById("toolbar");
  if (toolbarShowing) {
    tb.style.display = "flex";
  } else {
    tb.style.display = "none";
  }
}

function toggleSettings(e) {
  if (e.key == "p") {
    toolbarShowing = !toolbarShowing;
  }
  if (e.code === "Space") {
    paused = !paused;
  }

  let tb = document.getElementById("toolbar");
  if (toolbarShowing) {
    tb.style.display = "flex";
  } else {
    tb.style.display = "none";
  }
}

function TogglePause() {
  let pb = document.getElementById("pauseButton");
  paused = !paused;

  if (paused) {
    pb.textContent = "Play";
  } else {
    pb.textContent = "Pause";
  }
}
function Reset() {
  rotation = 0; //was = j = angle
  currentFrame = 0;
}

function ForwardFrame() {
  rotation += deg_per_sec / targetFps; // was = j = innerRotation, now = rotation
  currentFrame += 1; // was = i
}
function BackwardFrame() {
  rotation -= deg_per_sec / targetFps; // was = j = innerRotation, now = rotation
  currentFrame -= 1; // was = i
}

function ChangeDegPerSec(newValue) {
  deg_per_sec = newValue;
}

window.onload = requestAnimationFrame(render);
