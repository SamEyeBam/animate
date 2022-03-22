// import math from "math.js";
function DrawPolyTwist_angle(sides,width, rotation,innerRotation, colour){
  let out_angle = innerRotation;
  let innerAngle = 180 - ((sides-2) *180/sides);
  let minWidth = Math.sin(rad(innerAngle/2))*(0.5/Math.tan(rad(innerAngle/2)))*2;
  
  let widthMultiplier = minWidth / Math.sin(Math.PI / 180 * (90+innerAngle/2 - out_angle + innerAngle * Math.floor(out_angle / innerAngle)))

  for (let i = 0; i < depth; i++) {
    DrawPolygon(sides,width*widthMultiplier**i,innerRotation*i, colour)
  }
} 

  
function DrawPolyTwist_width(sides,width, rotation,innerRotation, colour){
  let out_angle = 0
  let innerAngle = 180 - ((sides-2) *180/sides);
  let scopeAngle = innerRotation - (innerAngle*Math.floor(innerRotation/innerAngle));

  if (scopeAngle < innerAngle/2) {
    out_angle = innerAngle / (2 * Math.cos((2*Math.PI*scopeAngle)/(3*innerAngle))) - innerAngle/2
  }
  else {
    out_angle = -innerAngle / (2 * Math.cos( ((2*Math.PI)/3) - ((2*Math.PI*scopeAngle)/(3*innerAngle))) ) + (innerAngle*3)/2
  }
  let minWidth = Math.sin(rad(innerAngle/2))*(0.5/Math.tan(rad(innerAngle/2)))*2;
  
  let widthMultiplier = minWidth / Math.sin(Math.PI / 180 * (90+innerAngle/2 - out_angle + innerAngle * Math.floor(out_angle / innerAngle)))

  for (let i = 0; i < depth; i++) {
    DrawPolygon(sides,width*widthMultiplier**i,out_angle*i+rotation, colour)
  } 

}

function DrawPolyTwistColour_angle(sides,width, rotation,innerRotation,colour1,colour2){
  let out_angle = innerRotation;
  let innerAngle = 180 - ((sides-2) *180/sides);
  let minWidth = Math.sin(rad(innerAngle/2))*(0.5/Math.tan(rad(innerAngle/2)))*2;
  
  let widthMultiplier = minWidth / Math.sin(Math.PI / 180 * (90+innerAngle/2 - out_angle + innerAngle * Math.floor(out_angle / innerAngle)))

  for (let i = 0; i < depth; i++) {
    let fraction = i/depth;
    // let fraction = Math.cos(rad(i / 2));
    // let fraction = (-1*(i-depth)**2)/depth**2+1
    // let ncolour = LerpRGB(colour1,colour2,fraction);
    let ncolour = LerpHex(colour1,colour2,fraction);

    // let ncolour = LerpRGB(colour1,colour2,((i-depth)**2)/depth**2);
    // DrawPolygon(sides,width*widthMultiplier**i,out_angle*i+rotation, colourToText(ncolour))
    DrawPolygon(sides,width*widthMultiplier**i,out_angle*i+rotation, ncolour)
  }
} 

function DrawPolyTwistColour_width(sides,width, rotation,innerRotation, colour1,colour2){
  let out_angle = 0
  let innerAngle = 180 - ((sides-2) *180/sides);
  let scopeAngle = innerRotation - (innerAngle*Math.floor(innerRotation/innerAngle));

  if (scopeAngle < innerAngle/2) {
    out_angle = innerAngle / (2 * Math.cos((2*Math.PI*scopeAngle)/(3*innerAngle))) - innerAngle/2
  }
  else {
    out_angle = -innerAngle / (2 * Math.cos( ((2*Math.PI)/3) - ((2*Math.PI*scopeAngle)/(3*innerAngle))) ) + (innerAngle*3)/2
  }
  let minWidth = Math.sin(rad(innerAngle/2))*(0.5/Math.tan(rad(innerAngle/2)))*2;
  
  let widthMultiplier = minWidth / Math.sin(Math.PI / 180 * (90+innerAngle/2 - out_angle + innerAngle * Math.floor(out_angle / innerAngle)))

  for (let i = 0; i < depth; i++) {
    // let ncolour = LerpRGB(colour1,colour2,i/depth);
    let fraction = i/depth;
    // let fraction = Math.cos(rad(i / 2));
    // let fraction = (-1*(i-depth)**2)/depth**2+1

    let ncolour = LerpHex(colour1,colour2,fraction);
    // let ncolour = LerpRGB(colour1,colour2,fraction);
    // let ncolour = LerpRGB(colour1,colour2,((i-depth)**2)/depth**2);
    
    DrawPolygon(sides,width*widthMultiplier**i,out_angle*i+rotation, ncolour)
    // DrawPolygon(sides,width*widthMultiplier**i,out_angle*i+rotation, colourToText(ncolour))
  } 
}

function DrawPolygon(sides, width, rotation, colour) {
  ctx.beginPath();
  ctx.moveTo (centerX +  width * Math.cos(rotation*Math.PI/180), centerY +  width *  Math.sin(rotation*Math.PI/180)); 

  for (var i = 1; i <= sides; i += 1) {
    ctx.lineTo(
      centerX + width * Math.cos(i * 2 * Math.PI / sides + (rotation*Math.PI/180)),
      centerY + width * Math.sin(i * 2 * Math.PI / sides + (rotation*Math.PI/180))
    );
  }
  ctx.strokeStyle = colour;
  ctx.lineWidth = 1;
  ctx.stroke();
}



function rad(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

function colourToText(colour) {
  return "rgb(" + colour[0] + "," + colour[1] + "," + colour[2] + ")"
}

function LerpHex(a, b, amount) { 

  var ah = parseInt(a.replace(/#/g, ''), 16),
      ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
      bh = parseInt(b.replace(/#/g, ''), 16),
      br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
      rr = ar + amount * (br - ar),
      rg = ag + amount * (bg - ag),
      rb = ab + amount * (bb - ab);

  return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

function LerpRGB(a, b, t) {
  if (t < 0) {
    t *= -1;
  }
  var newColor = [0, 0, 0];
  newColor[0] = a[0] + (b[0] - a[0]) * t;
  newColor[1] = a[1] + (b[1] - a[1]) * t;
  newColor[2] = a[2] + (b[2] - a[2]) * t;
  return newColor;
}

function render_clear() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}