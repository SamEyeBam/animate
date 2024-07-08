
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
      max: 500,
      defaultValue: 100,
      property: "speedMultiplier",
    }, this);
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
    this.magnitude = 1;
    this.bodyWidth = 64;
    this.bodyHeight = 64;
    this.headWidth = 21;
    this.headHeight = 24;
    this.headOffsetX = 54 - this.headWidth * this.magnitude / 2;
    this.headOffsetY = this.bodyHeight * this.magnitude - 7; // Bottom of the body minus 7 pixels
    this.globalX = Math.random() * 1000;
    this.globalY = centerY;
    this.localX = 0;
    this.localY = 0;
    this.speedMultiplier = 100;

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
  }

  draw(timestamp) {
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
    ctx.drawImage(this.bodyImage, bodyX, bodyY, this.bodyWidth * this.magnitude, this.bodyHeight * this.magnitude);

    // Draw head aligned with body
    // const headX = bodyX + this.headOffsetX;
    // let headY = bodyY + this.headOffsetY - this.headHeight;
    const headX = bodyX + (53.5 * this.magnitude - this.headWidth * this.magnitude / 2);
    let headY = bodyY + (this.bodyHeight * this.magnitude - 7 * this.magnitude) - this.headHeight * this.magnitude;

    //eating
    if (timestamp < this.eatEndTimestamp) {
      console.log("eating")
      const adjustedTimestamp = this.eatEndTimestamp - timestamp + parseInt(this.eatDuration) / (1000 / 60);

      const eatMaxHeight = 20;
      // const eatingYOffset = ((Math.cos((adjustedTimestamp -Math.PI/2+  0.5 * Math.PI) * (this.eatSpeed/100)*0.1 - Math.PI / 2) + 1) / 2) * eatMaxHeight;
      const eatingYOffset = ((Math.sin((adjustedTimestamp * 2 * Math.PI * this.eatSpeed / 100 * 0.1) - Math.PI / 2) + 1) / 2) * eatMaxHeight;
      headY -= eatingYOffset;
      const n = this.eatDuration
      console.log(adjustedTimestamp)
      console.log((-adjustedTimestamp + 10 * n) / 10)
      console.log(Math.floor((-adjustedTimestamp + (10 / (this.eatSpeed / 100)) * n) / (10 / (this.eatSpeed / 100))))
      const frame = Math.floor((-adjustedTimestamp + (10 / (this.eatSpeed / 100)) * n) / (10 / (this.eatSpeed / 100)))
      this.foodImage.src = "larry_photos/foods/" + document.getElementById('elselectedFood').value + frame + ".png";
      this.drawCrosshair(bodyX + this.foodXoffset, bodyY + this.foodYoffset, 30)
      ctx.drawImage(this.foodImage, bodyX + this.foodXoffset, bodyY + this.foodYoffset, this.foodImage.width * this.foodSizeMuliplier, this.foodImage.height * this.foodSizeMuliplier)
    }
    
    ctx.drawImage(this.headImage, headX, headY, this.headWidth * this.magnitude, this.headHeight * this.magnitude);

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
    this.eatEndTimestamp = this.lastTimestamp + (parseInt(this.eatDuration) / (6 * (this.eatSpeed / 100))) * 1000 / (1000 / 60);

    if (foodSelection === "") {
      this.foodXoffset = 0;
      this.foodYoffset = 0;
    } else {
      this.foodImage.src = "larry_photos/foods/" + document.getElementById('elselectedFood').value + 0 + ".png";
      const offsets = foodConfig[foodSelection] || { sizeMult: 0, n: 0 };
      this.foodSizeMuliplier = offsets.sizeMult;
        this.foodXoffset = (this.bodyWidth * this.magnitude) ;
        this.foodYoffset = bodyY + (this.bodyHeight * this.magnitude - 7 * this.magnitude) - this.headHeight * this.magnitude - (this.foodImage.height/2) ;

    }
    console.log(this.eatEndTimestamp)
    // setTimeout(() => {
    //   this.isEating = false;
    //   console.log("Larry stops eating");
    // }, this.eatDuration); // Adjust duration as needed
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
    // Implement wandering logic here
  }

  applyShell() {
    const shellSelection = document.getElementById('elselectedShell').value;
    this.shellImage.src = `larry_photos/shells/${shellSelection}.png`;
  }

  applyBackground() {
    const backgroundSelection = document.getElementById('elselectedBackground').value;
    this.backgroundImage.src = `larry_photos/backgrounds/${backgroundSelection}.png`;
  }
}

