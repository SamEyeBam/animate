//jshint esversion:8
var seed = cyrb128("813311293");
var rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

// var gateway = `ws://192.168.1.184/ws`;
var gateway = `ws://192.168.4.1/ws`;
var websocket;
window.addEventListener('load', onLoad);
function initWebSocket() {
  console.log('Trying to open a WebSocket connection...');
  websocket = new WebSocket(gateway);
  websocket.onopen = onOpen;
  websocket.onclose = onClose;
  websocket.onmessage = onMessage; // <-- add this line
}
function onOpen(event) {
  console.log('Connection opened');
}
function onClose(event) {
  console.log('Connection closed');
  setTimeout(initWebSocket, 2000);
}

function onMessage(event) {
  console.log(event.data)
  console.log("--")
  setSeed(event.data)
  Reset()
  updateDrawObj(event.data)
  // TogglePause()
}

function onLoad(event) {
  initWebSocket();
}

function setSeed(val) {
  seed = cyrb128(val + "1");
  rand = sfc32(seed[0], seed[1], seed[2], seed[3]);
}

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
let paused = false;
render_clear();

let drawObj = null;
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
  NewWave:NewWave,
  // Add more class constructors here as needed
};
function createInstance(className, args) {

  if (classMap.hasOwnProperty(className)) {
    return new classMap[className](...args);
  } else {
    throw new Error(`Unknown class name: ${className}`);
  }
}



function cyrb128(str) {
  let h1 = 1779033703, h2 = 3144134277,
    h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
}
function sfc32(a, b, c, d) {
  return function () {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    var t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}

function PRNGinRange(min = 0, max = 100) {
  // find diff
  let difference = max - min;
  // generate random number 
  let randTmp = rand();
  // multiply with difference 
  randTmp = Math.floor(randTmp * difference);
  // add with min value 
  randTmp = randTmp + min;
  return randTmp;
}

async function createShapeWithRandomProperties() {
  let shapeConfig = await fetchConfig()
  const shapeName = Object.keys(shapeConfig)[PRNGinRange(0, Object.keys(shapeConfig).length - 1)];
  const ShapeClass = classMap[shapeName];
  const config = await fetchConfig(shapeName);
  const properties = {};
  console.log(config)

  const colours = colourPairs[PRNGinRange(0, 6)]
  const colour1 = colours[0]
  const colour2 = colours[1]
  console.log(colours)

  config.forEach((item, index) => {
    const min = item.min || 0;
    const max = (item.max+1) || 1;
    // console.log(item)
    const randomValue = PRNGinRange(min, max);
    if (item.type === "color") {
      if (item.property === "colour1") {
        properties[item.property] = colour1;
      }
      else {
        properties[item.property] = colour2;
      }
    }
    else {
      properties[item.property] = randomValue;
    }
  });

  return new ShapeClass(...Object.values(properties));
}

async function updateDrawObj(tagId) {
  if (drawObj) {
    drawObj.remove(); // Remove the previous instance
  }

  const heartTags = ["6624821687","26721587","3421222587","1143021587","662721587"]
  const faceTags = ["22622221287","226123187","11423322187","22610621287","9825523787"]
  const rickTags = ["2424722587","1942721587","1144921087","17822321287","22617222487"]

  console.log(heartTags)
  console.log(tagId)
  if(heartTags.includes(tagId)){
    drawObj = new CircleExpand(14,150,1,1,"#fc03cf","#00fffb");
  }
  else if(faceTags.includes(tagId)){
    drawObj = new MaryFace(-110,-140,18,160,195,-30,18,160);
  }
  else if(rickTags.includes(tagId)){
    drawObj = new RickRoll();
  }
  else{
    drawObj = await createShapeWithRandomProperties();
  }
  drawObj.initialise();


  console.log(drawObj)
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

function manualToggleSettings() {

  toolbarShowing = !toolbarShowing;
  let tb = document.getElementById("toolbar");
  if (toolbarShowing) {
    tb.style.display = "flex";
  } else {
    tb.style.display = "none";
  }
}
manualToggleSettings()//force closed at start

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
