/**
 * SquareTwist_angle - Twisted square pattern with angle-based scaling
 */
class SquareTwist_angle extends BaseShape {
  static config = [
    { type: 'range', min: 1, max: 800, defaultValue: 400, property: 'width' },
    { type: 'range', min: 1, max: 10, defaultValue: 1, property: 'line_width' },
    { type: 'color', defaultValue: [45, 129, 252], property: 'colour1' },
  ];

  constructor(width, line_width, colour1) {
    super();
    this.width = width;
    this.line_width = line_width;
    this.colour1 = colour1;
  }

  drawSquare(angle, size, colour) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rad(angle + 180));
    ctx.beginPath();
    ctx.strokeStyle = colourToText(colour);
    ctx.lineWidth = this.line_width;
    ctx.rect(-size / 2, -size / 2, size, size);
    ctx.stroke();
    ctx.restore();
  }

  draw(elapsed) {
    this.updateFilters(elapsed);
    const rotation = elapsed * (this.speedMultiplier / 100);
    const out_angle = rotation;
    const widthMultiplier = 1 / (2 * Math.sin(Math.PI / 180 * (130 - out_angle + 90 * Math.floor(out_angle / 90)))) + 0.5;

    for (let i = 0; i < 25; i++) {
      this.drawSquare(rotation * i, this.width * widthMultiplier ** i, this.colour1);
    }
  }
}

shapeRegistry.register('SquareTwist_angle', SquareTwist_angle);
