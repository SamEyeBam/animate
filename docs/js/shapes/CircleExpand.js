/**
 * CircleExpand - Expanding concentric circles/hearts animation
 */
class CircleExpand extends BaseShape {
  static config = [
    { type: 'range', min: 1, max: 70, defaultValue: 21, property: 'nCircles' },
    { type: 'range', min: 50, max: 150, defaultValue: 150, property: 'gap' },
    { type: 'range', min: 0, max: 1, defaultValue: 1, property: 'linear' },
    { type: 'range', min: 0, max: 1, defaultValue: 1, property: 'heart' },
    { type: 'color', defaultValue: '#fc03cf', property: 'colour1' },
    { type: 'color', defaultValue: '#00fffb', property: 'colour2' },
  ];

  constructor(nCircles, gap, linear, heart, colour1, colour2) {
    super();
    this.nCircles = nCircles;
    this.gap = gap;
    this.linear = linear;
    this.heart = heart;
    this.colour1 = colour1;
    this.colour2 = colour2;
  }

  lerpColor(a, b, amount) {
    const ah = +a.replace('#', '0x');
    const ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff;
    const bh = +b.replace('#', '0x');
    const br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff;
    const rr = ar + amount * (br - ar);
    const rg = ag + amount * (bg - ag);
    const rb = ab + amount * (bb - ab);
    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
  }

  arraySort(x, y) {
    if (x.r > y.r) return 1;
    if (x.r < y.r) return -1;
    return 0;
  }

  drawHeart(w, colour) {
    ctx.strokeStyle = "black";
    ctx.fillStyle = colour;
    ctx.lineWidth = 1;
    const x = centerX - w / 2;
    const y = centerY - w / 2;
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

  draw(elapsed) {
    const rotation = elapsed * 0.9;
    ctx.strokeWeight = 1;
    ctx.lineWidth = 1;
    const arrOfWidths = [];
    let intRot;

    if (this.linear) {
      intRot = Math.floor(rotation * 30) / 100;
    } else {
      intRot = Math.sin(rad(Math.floor(rotation * 30) / 4)) + rotation / 4;
    }

    for (let i = 0; i < this.nCircles; i++) {
      const width = this.gap * ((intRot + i) % this.nCircles);
      const colour = (Math.sin(rad(i * (360 / this.nCircles) - 90)) + 1) / 2;
      arrOfWidths.push({ r: width, c: colour });
    }

    const newArr = arrOfWidths.sort(this.arraySort);

    for (let i = this.nCircles - 1; i >= 0; i--) {
      const newColour = this.lerpColor(this.colour1, this.colour2, newArr[i].c);

      if (this.heart) {
        this.drawHeart(newArr[i].r, newColour);
      } else {
        ctx.beginPath();
        ctx.arc(centerX, centerY, newArr[i].r, 0, 2 * Math.PI);
        ctx.fillStyle = newColour;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
      }
    }
  }
}

shapeRegistry.register('CircleExpand', CircleExpand);
