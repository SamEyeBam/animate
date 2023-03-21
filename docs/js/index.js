//jshint esversion:8
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
centerX = ctx.canvas.width / 2;
centerY = ctx.canvas.height / 2;


let deg_per_sec = 5;
let targetFps = 60;
let frameDuration = 1000 / targetFps;

let rotation = 0; //was = j = angle
let paused = true;
render_clear();

let drawObj = null;
function createInstance(className, args) {
  const classMap = {
    PolyTwistColourWidth: PolyTwistColourWidth,
    FloralPhyllo: FloralPhyllo,
    Spiral1: Spiral1,
    FloralAccident: FloralAccident,
    FloralPhyllo_Accident: FloralPhyllo_Accident,
    Nodal_expanding: Nodal_expanding,
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
  drawObj.initialise(config);
}

updateDrawObj();

function render() {
  setTimeout(() => {
    requestAnimationFrame(() => {
      render_clear();
      if (drawObj) {
        drawObj.draw(rotation);
      }

      if (!paused) {
        rotation += deg_per_sec / targetFps;
      }
    });

    render();
  }, frameDuration);
}

document
  .getElementById("shape-selector")
  .addEventListener("change", updateDrawObj);

let toolbarShowing = true;
document.addEventListener("keydown", toggleSettings);

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
  rotation += deg_per_sec / fps; // was = j = innerRotation, now = rotation
  currentFrame += 1; // was = i
}
function BackwardFrame() {
  rotation -= deg_per_sec / fps; // was = j = innerRotation, now = rotation
  currentFrame -= 1; // was = i
}

function ChangeDegPerSec(newValue) {
  deg_per_sec = newValue;
}

window.onload = render;
