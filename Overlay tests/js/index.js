//jshint esversion:8
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
centerX = ctx.canvas.width / 2;
centerY = ctx.canvas.height / 2;

let deg_per_sec = 5;
let time = 120;
let fps = 60;

rotation = 0; //was = j = angle
currentFrame = 0; //was = i

let depth = 300; //custom to npoly twist

let paused = true;
render_clear();

colour1 = "#4287f5";
colour2 = "#42f57b";

let width = 400
let sides = 3
let objectRotation = -90;

function render() {
  
    if (currentFrame < time / (1 / fps)) {
      setTimeout(() => {
        render();
        
        render_clear();

        
        // DrawPolyTwistColour_angle(sides, width, -90, rotation, colour1, colour2);
        // DrawPolyTwist_angle(15,400,-90,rotation/20,"red")
        DrawPolyTwistColour_width(sides,width,objectRotation,rotation,colour1,colour2)
        // DrawPolyTwist_width(10,400,-90,rotation/20,"red")

        if (!paused) {
        rotation += deg_per_sec / fps; // was = j = innerRotation, now = rotation
        currentFrame += 1; // was = i
        }
        
      }, 1000 / fps);
    
  }
}

let toolbarShowing = true;
document.addEventListener('keydown', toggle);

function toggle(e){
  if (e.key == "p") {
    toolbarShowing = !toolbarShowing;
  }
  if (e.code === 'Space') {
    paused = !paused;
  }

  let tb = document.getElementById("toolbar");
  if (toolbarShowing) {
    tb.style.display = "flex"
  }
  else{
    tb.style.display = "none";
  }
}

function TogglePause(){
  let pb = document.getElementById("pauseButton");
  paused = !paused

  if (paused) {
    pb.textContent = "Play"
  }
  else{
    pb.textContent = "Pause"
  }
}
function Reset(){
  rotation = 0; //was = j = angle
  currentFrame = 0;
}

function ForwardFrame(){
  rotation += deg_per_sec / fps; // was = j = innerRotation, now = rotation
  currentFrame += 1; // was = i
}
function BackwardFrame(){
  rotation -= deg_per_sec / fps; // was = j = innerRotation, now = rotation
  currentFrame -= 1; // was = i
}

const inputColour1 = document.getElementById('colour1');
inputColour1.addEventListener('input', ChangeColour);
const inputColour2 = document.getElementById('colour2');
inputColour2.addEventListener('input', ChangeColour);

function ChangeColour(e) {
  if (e.target.id == "colour1") {
    colour1 = e.target.value;
  }
  else{
    colour2 = e.target.value;
  }
}

const inputWidth = document.getElementById('inputWidth');
const outputWidth = document.getElementById('outputWidth');
inputWidth.addEventListener('input', ChangeWidth);
function ChangeWidth(e) {
  width = e.target.value;
  outputWidth.textContent = e.target.value;

}

function ChangeDepth(dep) {
  depth = dep;
}
function ChangeDegPerSec(newValue){
  deg_per_sec = newValue;
}
const inputSides = document.getElementById('inputSidesSlider');
inputSides.addEventListener('input', ChangeSidesSlider);
function ChangeSidesSlider(e) {
  sides = e.target.value;
}

function ChangeSides(newValue){
  sides = newValue;
}

function ChangeGlobalRotation(newValue){
  rotation = parseInt(newValue);
}
function ChangeObjectRotation(newValue){
  objectRotation = parseInt(newValue);
}

window.onload = render;
