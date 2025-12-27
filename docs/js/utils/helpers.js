/**
 * Drawing utility functions for the animation framework
 * These are pure functions used by shapes for rendering
 */

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function rad(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert RGB array to CSS color string
 * @param {number[]} colour - Array of [r, g, b] values
 * @returns {string} CSS color string
 */
function colourToText(colour) {
  return "rgb(" + colour[0] + "," + colour[1] + "," + colour[2] + ")";
}

/**
 * Convert hex color to RGB object
 * @param {string} hex - Hex color string (e.g., '#ff0000')
 * @returns {{r: number, g: number, b: number}|null} RGB object or null
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Linear interpolation between two hex colors
 * @param {string} a - Start hex color
 * @param {string} b - End hex color
 * @param {number} amount - Interpolation amount (0-1)
 * @returns {string} Interpolated hex color
 */
function LerpHex(a, b, amount) {
  const ah = parseInt(a.replace(/#/g, ""), 16);
  const ar = ah >> 16;
  const ag = (ah >> 8) & 0xff;
  const ab = ah & 0xff;
  const bh = parseInt(b.replace(/#/g, ""), 16);
  const br = bh >> 16;
  const bg = (bh >> 8) & 0xff;
  const bb = bh & 0xff;
  const rr = ar + amount * (br - ar);
  const rg = ag + amount * (bg - ag);
  const rb = ab + amount * (bb - ab);

  return "#" + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1);
}

/**
 * Linear interpolation between two RGB arrays
 * @param {number[]} a - Start RGB array [r, g, b]
 * @param {number[]} b - End RGB array [r, g, b]
 * @param {number} t - Interpolation amount (0-1)
 * @returns {number[]} Interpolated RGB array
 */
function lerpRGB(a, b, t) {
  const result = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    result[i] = (1 - t) * a[i] + t * b[i];
  }
  return result;
}

/**
 * Legacy LerpRGB function (handles negative t)
 * @param {number[]} a - Start RGB array
 * @param {number[]} b - End RGB array  
 * @param {number} t - Interpolation amount
 * @returns {number[]} Interpolated RGB array
 */
function LerpRGB(a, b, t) {
  if (t < 0) {
    t *= -1;
  }
  const newColor = [0, 0, 0];
  newColor[0] = a[0] + (b[0] - a[0]) * t;
  newColor[1] = a[1] + (b[1] - a[1]) * t;
  newColor[2] = a[2] + (b[2] - a[2]) * t;
  return newColor;
}

/**
 * Generate a wave-normalized value (0-1 range using sine)
 * @param {number} x - Current position
 * @param {number} max - Maximum position
 * @returns {number} Normalized value (0-1)
 */
function waveNormal(x, max) {
  return Math.sin((x / max) * Math.PI * 2 - max * (Math.PI / (max * 2))) / 2 + 0.5;
}

/**
 * Rotate a point around origin
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} rotation - Rotation angle in degrees
 * @returns {number[]} Rotated [x, y] coordinates
 */
function rotatePoint(x, y, rotation) {
  const nCos = Math.cos(rad(rotation));
  const nSin = Math.sin(rad(rotation));
  const newX = x * nCos - y * nSin;
  const newY = y * nCos + x * nSin;
  return [newX, newY];
}

/**
 * Draw a regular polygon
 * @param {number} sides - Number of sides
 * @param {number} width - Radius of polygon
 * @param {number} rotation - Rotation in degrees
 * @param {string} colour - Stroke color
 * @param {number} line_width - Line width
 */
function DrawPolygon(sides, width, rotation, colour, line_width) {
  ctx.beginPath();
  ctx.moveTo(
    centerX + width * Math.cos((rotation * Math.PI) / 180),
    centerY + width * Math.sin((rotation * Math.PI) / 180)
  );

  for (let i = 1; i <= sides; i += 1) {
    ctx.lineTo(
      centerX + width * Math.cos((i * 2 * Math.PI) / sides + (rotation * Math.PI) / 180),
      centerY + width * Math.sin((i * 2 * Math.PI) / sides + (rotation * Math.PI) / 180)
    );
  }
  ctx.strokeStyle = colour;
  ctx.lineWidth = line_width;
  ctx.stroke();
}

/**
 * Draw an eyelid shape
 * @param {number} width - Width of the eyelid
 * @param {number} x1 - X position
 * @param {number} y1 - Y position
 * @param {string} colour - Fill color
 */
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

/**
 * Draw an accident-style eyelid shape
 * @param {number} x1 - X position
 * @param {number} y1 - Y position
 */
function drawEyelidAccident(x1, y1) {
  const leafWidth = 120;
  const leafHeight = 60;
  x1 -= centerX;
  y1 -= centerY;
  let angle = Math.atan(y1 / x1);
  angle = Math.abs(angle);

  const x2Old = leafWidth;
  const y2Old = 0;
  const x3Old = leafWidth / 2;
  const y3Old = leafHeight / 2;
  const x4Old = leafWidth / 2;
  const y4Old = -leafHeight / 2;

  const x2 = x2Old * Math.cos(angle) - y2Old * Math.sin(angle);
  const y2 = x2Old * Math.sin(angle) + y2Old * Math.cos(angle);
  const x3 = x3Old * Math.cos(angle) - y3Old * Math.sin(angle);
  const y3 = x3Old * Math.sin(angle) + y3Old * Math.cos(angle);
  const x4 = x4Old * Math.cos(angle) - y4Old * Math.sin(angle);
  const y4 = x4Old * Math.sin(angle) + y4Old * Math.cos(angle);

  x1 += centerX;
  y1 += centerY;
  const x2f = x2 + x1;
  const y2f = y2 + y1;
  const x3f = x3 + x1;
  const y3f = y3 + y1;
  const x4f = x4 + x1;
  const y4f = y4 + y1;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(x3f, y3f, x2f, y2f);
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(x4f, y4f, x2f, y2f);
  ctx.fillStyle = "black";
  ctx.fill();

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(x3f, y3f, x2f, y2f);
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(x4f, y4f, x2f, y2f);
  ctx.strokeStyle = "orange";
  ctx.stroke();
}

/**
 * Clear the canvas and fill with black
 */
function render_clear() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * Draw crosshairs at center (for debugging)
 * @param {number} width - Length of crosshair lines
 */
function drawCenter(width) {
  ctx.strokeStyle = "pink";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - width, centerY);
  ctx.lineTo(centerX + width, centerY);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - width);
  ctx.lineTo(centerX, centerY + width);
  ctx.closePath();
  ctx.stroke();
}

/**
 * Update a control input's displayed value
 * @param {number} value - New value
 * @param {string} controlName - Name of the control property
 */
function updateControlInput(value, controlName) {
  const elementSlider = document.querySelector('input[type="range"][id="el' + controlName + '"]');
  if (elementSlider) {
    elementSlider.value = value;
    const elementSliderText = document.getElementById(`elText${controlName}`);
    if (elementSliderText) {
      elementSliderText.innerText = `${controlName}: ${Math.round(value)}`;
    }
  }
}
