//jshint esversion:8
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
centerX = ctx.canvas.width / 2;
centerY = ctx.canvas.height / 2;


let deg_per_sec = 10;
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
  deg_per_sec = animationList[currentAnimationIndex].speed;
  drawObj = createInstance(animationList[currentAnimationIndex].name, animationList[currentAnimationIndex].args);
}

let animationList = []

animationList.push({
  name: "PolyTwistColourWidth",
  args: [4, 400, 5, 14, -90, 100, "#e0ba10", "#e01044"],
  speed: 10,
  duration: 9*8
})

animationList.push({
  name: "FloralPhyllo",
  args: [300, 180, 1000, "#e0ba10", "#e01044"],
  speed: 5,
  duration: 60*10
})
animationList.push({
  name: "EyePrototype",
  args: [0, 0, 0, 1, 800, 10, 1, 1, 0, 0, 0, 0, 1, "#e0ba10", "#e01044", "#e0ba10", "blue"],
  speed: 10,
  duration: 60 * 3
})
animationList.push({
  name: "Spiral1",
  args: [6, 240, 5, "#e0ba10",],
  speed: 10,
  duration: 60*5
})
animationList.push({
  name: "PolyTwistColourWidth",
  args: [8, 400, 5, 65, -90, 100, "black","#e0ba10"],
  speed: 5,
  duration: 9*8
})
animationList.push({
  name: "FloralPhyllo_Accident",
  args: [20, 240, "#e01044", "#e0ba10"],
  speed: 4,
  duration: 60
})
animationList.push({
  name: "Nodal_expanding",
  args: [5, 120, 56, 6, "#e01044", "#e0ba10", 5],
  speed: 20,
  duration: 60 * 5
})
animationList.push({
  name: "Spiral1",
  args: [50, 240, 3, "#e01044"],
  speed: 8,
  duration: 60 * 5
})
animationList.push({
  name: "Phyllotaxis",
  args: [13, 1000, 6650, 0, "#e01044", "#e0ba10"],
  speed: 2,
  duration: 60 * 5
})
animationList.push({
  name: "MaryFace",
  args: [-110, -140, 18, 160, 195, -30, 18, 160],
  speed: 10,
  duration: 3
})
animationList.push({
  name: "FloralAccident",
  args: [20, 240, "#e01044"],
  speed: 8,
  duration: 60
})
animationList.push({
  name: "Phyllotaxis",
  args: [13, 500, 200, 1, "#e01044", "#e0ba10"],
  speed: 15,
  duration: 60 * 10
})
animationList.push({
  name: "SquareTwist_angle",
  args: [400, 3, "#e0ba10", "#e01044"],
  speed: 10,
  duration: 40
})
animationList.push({
  name: "Phyllotaxis",
  args: [13, 0, 600, 2, "#e0ba10", "#e01044"],
  speed: 15,
  duration: 60 * 10
})
animationList.push({
  name: "EyePrototype",
  args: [0, 0, 0, 0, 1000, 10, 0, 0, 0, 0, 1, 1, 1, "#e0ba10", "#e01044", "#e0ba10", "black"],
  speed: 10,
  duration: 60 * 3
})
animationList.push({
  name: "MaryFace",
  args: [-110, -140, 18, 160, 195, -30, 18, 160],
  speed: 10,
  duration: 3
})
animationList.push({
  name: "EyePrototype",
  args: [0, 0, 0, 0, 1000, 15, 1, 0, 1, 0, 0, 1, 1, "#e01044", "#e0ba10", "#e01044", "#e01044"],
  speed: 10,
  duration: 60
})
animationList.push({
  name: "CircleExpand",
  args: [21, 150, 1, 1, "#e01044", "#e0ba10"],
  speed: 10,
  duration: 60
})

let totalTime = 0;
for (let i = 0; i < animationList.length; i++) {
  totalTime += animationList[i].duration;
}
console.log("Total time: " + totalTime / 60)

let currentAnimationIndex = 0;

updateDrawObj();

function render() {
  setTimeout(() => {
    requestAnimationFrame(() => {
      render_clear();
      console.log(rotation)
      if (rotation / deg_per_sec >= animationList[currentAnimationIndex].duration) {
        currentAnimationIndex += 1;
        if (currentAnimationIndex === animationList.length) {
          currentAnimationIndex = 0;
        }
        rotation = 0
        updateDrawObj();
      }

      if (drawObj) {
        drawObj.draw(rotation);
      }

      if (!paused) {
        rotation += deg_per_sec / targetFps;
      }
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

manualToggleSettings();
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

  if (e.keyCode == '37') {
    // left arrow
    if (currentAnimationIndex === 0) {
      currentAnimationIndex = animationList.length - 1
    }
    else {
      currentAnimationIndex -= 1
    }
    updateDrawObj();
    rotation = 0
  }
  else if (e.keyCode == '39') {
    // right arrow
    if (currentAnimationIndex === animationList.length - 1) {
      currentAnimationIndex = 0
    }
    else {
      currentAnimationIndex += 1
    }
    updateDrawObj();
    rotation = 0
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
