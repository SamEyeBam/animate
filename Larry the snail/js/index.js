//jshint esversion:8
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
centerX = ctx.canvas.width / 2;
centerY = ctx.canvas.height / 2;
ctx.imageSmoothingEnabled = false;


let deg_per_sec = 60;
let targetFps = 60;
let frameDuration = 1000 / targetFps;
let lastTimestamp = 0;
let trueTimestamp = 0;

let rotation = 0; //was = j = angle
let paused = false;
render_clear();

let drawObj = null;
function createInstance(className, args) {
  const classMap = {
    Larry: Larry,
    PolyTwistColourWidth: PolyTwistColourWidth,
    TestParent: TestParent,
    TestChild: TestChild,

    // Add more class constructors here as needed
  };

  if (classMap.hasOwnProperty(className)) {
    return new classMap[className](...args);
  } else {
    throw new Error(`Unknown class name: ${className}`);
  }
}


//recreate this for child objects?
async function updateDrawObj() {
  const shapeSelector = document.getElementById("shape-selector");
  const selectedShape = shapeSelector.value;
  const config = await fetchConfig(selectedShape);
  if (drawObj) {
    drawObj.remove(); // Remove the previous instance
  }

  // Initialize the instance without configuration
  drawObj = createInstance(selectedShape, []);

  // Set up controls and then update instance properties
  drawObj.initialise(config);

  // Update instance properties based on control values
  config.forEach(item => {
    if (item.type === "range" || item.type === "dropdown" || item.type === "color") {
      const control = document.getElementById("el" + item.property);
      if (item.type === "range") {
        drawObj[item.property] = parseInt(control.value);
      }
      else {
        drawObj[item.property] = control.value;
      }

    }
  });

  console.log(drawObj);
}


updateDrawObj();

function render() {
  setTimeout(() => {
    requestAnimationFrame((timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      render_clear();
      if (drawObj) {
        // drawObj.draw(rotation);

        drawObj.draw(elapsed, trueTimestamp);

      }

      if (!paused) {
        rotation += deg_per_sec / targetFps;
        trueTimestamp += elapsed;
      }
      ctx.font = "48px serif";
      ctx.fillStyle = "white"
      ctx.fillText(Math.floor(trueTimestamp) + "ms", centerX - 100, centerY + 400);
      // drawCenter(300)
    });
    render();
  }, frameDuration);
}

document
  .getElementById("shape-selector")
  .addEventListener("change", updateDrawObj);

let toolbarShowing = true;
document.addEventListener("keydown", toggleSettings);


window.addEventListener("resize", () => {
    resizeCooledDown = false;
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    centerX = ctx.canvas.width / 2;
    centerY = ctx.canvas.height / 2;
    
})

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

function ForwardFrame(event) {
  rotation += deg_per_sec / 60; // was = j = innerRotation, now = rotation
  trueTimestamp += event.offsetX * 10
  console.log(event)
  console.log(event.clientX)
  console.log(event.x)
}
function BackwardFrame() {
  rotation -= deg_per_sec / fps; // was = j = innerRotation, now = rotation
  currentFrame -= 1; // was = i
}

function ChangeDegPerSec(newValue) {
  deg_per_sec = newValue;
}

window.onload = render;
