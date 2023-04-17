async function fetchConfig(className) {
  //   const config = await $.getJSON("config.json");
  const config = {
    PolyTwistColourWidth: [
      { type: "range", min: 3, max: 10, defaultValue: 5, property: "sides" },
      { type: "range", min: 1, max: 600, defaultValue: 400, property: "width" },
      { type: "range", min: 1, max: 100, defaultValue: 50, property: "depth" },
      { type: "range", min: -180, max: 180, defaultValue: -90, property: "rotation" },
      { type: "color", defaultValue: "#4287f5", property: "colour1" },
      { type: "color", defaultValue: "#42f57b", property: "colour2" },
    ],
    FloralPhyllo: [
      { type: "range", min: 1, max: 600, defaultValue: 300, property: "width" },
      { type: "range", min: 1, max: 100, defaultValue: 50, property: "depth" },
      { type: "color", defaultValue: "#4287f5", property: "colour1" },
      { type: "color", defaultValue: "#4287f5", property: "colour2" },
    ],
    Spiral1: [
      { type: "range", min: 1, max: 50, defaultValue: 20, property: "sides" },
      { type: "range", min: 1, max: 600, defaultValue: 240, property: "width" },
      { type: "color", defaultValue: "#4287f5", property: "colour" },
    ],
    FloralAccident: [
      { type: "range", min: 1, max: 50, defaultValue: 20, property: "sides" },
      { type: "range", min: 1, max: 600, defaultValue: 240, property: "width" },
      { type: "color", defaultValue: "#4287f5", property: "colour" },
    ],
    FloralPhyllo_Accident: [
      { type: "range", min: 1, max: 50, defaultValue: 20, property: "sides" },
      { type: "range", min: 1, max: 600, defaultValue: 240, property: "width" },
      { type: "color", defaultValue: "#2D81FC", property: "colour1" },
      { type: "color", defaultValue: "#FC0362", property: "colour2" },
    ],
    Nodal_expanding: [
      { type: "range", min: 1, max: 100, defaultValue: 5, property: "expand" },
      { type: "range", min: 1, max: 100000, defaultValue: 100000, property: "points" },
      { type: "range", min: 1, max: 10, defaultValue: 3, property: "line_width" },
      { type: "color", defaultValue: "#2D81FC", property: "colour1" },
      { type: "color", defaultValue: "#FC0362", property: "colour2" },
      { type: "range", min: 0, max: 10, defaultValue: 5, property: "colour_change" },
    ],
    Nodal: [
      { type: "range", min: 1, max: 1000, defaultValue: 400, property: "width" },
      { type: "range", min: 1, max: 20, defaultValue: 10, property: "points" },
      { type: "range", min: 1, max: 10, defaultValue: 3, property: "line_width" },
      { type: "range", min: 1, max: 20, defaultValue: 1, property: "step" },
      { type: "color", defaultValue: "#2D81FC", property: "colour" },
    ],
    Phyllotaxis: [
      { type: "range", min: 1, max: 40, defaultValue: 24, property: "width" },
      { type: "range", min: 1, max: 1000, defaultValue: 300, property: "nMax" },
      { type: "color", defaultValue: "#2D81FC", property: "colour1" },
      { type: "color", defaultValue: "#FC0362", property: "colour2" },
    ],
    SquareTwist_angle: [
      { type: "range", min: 1, max: 800, defaultValue: 400, property: "width" },
      { type: "range", min: 1, max: 10, defaultValue: 1, property: "line_width" },
      { type: "color", defaultValue: "#2D81FC", property: "colour1" },
    ],
    rectangle_pattern1: [
      { type: "range", min: 1, max: 800, defaultValue: 400, property: "width" },
      { type: "range", min: 1, max: 100, defaultValue: 10, property: "squares" },
      { type: "range", min: 1, max: 10, defaultValue: 1, property: "line_width" },
      { type: "color", defaultValue: "#2D81FC", property: "colour1" },
    ],
    EyePrototype: [
      { type: "range", min: 1, max: 800, defaultValue: 400, property: "width" },
      { type: "range", min: 1, max: 100, defaultValue: 10, property: "squares" },
      { type: "range", min: 1, max: 10, defaultValue: 1, property: "line_width" },
      { type: "color", defaultValue: "#2D81FC", property: "colour1" },
    ],
  };
  return config[className];
}

function addControl(item, instance) {
  // console.log(item);
  let parentDiv = document.getElementById("custom");

  let title = document.createElement("p");
  title.innerText = item.property + ": " + item.defaultValue;
  title.id = "elText" + item.property;

  let control = document.createElement("input");
  control.type = item.type;

  if (item.type === "range") {
    control.min = item.min;
    control.max = item.max;
  }

  control.value = item.defaultValue;
  control.className = "control";
  control.id = "el" + item.property;

  const listener = (event) => {
    const newValue = event.target.value;
    instance[item.property] =
      item.type === "range" ? parseInt(newValue, 10) : newValue;

    title.innerText = item.property + ": " + newValue;
  };

  control.addEventListener("input", listener);

  parentDiv.appendChild(title);
  parentDiv.appendChild(control);

  return { element: control, listener };
}

function drawEyelid(width, x1, y1, colour) {
  x1 -= centerX;
  y1 -= centerY;

  const angle = Math.atan2(y1, x1);
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);

  const x2 = cosAngle * width;
  const y2 = sinAngle * width;

  const x3Old = width / 2;
  const y3Old = width / 2;
  const x4Old = width / 2;
  const y4Old = -width / 2;

  const x3 = x3Old * cosAngle - y3Old * sinAngle;
  const y3 = x3Old * sinAngle + y3Old * cosAngle;
  const x4 = x4Old * cosAngle - y4Old * sinAngle;
  const y4 = x4Old * sinAngle + y4Old * cosAngle;

  x1 += centerX;
  y1 += centerY;
  const x2Final = x2 + x1;
  const y2Final = y2 + y1;
  const x3Final = x3 + x1;
  const y3Final = y3 + y1;
  const x4Final = x4 + x1;
  const y4Final = y4 + y1;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(x3Final, y3Final, x2Final, y2Final);

  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(x4Final, y4Final, x2Final, y2Final);
  ctx.fillStyle = colour;
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();
}

function drawEyelidAccident(x1, y1) {
  let leafWidth = 120;
  let leafHeight = 60;
  x1 -= centerX;
  y1 -= centerY;
  let angle = Math.atan(y1 / x1);
  // if(angle >=Math.PI){
  //     angle -=Math.PI
  //     console.log("greater called")
  // }
  angle = Math.abs(angle);
  let x2Old = 0 + leafWidth;
  let y2Old = 0;

  let x3Old = 0 + leafWidth / 2;
  let y3Old = 0 + leafHeight / 2;

  let x4Old = 0 + leafWidth / 2;
  let y4Old = 0 - leafHeight / 2;

  let x2 = x2Old * Math.cos(angle) - y2Old * Math.sin(angle);
  let y2 = x2Old * Math.sin(angle) + y2Old * Math.cos(angle);

  let x3 = x3Old * Math.cos(angle) - y3Old * Math.sin(angle);
  let y3 = x3Old * Math.sin(angle) + y3Old * Math.cos(angle);

  let x4 = x4Old * Math.cos(angle) - y4Old * Math.sin(angle);
  let y4 = x4Old * Math.sin(angle) + y4Old * Math.cos(angle);

  let oldx1 = x1;
  let oldy1 = y1;

  x1 += centerX; // +x2/2
  y1 += centerY; // +x2/2
  x2 += x1;
  y2 += y1;
  x3 += x1;
  y3 += y1;
  x4 += x1;
  y4 += y1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(x3, y3, x2, y2);

  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(x4, y4, x2, y2);
  ctx.fillStyle = "black";
  ctx.fill();

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(x3, y3, x2, y2);

  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(x4, y4, x2, y2);
  ctx.strokeStyle = "orange";
  ctx.stroke();
}

function DrawPolygon(sides, width, rotation, colour) {
  ctx.beginPath();
  ctx.moveTo(
    centerX + width * Math.cos((rotation * Math.PI) / 180),
    centerY + width * Math.sin((rotation * Math.PI) / 180)
  );

  for (var i = 1; i <= sides; i += 1) {
    ctx.lineTo(
      centerX +
      width *
      Math.cos((i * 2 * Math.PI) / sides + (rotation * Math.PI) / 180),
      centerY +
      width * Math.sin((i * 2 * Math.PI) / sides + (rotation * Math.PI) / 180)
    );
  }
  ctx.strokeStyle = colour;
  ctx.lineWidth = 3;
  ctx.stroke();
}

function rad(degrees) {
  return (degrees * Math.PI) / 180;
}

function colourToText(colour) {
  return "rgb(" + colour[0] + "," + colour[1] + "," + colour[2] + ")";
}

function LerpHex(a, b, amount) {
  var ah = parseInt(a.replace(/#/g, ""), 16),
    ar = ah >> 16,
    ag = (ah >> 8) & 0xff,
    ab = ah & 0xff,
    bh = parseInt(b.replace(/#/g, ""), 16),
    br = bh >> 16,
    bg = (bh >> 8) & 0xff,
    bb = bh & 0xff,
    rr = ar + amount * (br - ar),
    rg = ag + amount * (bg - ag),
    rb = ab + amount * (bb - ab);

  return (
    "#" + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)
  );
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

function render_clear() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
