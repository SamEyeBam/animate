class BaseShape {
  constructor() {
    this.controls = []; // Keep track of created elements and event listeners
    this.speedMultiplier = 100;
  }

  initialise(config) {
    for (let item of config) {
      const { element, listener, filtersDiv } = addControl(item, this);
      this.controls.push({ element, listener, });

      if (item.type === "range" && item.property !== "rays") {
        // Initialize rangeFilter array for this control
        const controlIndex = this.controls.length - 1;
        this.controls[controlIndex].rangeFilters = [];

        let addFilterButton = document.createElement("button");
        addFilterButton.innerText = "Add Filter";
        addFilterButton.className = "add-filter-button";

        // Store the control index in the click handler closure
        addFilterButton.addEventListener("click", () => {
          const { filterDiv, eventListener, min, max, rate } = createFilter(item);
          filtersDiv.appendChild(filterDiv);

          // Use the stored control index
          if (this.controls[controlIndex] && this.controls[controlIndex].rangeFilters) {
            this.controls[controlIndex].rangeFilters.push({
              element: filterDiv,
              listener: eventListener,
              min: min,
              max: max,
              rate: rate,
            });
          } else {
            console.error("Control or rangeFilters not found for index:", controlIndex);
          }
        });

        filtersDiv.appendChild(addFilterButton);
      }
    }

    const { element, listener } = addControl({ type: "range", min: 1, max: 500, defaultValue: 100, property: "speedMultiplier" }, this);
    this.controls.push({ element, listener });
  }

  remove() {
    this.controls.forEach(({ element, listener }) => {
      if (element && listener) {
        element.removeEventListener("input", listener);
        element.removeEventListener("click", listener);
        element.removeEventListener("change", listener);
      }
      else {
        console.log("Element or listener not found for removal:", element, listener);
      }

      // Find and remove the container div instead of individual elements
      if (element && element.id) {
        // Handle header elements which don't have container
        if (element.className === "header") {
          if (element.parentElement) {
            element.parentElement.removeChild(element);
          }
        } else {
          // For regular controls, find and remove the container
          const containerDiv = element.closest(".control-container");
          if (containerDiv && containerDiv.parentElement) {
            containerDiv.parentElement.removeChild(containerDiv);
          }
        }
      }
    });
    this.controls = [];
  }

  updateFilters(elapsed) {
    for (let i = 0; i < this.controls.length; i++) {
      const control = this.controls[i];

      if (control.rangeFilters?.length > 0) {
        let newValue = 0;
        for (let j = 0; j < control.rangeFilters.length; j++) {
          const filter = control.rangeFilters[j];
          // const value = parseFloat(filter.element.value);
          const min = parseFloat(filter.min.value);
          const max = parseFloat(filter.max.value);
          const rate = parseFloat(filter.rate.value);

          const halfRange = (max - min) / 2;
          const filterValue = min + halfRange + Math.sin(elapsed * (1 / rate)) * halfRange; // Calculate the new value based on the range

          if (filterValue >= min && filterValue <= max) {
            // console.log(newValue, min, max)
            newValue += filterValue;
            console.log("New Value:", newValue, filterValue, min, max);
          }
        }

        control.element.value = newValue;
        const event = new Event('input', { bubbles: true });
        control.element.dispatchEvent(event);

      }
    }
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
    const sizeMultiplier = this.nMax / (5 - 3)
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
        ctx.arc(x, y, (n / sizeMultiplier) + 3, 0, 2 * Math.PI);
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
class NewWave extends BaseShape {
  constructor(width, sides, step, lineWidth, limiter) {
    super();
    this.width = width
    this.sides = sides;
    this.step = step;
    this.lineWidth = lineWidth;
    this.limiter = limiter;
  }

  draw(rotation) {
    rotation *= this.speedMultiplier / 400
    this.updateFilters(rotation);
    ctx.lineWidth = this.lineWidth
    for (let j = 0; j < this.sides; j++) {
      const radRotation = rad(360 / this.sides * j)
      const inverter = 1 - (j % 2) * 2
      let lastX = centerX
      let lastY = centerY
      for (let i = 0; i < this.width; i += this.step) {

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.strokeStyle = colourToText(lerpRGB([255, 51, 170], [51, 170, 255], i / this.width))
        const x = i
        const y = (Math.sin(-i * inverter / 30 + rotation * inverter) * i / (this.limiter / 100))

        const xRotated = x * Math.cos(radRotation) - y * Math.sin(radRotation)
        const yRotated = x * Math.sin(radRotation) + y * Math.cos(radRotation)
        lastX = centerX + xRotated;
        lastY = centerY + yRotated;
        ctx.lineTo(centerX + xRotated, centerY + yRotated);
        ctx.stroke();
      }
    }

  }
}

class Countdown extends BaseShape {
  constructor() {
    super();
    this.width;
    this.sides;
  }

  secondsUntilDate(targetDate) {
    const now = new Date();
    const target = new Date(targetDate);
    const difference = target.getTime() - now.getTime();
    return Math.round(difference / 1000);
  }

  drawProgressBar(progress) {
    const colourBackground = "#0c2f69";
    const colourProgress = "#4287f5";
    const barWidth = ctx.canvas.width;
    const barHeight = 60;
    // const barX = centerX - barWidth / 2;
    const barX = 0;
    // const barY = centerY + 350 - barHeight / 2;
    const barY = ctx.canvas.height - barHeight;

    ctx.fillStyle = colourBackground;
    ctx.beginPath();
    ctx.rect(barX, barY, barWidth, barHeight)
    ctx.fill();

    ctx.fillStyle = colourProgress;
    ctx.beginPath();
    ctx.rect(barX, barY, (barWidth / 100) * progress, barHeight)
    ctx.fill();
  }

  draw(elapsedTime) {
    // elapsedTime *= this.speedMultiplier / 400

    let fontSize = 48;
    if(ctx.canvas.width < 1000){
      fontSize = 24;
    }

    ctx.font = fontSize + "px serif";
    ctx.fillStyle = "white"
    ctx.textAlign = "center";
    const futureDate = '2025-05-31T08:20:00';
    const seconds = this.secondsUntilDate(futureDate);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const percentRounded = (((elapsedTime / 1000) / seconds) * 100).toFixed(8);
    ctx.fillText(seconds + " Seconds", centerX, centerY - 200);
    ctx.fillText(minutes + " Minues", centerX, centerY - 100);
    ctx.fillText(hours + " Hours", centerX, centerY);
    ctx.fillText(percentRounded + "% Closer", centerX, centerY + 300);

    const milestoneSeconds = 2000000;
    const target = new Date(futureDate);
    const milestoneDate = new Date(target.getTime() - milestoneSeconds * 1000).toLocaleString()
    ctx.fillText(milestoneDate, centerX, centerY + 100);
    ctx.fillText("^-- " + milestoneSeconds + " milestone", centerX, centerY + 200);

    // ctx.fillText(percentRounded + "% Closer", centerX - 100, centerY + 300);
    // this.drawProgressBar(percentRounded,400);
    this.drawProgressBar(percentRounded);
  }
}

class RaysInShape extends BaseShape {
  constructor(rays, speed, doesWave, speedVertRate, speedHorrRate, speedVert, speedHorr, boxSize, trailLength = 50, lineWidth, fade, colourFree, colourContained, boxVisible,) {
    super();
    this.rays = rays;
    this.speed = speed;
    this.speedVert = speedVert;
    this.speedHorr = speedHorr;
    this.boxSize = boxSize;
    this.trailLength = trailLength;
    this.rayObjects = [];
    this.centerRays = []; // New array for rays heading to center
    this.lineWidth = lineWidth;
    this.boxVisible = boxVisible;
    this.doesWave = doesWave;
    this.colourFree = colourFree;
    this.colourContained = colourContained;
    this.speedHorrRate = speedHorrRate;
    this.speedVertRate = speedVertRate;
    this.fade = fade;
  }

  initialise(config) { //is overide
    for (let item of config) {
      const { element, listener, filtersDiv } = addControl(item, this);
      this.controls.push({ element, listener, });

      if (item.type === "range" && item.property !== "rays") {
        // Initialize rangeFilter array for this control
        const controlIndex = this.controls.length - 1;
        this.controls[controlIndex].rangeFilters = [];

        let addFilterButton = document.createElement("button");
        addFilterButton.innerText = "Add Filter";
        addFilterButton.className = "add-filter-button";

        // Store the control index in the click handler closure
        addFilterButton.addEventListener("click", () => {
          const { filterDiv, eventListener, min, max, rate } = createFilter(item);
          filtersDiv.appendChild(filterDiv);

          // Use the stored control index
          if (this.controls[controlIndex] && this.controls[controlIndex].rangeFilters) {
            this.controls[controlIndex].rangeFilters.push({
              element: filterDiv,
              listener: eventListener,
              min: min,
              max: max,
              rate: rate,
            });
          } else {
            console.error("Control or rangeFilters not found for index:", controlIndex);
          }
        });

        filtersDiv.appendChild(addFilterButton);
      }
    }

    // Add controls for speed multiplier and trail length
    const { element: speedElement, listener: speedListener } = addControl({
      type: "range", min: 1, max: 500, defaultValue: 100, property: "speedMultiplier"
    }, this);
    this.controls.push({ element: speedElement, listener: speedListener });

    // const { element: trailElement, listener: trailListener } = addControl({
    //   type: "range", min: 5, max: 200, defaultValue: this.trailLength, property: "trailLength"
    // }, this);
    // this.controls.push({ element: trailElement, listener: trailListener });

    // Prepare rayObjects for the first draw
    this.prepareRayObjects();
  }

  prepareRayObjects() {
    this.rayObjects = [];
    for (let i = 0; i < this.rays; i++) {
      const angle = (360 / this.rays) * i;
      this.rayObjects.push({
        angle: angle,
        lastX: centerX,
        lastY: centerY,
        positions: [{ x: centerX, y: centerY, angle: angle }]
      });
    }
    this.centerRays = []; // Initialize centerRays array
  }

  createCenterRay(x, y) {
    // Calculate angle towards center
    const dx = centerX - x;
    const dy = centerY - y;
    const angleToCenter = Math.atan2(dy, dx) * 180 / Math.PI;

    // Create new center-bound ray
    this.centerRays.push({
      positions: [{ x: x, y: y }],
      angle: angleToCenter,
      reachedCenter: false
    });
  }

  updateCenterRays(deltaTime) {
    const centerThreshold = 5; // Distance threshold to consider "reached center"
    const maxDistance = 2000;

    // Process each center-bound ray
    for (let i = 0; i < this.centerRays.length; i++) {
      const ray = this.centerRays[i];

      // Skip rays that have reached the center
      if (ray.reachedCenter) {
        // Remove the oldest position from the trail
        if (ray.positions.length > 0) {
          ray.positions.shift();
        }

        // Remove ray if trail is empty
        if (ray.positions.length <= 1) {
          this.centerRays.splice(i, 1);
          i--;
          continue;
        }
      } else {
        // Get current position
        const currentPos = ray.positions[ray.positions.length - 1];

        // Calculate new position
        const dx = (this.speedHorr / 100) * this.speed * Math.cos(rad(ray.angle));
        const dy = (this.speedVert / 100) * this.speed * Math.sin(rad(ray.angle));
        const newX = currentPos.x + dx;
        const newY = currentPos.y + dy;

        // Check if ray has gone too far from origin
        const distFromOrigin = Math.sqrt(
          Math.pow(newX - centerX, 2) + Math.pow(newY - centerY, 2)
        );

        // Remove rays that have gone too far
        if (distFromOrigin > maxDistance) {
          this.centerRays.splice(i, 1);
          i--;
          continue;
        }

        // Add new position to ray
        ray.positions.push({ x: newX, y: newY });

        // Check if ray has reached center
        const distToCenter = Math.sqrt(
          Math.pow(newX - centerX, 2) + Math.pow(newY - centerY, 2)
        );

        if (distToCenter <= centerThreshold) {
          ray.reachedCenter = true;
        }

        // Remove positions beyond trail length
        while (ray.positions.length > this.trailLength) {
          ray.positions.shift();
        }
      }

      // Draw segments

      for (let j = 1; j < ray.positions.length; j++) {
        const prev = ray.positions[j - 1];
        const curr = ray.positions[j];

        // Fade alpha (newer = brighter)
        let alpha = 1;
        if (this.fade) {
          alpha = (j / ray.positions.length) * 0.8 + 0.2;

        }

        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);

        // Contained rays
        const col = hexToRgb(this.colourFree);
        ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha})`;
        ctx.stroke();
      }
    }
  }

  setRays(newValue) {
    this.rays = newValue;
    this.prepareRayObjects(); // Reinitialize rayObjects with the new number of rays
  }



  draw(elapsed, deltaTime) {
    deltaTime *= this.speedMultiplier / 100;

    this.updateFilters(elapsed);

    if (this.doesWave) {
      const vertRate = this.speedVertRate / 100;
      const horrRate = this.speedHorrRate / 100;
      this.speedVert = Math.sin(elapsed / 10 * vertRate) * 85 + 100;
      this.speedHorr = Math.sin(elapsed / 10 * horrRate) * 85 + 100;
      updateControlInput(this.speedVert, "speedVert");
      updateControlInput(this.speedHorr, "speedHorr");
    }

    // Define the box boundaries
    const boxLeft = centerX - this.boxSize / 2;
    const boxRight = centerX + this.boxSize / 2;
    const boxTop = centerY - this.boxSize / 2;
    const boxBottom = centerY + this.boxSize / 2;

    // Draw the box boundary for visualization
    if (this.boxVisible) {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.strokeRect(boxLeft, boxTop, this.boxSize, this.boxSize);
    }
    ctx.lineWidth = this.lineWidth;
    // Process ray movements and collisions
    for (let j = 0; j < this.rayObjects.length; j++) {
      const ray = this.rayObjects[j];

      // Get current position
      const currentPos = ray.positions[ray.positions.length - 1];

      // Calculate potential new position
      let dx = (this.speedHorr / 100) * this.speed * Math.cos(rad(ray.angle));
      let dy = (this.speedVert / 100) * this.speed * Math.sin(rad(ray.angle));
      let newX = currentPos.x + dx;
      let newY = currentPos.y + dy;
      let collisionType = null;
      const oldAngle = ray.angle;

      // Check for horizontal collision
      if (newX < boxLeft || newX > boxRight) {
        // Calculate exact collision point with horizontal wall
        const collisionX = newX < boxLeft ? boxLeft : boxRight;
        const collisionRatio = (collisionX - currentPos.x) / dx;
        const collisionY = currentPos.y + dy * collisionRatio;

        // Add collision point to positions array
        ray.positions.push({
          x: collisionX,
          y: collisionY,
          angle: oldAngle,
          collision: 'horizontal'
        });

        // Create a center-bound ray at the collision point
        this.createCenterRay(collisionX, collisionY);

        // Reflect horizontally
        ray.angle = 180 - ray.angle;
        // Normalize angle
        ray.angle = ((ray.angle % 360) + 360) % 360;

        // Calculate remaining movement after collision
        const remainingRatio = 1 - collisionRatio;
        dx = remainingRatio * (this.speedHorr / 100) * this.speed * Math.cos(rad(ray.angle));
        dy = remainingRatio * (this.speedVert / 100) * this.speed * Math.sin(rad(ray.angle));
        newX = collisionX + dx;
        newY = collisionY + dy;
        collisionType = 'horizontal';
      }

      // Check for vertical collision
      if (newY < boxTop || newY > boxBottom) {
        if (collisionType === null) {
          // Calculate exact collision point with vertical wall
          const collisionY = newY < boxTop ? boxTop : boxBottom;
          const collisionRatio = (collisionY - currentPos.y) / dy;
          const collisionX = currentPos.x + dx * collisionRatio;

          // Add collision point to positions array
          ray.positions.push({
            x: collisionX,
            y: collisionY,
            angle: oldAngle,
            collision: 'vertical'
          });

          // Create a center-bound ray at the collision point
          this.createCenterRay(collisionX, collisionY);

          // Reflect vertically
          ray.angle = 360 - ray.angle;
          // Normalize angle
          ray.angle = ((ray.angle % 360) + 360) % 360;

          // Calculate remaining movement after collision
          const remainingRatio = 1 - collisionRatio;
          dx = remainingRatio * (this.speedHorr / 100) * this.speed * Math.cos(rad(ray.angle));
          dy = remainingRatio * (this.speedVert / 100) * this.speed * Math.sin(rad(ray.angle));
          newX = collisionX + dx;
          newY = collisionY + dy;
        } else {
          // Second collision in the same frame (corner case)
          // Simply ensure we stay inside the box
          newX = Math.max(boxLeft, Math.min(newX, boxRight));
          newY = Math.max(boxTop, Math.min(newY, boxBottom));
          ray.positions.push({
            x: newX,
            y: newY,
            angle: ray.angle,
            collision: 'corner'
          });

          // Create a center-bound ray at the collision point (corner)
          this.createCenterRay(newX, newY);
        }
      }

      // Ensure rays stay inside the box
      newX = Math.max(boxLeft, Math.min(newX, boxRight));
      newY = Math.max(boxTop, Math.min(newY, boxBottom));

      // Add new position to history if there was no collision yet
      if (collisionType === null) {
        ray.positions.push({
          x: newX,
          y: newY,
          angle: ray.angle
        });
      }

      // Limit positions array to trail length
      while (ray.positions.length > this.trailLength) {
        ray.positions.shift();
      }

      // Draw the trail


      // Draw all segments of the trail
      for (let i = 1; i < ray.positions.length; i++) {
        const prev = ray.positions[i - 1];
        const curr = ray.positions[i];

        // Fade color based on position in trail (newer = brighter)
        let alpha = 1;
        if (this.fade) {
          alpha = (i / ray.positions.length) * 0.8 + 0.2;
        }
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);

        // Highlight collision points with different color
        if (curr.collision) {
          ctx.strokeStyle = `rgba(255, 255, 0, ${alpha})`;
        } else {
          const col = hexToRgb(this.colourContained);
          ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha})`;
          // ctx.strokeStyle = `rgba(50, 50, 50, ${alpha})`;  // Changed from pink to gray
        }

        ctx.stroke();
      }
    }

    // Update and draw center-bound rays
    this.updateCenterRays(deltaTime);
  }
}