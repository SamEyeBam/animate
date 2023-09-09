class BaseShape {
  constructor() {
    this.controls = []; // Keep track of created elements and event listeners
    this.speedMultiplier = 100;
  }

  initialise(config) {
    for (let item of config) {
      const { element, listener } = addControl(item, this);
      this.controls.push({ element, listener });
    }

    const { element, listener } = addControl({ type: "range", min: 1, max: 500, defaultValue: 100, property: "speedMultiplier", }, this);
    this.controls.push({ element, listener });
  }

  remove() {
    this.controls.forEach(({ element, listener }) => {
      if (element && listener) {
        element.removeEventListener("input", listener);
      }
      if (element && element.parentElement) {
        element.parentElement.removeChild(element);
        const titleElement = document.getElementById("elText" + element.id.slice(2));
        titleElement.parentElement.removeChild(titleElement);
      }
    });
    this.controls = [];
  }

  draw() {
    throw new Error("Draw function not implemented");
  }
}

class PolyTwistColourWidth extends BaseShape {
  constructor(sides, width, line_width, depth, rotation, speedMultiplier, colour1, colour2) {
    super();
    this.sides = sides;
    this.width = width;
    this.line_width = line_width;
    this.depth = depth;
    this.rotation = rotation;
    this.speedMultiplier = speedMultiplier;
    this.colour1 = colour1;
    this.colour2 = colour2;
  }

  draw(rotation) {
    rotation *= (this.speedMultiplier / 100)
    let out_angle = 0;
    const innerAngle = 180 - ((this.sides - 2) * 180) / this.sides;
    const scopeAngle = rotation - (innerAngle * Math.floor(rotation / innerAngle));

    if (scopeAngle < innerAngle / 2) {
      out_angle = innerAngle / (2 * Math.cos((2 * Math.PI * scopeAngle) / (3 * innerAngle))) - innerAngle / 2;
    } else {
      out_angle = -innerAngle / (2 * Math.cos(((2 * Math.PI) / 3) - ((2 * Math.PI * scopeAngle) / (3 * innerAngle)))) + (innerAngle * 3) / 2;
    }
    let minWidth = Math.sin(rad(innerAngle / 2)) * (0.5 / Math.tan(rad(innerAngle / 2))) * 2;

    let widthMultiplier = minWidth / Math.sin(Math.PI / 180 * (90 + innerAngle / 2 - out_angle + innerAngle * Math.floor(out_angle / innerAngle)));

    for (let i = 0; i < this.depth; i++) {
      const fraction = i / this.depth;
      const ncolour = LerpHex(this.colour1, this.colour2, fraction);
      DrawPolygon(this.sides, this.width * widthMultiplier ** i, out_angle * i + this.rotation, ncolour, this.line_width);
    }
  }
}
class FloralPhyllo extends BaseShape {
  constructor(width, depth, start, colour1, colour2) {
    super();
    this.width = width;
    this.depth = depth;
    this.start = start;
    this.colour1 = colour1;
    this.colour2 = colour2;
    this.speedMultiplier = 500;
  }

  draw(rotation) {
    rotation *= (this.speedMultiplier / 500)
    rotation += this.start
    // var c = 24; //something to do with width. but not width
    var c = 1; //something to do with width. but not width
    //dont make larger than 270 unless altering the number of colours in lerpedColours
    for (let n = this.depth; n > 0; n -= 1) {
      let colVal = waveNormal(n, this.depth)
      let ncolour = LerpHex(this.colour1, this.colour2, n / this.depth);
      const a = n * rotation / 1000; //137.5;
      const r = c * Math.sqrt(n);
      const x = r * Math.cos(a) + centerX;
      const y = r * Math.sin(a) + centerY;

      drawEyelid(n * 2.4 + 40, x, y, ncolour);
    }
  }
}
class Spiral1 extends BaseShape {
  constructor(sides, width, colour) {
    super();
    this.sides = sides;
    this.width = width;
    this.colour = colour;
  }

  draw(rotation) {
    rotation *= (this.speedMultiplier / 100)
    var rot = Math.round((this.sides - 2) * 180 / this.sides * 2)
    var piv = 360 / this.sides;
    var stt = 0.5 * Math.PI - rad(rot) //+ rad(rotation);
    var end = 0;
    var n = this.width / ((this.width / 10) * (this.width / 10)) //pixel correction for mid leaf

    for (let i = 1; i < this.sides + 1; i++) {
      end = stt + rad(rot);
      ctx.lineWidth = 5
      ctx.beginPath();
      ctx.arc(centerX + Math.cos(rad(90 + piv * i + rotation)) * this.width, centerY + Math.sin(rad(90 + piv * i + rotation)) * this.width, this.width, stt + rad(rotation) - (stt - end) / 2, end + rad(rotation) + rad(n), 0);
      ctx.strokeStyle = this.colour;
      ctx.stroke();


      ctx.beginPath();
      ctx.arc(centerX + Math.cos(rad(90 + piv * i - rotation)) * this.width, centerY + Math.sin(rad(90 + piv * i - rotation)) * this.width, this.width, stt - rad(rotation), end - (end - stt) / 2 + rad(n) - rad(rotation), 0);
      ctx.strokeStyle = this.colour;
      ctx.stroke();


      stt = end + -(rad(rot - piv)) //+rad(30);
    }

  }
}

class FloralAccident extends BaseShape {
  constructor(sides, width, colour) {
    super();
    this.sides = sides;
    this.width = width;
    this.colour = colour;
  }

  draw(rotation) {
    rotation *= (this.speedMultiplier / 100)
    var rot = Math.round((this.sides - 2) * 180 / this.sides * 2)
    var piv = 360 / this.sides;
    var stt = 0.5 * Math.PI - rad(rot) //+ rad(rotation);
    var end = 0;
    var n = this.width / ((this.width / 10) * (this.width / 10)) //pixel correction for mid leaf

    for (let i = 1; i < this.sides + 1; i++) {
      end = stt + rad(rot);

      ctx.beginPath();
      ctx.arc(centerX + Math.cos(rad(90 + piv * i + rotation)) * this.width, centerY + Math.sin(rad(90 + piv * i + rotation)) * this.width, this.width, stt - (stt - end + rad(rotation)) / 2, end + rad(n), 0);
      ctx.strokeStyle = this.colour;
      ctx.stroke();


      ctx.beginPath();
      ctx.arc(centerX + Math.cos(rad(90 + piv * i - rotation)) * this.width, centerY + Math.sin(rad(90 + piv * i - rotation)) * this.width, this.width, stt, end - (end - stt - rad(rotation)) / 2 + rad(n), 0);
      ctx.strokeStyle = this.colour;
      ctx.stroke();


      stt = end + -(rad(rot - piv)) //+rad(30);
    }

  }
}
class FloralPhyllo_Accident extends BaseShape {
  constructor(sides, width, colour1, colour2) {
    super();
    this.sides = sides;
    this.width = width;
    this.colour1 = colour1;
    this.colour2 = colour2;
  }

  draw(rotation) {
    rotation *= (this.speedMultiplier / 100)
    var c = 24; //something to do with width. but not width

    for (let n = 0; n < 300; n += 1) {
      let ncolour = LerpHex(this.colour1, this.colour2, Math.cos(rad(n / 2)));
      let a = n * (rotation / 1000 + 100); //137.5;
      let r = c * Math.sqrt(n);
      let x = r * Math.cos(a) + centerX;
      let y = r * Math.sin(a) + centerY;

      drawEyelidAccident(x, y);

    }
  }
}
class Nodal_expanding extends BaseShape {
  constructor(expand, points, start, line_width, colour1, colour2, colour_change) {
    super();
    this.expand = expand;
    this.points = points;
    this.start = start;
    this.line_width = line_width;
    this.colour1 = colour1;
    this.colour2 = colour2;
    this.colour_change = colour_change
  }

  draw(rotation) {
    rotation *= (this.speedMultiplier / 1000)
    var angle = (360 / 3000 * rotation) + this.start //2000 controls speed

    var length = this.expand;

    for (let z = 1; z <= this.points; z++) { //why specifically 2500
      ctx.beginPath();
      let ncolour = LerpHex(this.colour1, this.colour2, z / this.points);

      ctx.moveTo(centerX + (Math.cos(rad(angle * (z - 1) + 0)) * (length - this.expand)), centerY + (Math.sin(rad(angle * (z - 1) + 0)) * (length - this.expand)));
      ctx.lineTo(centerX + (Math.cos(rad(angle * z + 0)) * length), centerY + (Math.sin(rad(angle * z + 0)) * length));
      length += this.expand;
      ctx.lineWidth = this.line_width;//try 1
      ctx.strokeStyle = ncolour;
      ctx.lineCap = "round"
      // ctx.strokeStyle = colourToText(ncolour);
      console.log(ncolour)
      ctx.stroke();
    }


  }
}
class Phyllotaxis extends BaseShape {
  constructor(width, start, nMax, wave, colour1, colour2) {
    super();
    this.width = width;
    this.start = start;
    this.nMax = nMax;
    this.wave = wave;
    this.colour1 = colour1;
    this.colour2 = colour2;
  }
  drawWave(angle) {
    angle /= 1000
    const startColor = [45, 129, 252];
    const endColor = [252, 3, 98];
    const distanceMultiplier = 3;
    const maxIterations = 200;
    //   angle=0;
    for (let n = 0; n < maxIterations; n++) {
      ctx.beginPath();
      const nColor = lerpRGB(startColor, endColor, Math.cos(rad(n / 2)));

      // const nAngle = n* angle ;
      // const nAngle = n*angle+ Math.sin(rad(n*1+angle*4000))/1 ;
      const nAngle = n * angle + Math.sin(rad(n * 1 + angle * 40000)) / 2;
      const radius = distanceMultiplier * n;
      const xCoord = radius * Math.cos(nAngle) + centerX;
      const yCoord = radius * Math.sin(nAngle) + centerY;
      ctx.arc(xCoord, yCoord, 8, 0, 2 * Math.PI);
      ctx.fillStyle = colourToText(nColor);
      ctx.fill();
    }
  }
  drawSpiral(angle) {
    angle /= 5000
    const startColor = [45, 129, 252];
    const endColor = [252, 3, 98];
    const distanceMultiplier = 2;
    const maxIterations = 1000;


    for (let n = 0; n < maxIterations; n++) {
      const nColor = lerpRGB(startColor, endColor, Math.cos(rad(n / 2)));

      const nAngle = n * angle + Math.sin(angle * n * 2);
      const radius = distanceMultiplier * n;
      const xCoord = radius * Math.cos(nAngle) + centerX;
      const yCoord = radius * Math.sin(nAngle) + centerY;

      ctx.beginPath();
      ctx.arc(xCoord, yCoord, 8, 0, 2 * Math.PI);
      ctx.fillStyle = colourToText(nColor);
      ctx.fill();
    }
  }

  // Draw_nodal(300, 100, 31, rotation, "blue");
  draw(rotation) {
    rotation *= (this.speedMultiplier / 300)
    rotation += this.start
    const sizeMultiplier = this.nMax/(5-3)
    if (this.wave === 1) {
      this.drawWave(rotation)
    }
    else if (this.wave === 2) {
      this.drawSpiral(rotation)
    }
    else {
      for (let n = 0; n < this.nMax; n += 1) {
        const ncolour = LerpHex(this.colour1, this.colour2, n / this.nMax);
        // const ncolour = LerpHex(this.colour1, this.colour2, (n/this.nMax)**2);
        const a = n * (rotation / 1000)//137.5;
        const r = this.width * Math.sqrt(n);
        const x = r * Math.cos(a) + centerX;
        const y = r * Math.sin(a) + centerY;

        ctx.beginPath();
        ctx.arc(x, y, (n/sizeMultiplier)+3, 0, 2 * Math.PI);
        ctx.fillStyle = ncolour;
        // ctx.fillStyle = colourToText(ncolour);
        ctx.fill();
        // console.log(this.c)
      }
    }
  }
}
class SquareTwist_angle extends BaseShape {
  constructor(width, line_width, colour1) {
    super();
    this.width = width;
    this.line_width = line_width;
    this.colour1 = colour1;
  }
  drawSquare(angle, size, colour) {
    ctx.save();
    ctx.translate(centerX, centerY)//-(Math.sin(rad(angle)) *centerX));
    ctx.rotate(rad(angle + 180));
    ctx.beginPath();
    ctx.strokeStyle = colour;
    ctx.lineWidth = this.line_width;
    ctx.rect(-size / 2, -size / 2, size, size);
    ctx.stroke();
    ctx.restore();
  }
  // DrawSquareTwist_angle(400,0,rotation,"red")
  draw(rotation) {
    rotation *= (this.speedMultiplier / 100)
    let out_angle = rotation;
    let widthMultiplier = 1 / (2 * Math.sin(Math.PI / 180 * (130 - out_angle + 90 * Math.floor(out_angle / 90)))) + 0.5

    for (let i = 0; i < 25; i++) {
      this.drawSquare(rotation * i, this.width * widthMultiplier ** i, this.colour1)
    }

  }
}

class CircleExpand extends BaseShape {
  constructor(nCircles, gap, linear, heart, colour1, colour2) {
    super();
    this.nCircles = nCircles;
    this.gap = gap;
    this.linear = linear;
    this.heart = heart;
    this.colour1 = colour1;
    this.colour2 = colour2
  }
  lerpColor(a, b, amount) {
    var ah = +a.replace('#', '0x'),
      ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
      bh = +b.replace('#', '0x'),
      br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
      rr = ar + amount * (br - ar),
      rg = ag + amount * (bg - ag),
      rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
  }

  arraySort(x, y) {
    if (x.r > y.r) {
      return 1;
    }
    if (x.r < y.r) {
      return -1;
    }
    return 0;
  }
  drawHeart(w, colour) {
    // var w = 200
    ctx.strokeStyle = "black";
    ctx.fillStyle = colour;
    ctx.lineWidth = 1;
    var x = centerX - w / 2;
    let y = centerY - w / 2
    ctx.beginPath();
    ctx.moveTo(x, y + w / 4);
    ctx.quadraticCurveTo(x, y, x + w / 4, y);
    ctx.quadraticCurveTo(x + w / 2, y, x + w / 2, y + w / 5);
    ctx.quadraticCurveTo(x + w / 2, y, x + w * 3 / 4, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + w / 4);
    ctx.quadraticCurveTo(x + w, y + w / 2, x + w * 3 / 4, y + w * 3 / 4);
    ctx.lineTo(x + w / 2, y + w);
    ctx.lineTo(x + w / 4, y + w * 3 / 4);
    ctx.quadraticCurveTo(x, y + w / 2, x, y + w / 4);
    ctx.stroke();
    ctx.fill();
  }

  draw(rotation) {
    rotation *= (0.9)
    ctx.strokeWeight = 1;
    ctx.lineWidth = 1;
    let arrOfWidths = []
    let arrOfco = []
    let intRot;
    if (this.linear) {
      intRot = Math.floor(rotation * 30) / 100
    }
    else {
      intRot = Math.sin(rad(Math.floor(rotation * 30) / 4)) + rotation / 4
    }

    for (let i = 0; i < this.nCircles; i++) {
      const width = this.gap * ((intRot + i) % this.nCircles);
      const colour = (Math.sin(rad(i * (360 / this.nCircles) - 90)) + 1) / 2
      arrOfWidths.push({ r: width, c: colour });
    }

    let newArr = arrOfWidths.sort(this.arraySort)

    for (let i = this.nCircles - 1; i >= 0; i--) {
      let newColour = this.lerpColor(this.colour1, this.colour2, newArr[i].c)

      if (this.heart) {
        this.drawHeart(newArr[i].r, newColour)
      }
      else {
        ctx.beginPath();
        ctx.arc(centerX, centerY, newArr[i].r, 0, 2 * Math.PI);
        ctx.fillStyle = newColour;
        ctx.fill();
        ctx.stokeStyle = "black";
        ctx.stroke();

      }
    }

  }
}


class EyePrototype extends BaseShape {
  constructor(x, y, rotate, flip, width, blink_speed, draw_spiral, spiral_full, draw_pupil, draw_expand, draw_hypno, line_width, colourPupil, colourSpiral, colourExpand) {
    super();
    this.x = x;
    this.y = y;
    this.rotate = rotate;
    this.flip = flip
    this.width = width;
    this.blink_speed = blink_speed;
    this.line_width = line_width;
    this.step = 0;
    this.opening = true;
    this.counter = 0;
    this.cooldown = 0;
    this.draw_spiral = draw_spiral;
    this.spiral_full = spiral_full;
    this.draw_pupil = draw_pupil;
    this.draw_expand = draw_expand;
    this.draw_hypno = draw_hypno;
    this.colourPupil = colourPupil;
    this.colourSpiral = colourSpiral;
    this.colourExpand = colourExpand;
    this.centerPulse = new CircleExpand(10, 30, 1, 0, "#2D81FC", "#FC0362")
  }
  drawEyelid(rotation) {
    ctx.strokeStyle = "orange";
    let relCenterX = centerX + this.x;
    let relCenterY = centerY + this.y;
    rotation *= (this.speedMultiplier / 100)
    ctx.lineWidth = 1;
    ctx.beginPath();
    let newPoint = 0
    let newPoint1 = 0
    let addedRotate = this.flip ? 90 : 0
    newPoint = rotatePoint(- this.width / 2, 0, this.rotate + addedRotate)
    ctx.moveTo(relCenterX + newPoint[0], relCenterY + newPoint[1]);
    newPoint = rotatePoint(0, - rotation / 400 * this.width, this.rotate + addedRotate)
    newPoint1 = rotatePoint(this.width / 2, 0, this.rotate + addedRotate)
    ctx.quadraticCurveTo(relCenterX + newPoint[0], relCenterY + newPoint[1], relCenterX + newPoint1[0], relCenterY + newPoint1[1]);

    newPoint = rotatePoint(- this.width / 2, 0, this.rotate + addedRotate)
    ctx.moveTo(relCenterX + newPoint[0], relCenterY + newPoint[1]);
    newPoint = rotatePoint(0, + rotation / 400 * this.width, this.rotate + addedRotate)
    newPoint1 = rotatePoint(this.width / 2, 0, this.rotate + addedRotate)
    ctx.quadraticCurveTo(relCenterX + newPoint[0], relCenterY + newPoint[1], relCenterX + newPoint1[0], relCenterY + newPoint1[1]);
    ctx.stroke();
  }
  eyelidCut(rotation) {
    let relCenterX = centerX + this.x;
    let relCenterY = centerY + this.y;
    let newPoint = 0
    let newPoint1 = 0
    let addedRotate = this.flip ? 90 : 0
    // ctx.lineWidth = 1;
    let squarePath = new Path2D();
    newPoint = rotatePoint(- this.width / 2, 0, this.rotate + addedRotate)
    squarePath.moveTo(relCenterX + newPoint[0], relCenterY + newPoint[1]);
    newPoint = rotatePoint(0, - rotation / 400 * this.width, this.rotate + addedRotate)
    newPoint1 = rotatePoint(this.width / 2, 0, this.rotate + addedRotate)
    squarePath.quadraticCurveTo(relCenterX + newPoint[0], relCenterY + newPoint[1], relCenterX + newPoint1[0], relCenterY + newPoint1[1]);

    newPoint = rotatePoint(- this.width / 2, 0, this.rotate + addedRotate)
    squarePath.moveTo(relCenterX + newPoint[0], relCenterY + newPoint[1]);
    newPoint = rotatePoint(0, + rotation / 400 * this.width, this.rotate + addedRotate)
    newPoint1 = rotatePoint(this.width / 2, 0, this.rotate + addedRotate)
    squarePath.quadraticCurveTo(relCenterX + newPoint[0], relCenterY + newPoint[1], relCenterX + newPoint1[0], relCenterY + newPoint1[1]);

    ctx.clip(squarePath);
  }
  drawGrowEye(step) {
    // console.log(step)
    ctx.strokeStyle = this.colourExpand
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.arc(centerX + this.x, centerY + this.y, step, 0, 2 * Math.PI);
    ctx.stroke();
  }
  drawCircle(step) {
    ctx.strokeStyle = this.colourPupil
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.arc(centerX + this.x, centerY + this.y, step, 0, 2 * Math.PI);
    ctx.stroke();
  }

  drawSpiral(step) {
    ctx.strokeStyle = this.colourSpiral;
    let a = 1
    let b = 5
    ctx.moveTo(centerX, centerY);
    ctx.beginPath();
    let max = this.spiral_full ? this.width : this.width / 2
    for (let i = 0; i < max; i++) {
      let angle = 0.1 * i;
      let x = centerX + (a + b * angle) * Math.cos(angle + step / 2);
      let y = centerY + (a + b * angle) * Math.sin(angle + step / 2);

      ctx.lineTo(x + this.x, y + this.y);
    }
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  stepFunc() {
    if (this.cooldown != 0) {
      this.cooldown--;
    } else {
      if (this.opening == true) {
        if (this.step >= 200) {
          this.cooldown = 200;
          this.opening = false;
          this.step -= this.blink_speed;
        } else {
          this.step += this.blink_speed;
        }
      } else {
        if (this.step <= 0) {
          this.opening = true;
          this.step += this.blink_speed;
        } else {
          this.step -= this.blink_speed;
        }
      }
    }
  }

  draw(rotation) {
    let speedMult = 50
    console.log(this.blink_speed)
    let waitTime = this.blink_speed
    let cap = 200
    let d = waitTime * speedMult * 10
    let a = cap * 2 + d
    let outputRotation = Math.min(Math.abs((Math.floor(rotation * speedMult) % a) - a / 2 - d / 2), cap)

    ctx.fillStyle = "black";
    ctx.save();
    this.drawEyelid(outputRotation);
    // squareCut();
    this.eyelidCut(outputRotation);
    // console.log(Math.floor(this.counter % this.width / 2))
    if (Math.floor(this.counter % (this.width / 4)) === 0) {
      this.counter = 0;
    }
    ctx.fillStyle = "black";
    ctx.fillRect(this.x - this.width / 2 + centerX, 0, this.width, ctx.canvas.height);
    if (this.draw_expand) {
      this.drawGrowEye(this.width / 4 + this.counter);
    }

    if (this.draw_hypno) {
      this.centerPulse.draw(rotation)
    }
    if (this.draw_spiral) {
      this.drawSpiral(rotation)
    }
    if (this.draw_pupil) {
      this.drawCircle(this.width / 4);
    }

    ctx.restore();

    this.stepFunc();
    this.counter++;
  }
}
class MaryFace extends BaseShape {
  constructor(x1, y1, rotate1, width1, x2, y2, rotate2, width2) {
    super();
    this.x1 = x1;
    this.y1 = y1;
    this.rotate1 = rotate1;
    this.width1 = width1;
    this.x2 = x2;
    this.y2 = y2;
    this.rotate2 = rotate2;
    this.width2 = width2;
    this.eye1 = new EyePrototype(x1, y1, rotate1, 0, width1, 10, 1, 1, 0, 0, 0, 1, "#00fffb", "#00fffb", "#00fffb")
    this.eye2 = new EyePrototype(x2, y2, rotate2, 0, width2, 10, 1, 1, 0, 0, 0, 1, "#00fffb", "#00fffb", "#00fffb")
    // this.eye3 = new EyePrototype(112, -280, rotate2+2,1, width2, 10, 1, 1, 0, 0, 1, "#00fffb", "#00fffb", "#00fffb")
    this.eye3 = new EyePrototype(110, -280, rotate2 + 2, 1, width2, 10, 1, 1, 0, 0, 0, 1, "#00fffb", "#00fffb", "#00fffb")//maybe
  }

  draw(rotation) {
    let img = new Image();
    img.src = "maryFace.png";

    ctx.drawImage(img, centerX - img.width / 2, centerY - img.height / 2);
    this.eye1.draw(rotation);
    this.eye2.draw(rotation);
    this.eye3.draw(rotation);
  }
}

