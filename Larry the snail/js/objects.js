
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

    // Add a default speed multiplier control
    const { element, listener } = addControl({
      type: "range",
      min: 1,
      max: 1000,
      defaultValue: 100,
      property: "speedMultiplier",
    }, this);
    this.controls.push({ element, listener });
  }

  remove() {
    this.controls.forEach(({ element, listener }) => {
      if (element && listener) {
        element.removeEventListener("input", listener);
        element.removeEventListener("click", listener);
      }
      if (element && element.parentElement) {
        element.parentElement.removeChild(element);
        const titleElement = document.getElementById("elText" + element.id.slice(2));
        if (titleElement) {
          titleElement.parentElement.removeChild(titleElement);
        }
      }
    });
    this.controls = [];
  }

  draw() {
    throw new Error("Draw function not implemented");
  }
}

class Larry extends BaseShape {
  constructor(eatSpeed, eatDuration) {
    super();
    this.bodyWidth = 64;
    this.bodyHeight = 64;
    this.headWidth = 21;
    this.headHeight = 24;
    this.headOffsetX = 54 - this.headWidth * this.magnitude / 2;
    this.headOffsetY = this.bodyHeight * this.magnitude - 7; // Bottom of the body minus 7 pixels
    this.globalX = centerX;
    this.globalY = centerY;
    // this.globalX = Math.random() * 1500 + 400;
    // this.globalY = Math.random() * centerY + centerY;
    this.localX = 0;
    this.localY = 0;
    this.speedMultiplier = 100;
    this.magnitude = (this.globalY - centerY) / centerY;

    this.isEating = false;
    this.eatEndTimestamp = 0;
    this.eatDuration = eatDuration;
    this.eatSpeed = eatSpeed;

    this.bodyImage = new Image();
    this.headImage = new Image();
    this.foodImage = new Image();
    this.hatImage = new Image();
    this.shellImage = new Image();
    this.backgroundImage = new Image();

    this.bodyImage.src = 'larry_photos/body.png';
    this.headImage.src = 'larry_photos/head.png';
    this.foodImage.src = 'larry_photos/';
    this.hatImage.src = '';
    this.shellImage.src = '';
    this.backgroundImage.src = '';

    this.hatXoffset = 0;
    this.hatYoffset = 0;

    this.foodXoffset = 0;
    this.foodYoffset = 0;
    this.foodSizeMuliplier = 0;
    this.lastTimestamp = 0;

    this.moveDirection = 1
  }

  draw(elapsed, timestamp) {
    // this.magnitude = ((this.globalY - centerY)/centerY)*3 +1;
    timestamp *= (this.speedMultiplier / 100);
    // console.log(timestamp - this.lastTimestamp)
    this.lastTimestamp = timestamp;



    // Draw background
    if (this.backgroundImage.src) {
      // console.log("drawing background: " + this.backgroundImage.src)

      ctx.drawImage(this.backgroundImage, centerX - (this.backgroundImage.width), centerY - this.backgroundImage.height, this.backgroundImage.width * 2, this.backgroundImage.height * 2);
    }
    // Draw body at its anchor point (center-bottom)
    const bodyX = this.globalX - (this.bodyWidth * this.magnitude / 2);
    const bodyY = this.globalY - this.bodyHeight * this.magnitude;

    let facingRight = false
    if (this.moveDirection <= 90 || this.moveDirection > 270) {
      facingRight = true;
    }

    // ctx.drawImage(this.bodyImage, bodyX, bodyY, this.bodyWidth * this.magnitude, this.bodyHeight * this.magnitude);
    this.drawImage(this.bodyImage, bodyX, bodyY, this.bodyWidth * this.magnitude, this.bodyHeight * this.magnitude, undefined, !facingRight)
    console.log(this.bodyWidth * this.magnitude * this.moveDirection)

    // Draw head aligned with body
    // const headX = bodyX + this.headOffsetX;
    // let headY = bodyY + this.headOffsetY - this.headHeight;
    // const headX = bodyX + (53.5 * this.magnitude - this.headWidth * this.magnitude / 2);
    const headX = facingRight? bodyX + (53.5 * this.magnitude - this.headWidth * this.magnitude / 2): bodyX
    let headY = bodyY + (this.bodyHeight * this.magnitude - 7 * this.magnitude) - this.headHeight * this.magnitude;

    //eating
    if (timestamp < this.eatEndTimestamp) {
      // const adjustedTimestamp = this.eatEndTimestamp - timestamp + parseInt(this.eatDuration) / (1000 / 60);
      const adjustedTimestamp = (timestamp - (this.eatEndTimestamp - parseInt(this.eatDuration * 1000) / (this.eatSpeed / 100)));

      console.log(adjustedTimestamp)
      const eatMaxHeight = 20;
      // const eatingYOffset = ((Math.cos((adjustedTimestamp -Math.PI/2+  0.5 * Math.PI) * (this.eatSpeed/100)*0.1 - Math.PI / 2) + 1) / 2) * eatMaxHeight;
      // const eatingYOffset = ((Math.sin((adjustedTimestamp/1000 * 2 * Math.PI * this.eatSpeed / 100 * 0.1) - Math.PI / 2) + 1) / 2) * eatMaxHeight;
      const eatingYOffset = (Math.sin(((adjustedTimestamp / 1000) * (this.eatSpeed / 100)) * Math.PI * 2 - (Math.PI / 2)) * 0.5 + 0.5) * eatMaxHeight;
      headY -= eatingYOffset;
      const n = this.eatDuration
      // console.log(adjustedTimestamp)
      // console.log((-adjustedTimestamp + 10 * n) / 10)
      // console.log(Math.floor((-adjustedTimestamp + (10 / (this.eatSpeed / 100)) * n) / (10 / (this.eatSpeed / 100))))
      const frame = Math.floor((adjustedTimestamp / 1000) * (this.eatSpeed / 100))
      this.foodImage.src = "larry_photos/foods/" + document.getElementById('elselectedFood').value + frame + ".png";
      this.drawCrosshair(this.globalX + this.foodXoffset, this.globalY - (16 * this.magnitude / 2), 30)
      this.drawCrosshair(this.globalX + this.foodXoffset, this.foodYoffset - this.foodImage.height * this.foodSizeMuliplier, 30)
      this.drawCrosshair(this.globalX + this.foodXoffset, this.foodYoffset - this.foodImage.height * this.foodSizeMuliplier + this.foodImage.height * this.foodSizeMuliplier, 30)
      let tmp = this.globalY - this.foodYoffset
      ctx.drawImage(this.foodImage, this.globalX + this.foodXoffset, tmp, this.foodImage.width * this.foodSizeMuliplier, this.foodImage.height * this.foodSizeMuliplier)
      // ctx.drawImage(this.foodImage, bodyX + this.foodXoffset, bodyY + this.foodYoffset, this.foodImage.width * this.foodSizeMuliplier, this.foodImage.height * this.foodSizeMuliplier)
    }

    // ctx.drawImage(this.headImage, headX, headY, this.headWidth * this.magnitude, this.headHeight * this.magnitude);
    this.drawImage(this.headImage, headX, headY, this.headWidth * this.magnitude, this.headHeight * this.magnitude, undefined, !facingRight)
    // this.drawImage(this.headImage,headX,headY, this.headWidth * this.magnitude, this.headHeight * this.magnitude,undefined,true)
    // Draw hat if any
    if (this.hatImage.src) {
      this.drawCrosshair(headX, headY, 20);
      ctx.drawImage(this.hatImage, headX + this.hatXoffset, headY + this.hatYoffset, this.hatImage.width * this.magnitude, this.hatImage.height * this.magnitude);
    }

    // Draw shell if any
    if (this.shellImage.src) {
      ctx.drawImage(this.shellImage, bodyX, bodyY, this.bodyWidth, this.bodyHeight);
    }
  }

  drawCrosshair(x, y, size) {
    ctx.strokeStyle = "pink";
    ctx.lineWidth = 1
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  }

  startEating() {
    console.log("Larry starts eating");
    const foodSelection = document.getElementById('elselectedFood').value
    this.isEating = true;
    // this.eatEndTimestamp = this.lastTimestamp + (parseInt(this.eatDuration) / (6 * (this.eatSpeed / 100))) * 1000 / (1000 / 60);
    const bodyY = this.globalY - this.bodyHeight * this.magnitude;
    if (foodSelection === "") {
      this.foodXoffset = 0;
      this.foodYoffset = 0;
    } else {
      this.foodImage.src = "larry_photos/foods/" + document.getElementById('elselectedFood').value + 0 + ".png";
      const offsets = foodConfig[foodSelection] || { sizeMult: 0, n: 0 };
      this.eatDuration = offsets.n
      this.foodSizeMuliplier = offsets.sizeMult;
      this.foodXoffset = ((this.bodyWidth + 16) * this.magnitude / 2)
      this.foodYoffset = (16 * this.magnitude / 2) + this.foodImage.height * this.foodSizeMuliplier / 2
      // this.foodYoffset = bodyY + (this.bodyHeight * this.magnitude - 7 * this.magnitude) - this.headHeight * this.magnitude - (this.foodImage.height / 2);

    }

    this.eatEndTimestamp = trueTimestamp + parseInt(this.eatDuration * 1000) / (this.eatSpeed / 100);
    // console.log("start:" + trueTimestamp + " end: " + this.eatEndTimestamp)
    // console.log(this.eatEndTimestamp)
    // setTimeout(() => {
    //   this.isEating = false;
    //   console.log("Larry stops eating");
    // }, this.eatDuration); // Adjust duration as needed
  }

  flipDirection() {

  }

  applyFood(selectedFood) {
    const foodSelection = document.getElementById('elselectedFood').value
    const offsets = foodConfig[foodSelection] || { sizeMult: 0, n: 0 };
    let eatDurationElement = document.getElementById('eleatDuration')
    eatDurationElement.value = offsets.n
    const event = new Event('input', { bubbles: true });
    eatDurationElement.dispatchEvent(event)
  }

  applyHat() {
    const hatSelection = document.getElementById('elselectedHat').value;
    if (hatSelection === "") {
      this.hatImage.src = ``;
      this.hatXoffset = 0;
      this.hatYoffset = 0;
    } else {
      this.hatImage.src = `larry_photos/hats/${hatSelection}.png`;
      const offsets = hatConfig[hatSelection] || { x: 0, y: 0 };

      this.hatImage.onload = () => {
        this.recalculateHatOffsets(offsets);
      };
    }
  }
  recalculateHatOffsets(offsets) {
    this.hatXoffset = (this.headWidth * this.magnitude) / 2 - (this.hatImage.width * this.magnitude) / 2 + (offsets.x * this.magnitude);
    this.hatYoffset = (this.headHeight * this.magnitude) - (this.hatImage.height / 2 * this.magnitude) + (offsets.y * this.magnitude);
  }
  setMagnitude(newMagnitude) {
    this.magnitude = newMagnitude;
    const hatSelection = document.getElementById('elselectedHat').value;
    if (hatSelection !== "") {
      const offsets = hatConfig[hatSelection] || { x: 0, y: 0 };
      this.recalculateHatOffsets(offsets);
    }
  }

  wander() {
    console.log("Larry starts wandering");
  }

  applyShell() {
    const shellSelection = document.getElementById('elselectedShell').value;
    this.shellImage.src = `larry_photos/shells/${shellSelection}.png`;
  }

  applyBackground() {
    const backgroundSelection = document.getElementById('elselectedBackground').value;
    this.backgroundImage.src = `larry_photos/backgrounds/${backgroundSelection}.png`;
  }
  drawImage(img, x, y, width, height, deg, flip, flop, center) {

    ctx.save();

    if (typeof width === "undefined") width = img.width;
    if (typeof height === "undefined") height = img.height;
    if (typeof center === "undefined") center = false;

    // Set rotation point to center of image, instead of top/left
    if (center) {
      x -= width / 2;
      y -= height / 2;
    }

    // Set the origin to the center of the image
    ctx.translate(x + width / 2, y + height / 2);

    // Rotate the canvas around the origin
    var rad = 2 * Math.PI - deg * Math.PI / 180;
    ctx.rotate(rad);

    let flipScale, flopScale;
    // Flip/flop the canvas
    if (flip) flipScale = -1; else flipScale = 1;
    if (flop) flopScale = -1; else flopScale = 1;
    ctx.scale(flipScale, flopScale);

    // Draw the image    
    ctx.drawImage(img, -width / 2, -height / 2, width, height);

    ctx.restore();
  }
}

class PolyTwistColourWidth extends BaseShape {
  // constructor(sides, width, line_width, depth, rotation, speedMultiplier, colour1, colour2) {
  constructor(sides, width, line_width, depth, rotation, colour1, colour2) {
    super();
    this.sides = sides;
    this.width = width;
    this.line_width = line_width;
    this.depth = depth;
    this.rotation = rotation;
    this.colour1 = colour1;
    this.colour2 = colour2;
  }

  draw(elapsed, timestamp) {
    // rotation *= (this.speedMultiplier / 100)
    timestamp /= 1000
    timestamp *= (this.speedMultiplier / 100)
    let out_angle = 0;
    const innerAngle = 180 - ((this.sides - 2) * 180) / this.sides;
    const scopeAngle = timestamp - (innerAngle * Math.floor(timestamp / innerAngle));

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

class TestParent extends BaseShape {
  constructor() {
    super();
    this.children = []
    this.selectedChild = ""
  }

  draw(elapsed, timestamp) {
    // rotation *= (this.speedMultiplier / 100)
    timestamp /= 1000
    timestamp *= (this.speedMultiplier / 100)

    // console.log(this.selectedChild)

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].draw()

    }
  }

  setSelectedChild(SelectedChild) {
    console.log(this.selectedChild)
  }

  addChild() {
    // let x = Math.random()*1920
    // let y = Math.random()*1080
    // let r = Math.random()*360
    // let w = Math.random()*200+100
    // let s = Math.floor(Math.random()*10)+3
    // let newChild = new TestChild(s,w,x,y,r)
    // this.children.push(newChild)
    // console.log(this.children)
    let newChild = new Larry(5, 6);
    this.children.push(newChild)

    if (this.children.length === 1) {
      // this.children[0].backgroundImage.src = `larry_photos/backgrounds/field_blue.png`
    }
    let listOfYs = this.children.map((child, i) => {
      return child.globalY;
    })
    console.log(listOfYs)
    this.children = this.children.sort(((a, b) => a.globalY - b.globalY))
    listOfYs = this.children.map((child, i) => {
      return child.globalY;
    })
    console.log(listOfYs)
  }
}
class TestChild extends BaseShape {
  constructor(sides, width, x, y, rotation) {
    super();
    this.sides = sides;
    this.width = width;
    this.x = x;
    this.y = y;
    this.rotation = rotation;
  }

  draw(elapsed, timestamp) {
    // rotation *= (this.speedMultiplier / 100)
    timestamp /= 1000
    timestamp *= (this.speedMultiplier / 100)

    DrawPolygonPosition(this.sides, this.width, this.rotation, this.x, this.y, "#4287f5", 3);

  }
}