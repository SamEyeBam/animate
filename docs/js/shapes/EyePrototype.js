/**
 * EyePrototype - Animated eye with blinking, spiral, and hypnotic effects
 */
class EyePrototype extends BaseShape {
  static config = [
    { type: 'range', min: -400, max: 400, defaultValue: 0, property: 'x' },
    { type: 'range', min: -400, max: 400, defaultValue: 0, property: 'y' },
    { type: 'range', min: -180, max: 180, defaultValue: 0, property: 'rotate' },
    { type: 'range', min: 0, max: 1, defaultValue: 1, property: 'flip' },
    { type: 'range', min: 1, max: 800, defaultValue: 400, property: 'width' },
    { type: 'range', min: 1, max: 100, defaultValue: 5, property: 'blink_speed' },
    { type: 'range', min: 0, max: 1, defaultValue: 0, property: 'draw_spiral' },
    { type: 'range', min: 0, max: 1, defaultValue: 1, property: 'spiral_full' },
    { type: 'range', min: 0, max: 1, defaultValue: 0, property: 'draw_pupil' },
    { type: 'range', min: 0, max: 1, defaultValue: 0, property: 'draw_expand' },
    { type: 'range', min: 0, max: 1, defaultValue: 1, property: 'draw_hypno' },
    { type: 'range', min: 1, max: 10, defaultValue: 1, property: 'line_width' },
    { type: 'color', defaultValue: '#00fffb', property: 'colourPupil' },
    { type: 'color', defaultValue: '#ff0000', property: 'colourSpiral' },
    { type: 'color', defaultValue: '#00fffb', property: 'colourExpand' },
    { type: 'range', min: 0, max: 1, defaultValue: 1, property: 'draw_eyelid' },
  ];

  constructor(x, y, rotate, flip, width, blink_speed, draw_spiral, spiral_full, draw_pupil, draw_expand, draw_hypno, line_width, colourPupil, colourSpiral, colourExpand) {
    super();
    this.x = x;
    this.y = y;
    this.rotate = rotate;
    this.flip = flip;
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
    this.centerPulse = new CircleExpand(10, 30, 1, 0, "#2D81FC", "#FC0362");
  }

  drawEyelid(rotation) {
    ctx.strokeStyle = "orange";
    const relCenterX = centerX + this.x;
    const relCenterY = centerY + this.y;
    rotation *= (this.speedMultiplier / 100);
    ctx.lineWidth = 1;
    ctx.beginPath();
    let newPoint = 0;
    let newPoint1 = 0;
    const addedRotate = this.flip ? 90 : 0;
    
    newPoint = rotatePoint(-this.width / 2, 0, this.rotate + addedRotate);
    ctx.moveTo(relCenterX + newPoint[0], relCenterY + newPoint[1]);
    newPoint = rotatePoint(0, -rotation / 400 * this.width, this.rotate + addedRotate);
    newPoint1 = rotatePoint(this.width / 2, 0, this.rotate + addedRotate);
    ctx.quadraticCurveTo(relCenterX + newPoint[0], relCenterY + newPoint[1], relCenterX + newPoint1[0], relCenterY + newPoint1[1]);

    newPoint = rotatePoint(-this.width / 2, 0, this.rotate + addedRotate);
    ctx.moveTo(relCenterX + newPoint[0], relCenterY + newPoint[1]);
    newPoint = rotatePoint(0, +rotation / 400 * this.width, this.rotate + addedRotate);
    newPoint1 = rotatePoint(this.width / 2, 0, this.rotate + addedRotate);
    ctx.quadraticCurveTo(relCenterX + newPoint[0], relCenterY + newPoint[1], relCenterX + newPoint1[0], relCenterY + newPoint1[1]);
    ctx.stroke();
  }

  eyelidCut(rotation) {
    const relCenterX = centerX + this.x;
    const relCenterY = centerY + this.y;
    let newPoint = 0;
    let newPoint1 = 0;
    const addedRotate = this.flip ? 90 : 0;
    
    const squarePath = new Path2D();
    newPoint = rotatePoint(-this.width / 2, 0, this.rotate + addedRotate);
    squarePath.moveTo(relCenterX + newPoint[0], relCenterY + newPoint[1]);
    newPoint = rotatePoint(0, -rotation / 400 * this.width, this.rotate + addedRotate);
    newPoint1 = rotatePoint(this.width / 2, 0, this.rotate + addedRotate);
    squarePath.quadraticCurveTo(relCenterX + newPoint[0], relCenterY + newPoint[1], relCenterX + newPoint1[0], relCenterY + newPoint1[1]);

    newPoint = rotatePoint(-this.width / 2, 0, this.rotate + addedRotate);
    squarePath.moveTo(relCenterX + newPoint[0], relCenterY + newPoint[1]);
    newPoint = rotatePoint(0, +rotation / 400 * this.width, this.rotate + addedRotate);
    newPoint1 = rotatePoint(this.width / 2, 0, this.rotate + addedRotate);
    squarePath.quadraticCurveTo(relCenterX + newPoint[0], relCenterY + newPoint[1], relCenterX + newPoint1[0], relCenterY + newPoint1[1]);

    ctx.clip(squarePath);
  }

  drawGrowEye(step) {
    ctx.strokeStyle = this.colourExpand;
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.arc(centerX + this.x, centerY + this.y, step, 0, 2 * Math.PI);
    ctx.stroke();
  }

  drawCircle(step) {
    ctx.strokeStyle = this.colourPupil;
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.arc(centerX + this.x, centerY + this.y, step, 0, 2 * Math.PI);
    ctx.stroke();
  }

  drawSpiral(step) {
    ctx.strokeStyle = this.colourSpiral;
    const a = 1;
    const b = 5;
    ctx.moveTo(centerX, centerY);
    ctx.beginPath();
    const max = this.spiral_full ? this.width : this.width / 2;
    
    for (let i = 0; i < max; i++) {
      const angle = 0.1 * i;
      const x = centerX + (a + b * angle) * Math.cos(angle + step / 2);
      const y = centerY + (a + b * angle) * Math.sin(angle + step / 2);
      ctx.lineTo(x + this.x, y + this.y);
    }
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  stepFunc() {
    if (this.cooldown !== 0) {
      this.cooldown--;
    } else {
      if (this.opening === true) {
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

  draw(elapsed) {
    const speedMult = 50;
    const waitTime = this.blink_speed;
    const cap = 200;
    const d = waitTime * speedMult * 10;
    const a = cap * 2 + d;
    const outputRotation = Math.min(Math.abs((Math.floor(elapsed * speedMult) % a) - a / 2 - d / 2), cap);

    ctx.fillStyle = "black";
    ctx.save();
    this.drawEyelid(outputRotation);
    this.eyelidCut(outputRotation);
    
    if (Math.floor(this.counter % (this.width / 4)) === 0) {
      this.counter = 0;
    }
    
    ctx.fillStyle = "black";
    ctx.fillRect(this.x - this.width / 2 + centerX, 0, this.width, ctx.canvas.height);
    
    if (this.draw_expand) {
      this.drawGrowEye(this.width / 4 + this.counter);
    }

    if (this.draw_hypno) {
      this.centerPulse.draw(elapsed);
    }
    
    if (this.draw_spiral) {
      this.drawSpiral(elapsed);
    }
    
    if (this.draw_pupil) {
      this.drawCircle(this.width / 4);
    }

    ctx.restore();

    this.stepFunc();
    this.counter++;
  }
}

shapeRegistry.register('EyePrototype', EyePrototype);
