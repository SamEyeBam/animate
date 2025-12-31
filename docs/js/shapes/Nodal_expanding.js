/**
 * Nodal_expanding - Expanding nodal pattern with color gradient
 */
class Nodal_expanding extends BaseShape {
  static config = [
    { type: 'range', min: 0, max: 100, defaultValue: 1, property: 'expand' },
    { type: 'range', min: 1, max: 10000, defaultValue: 1000, property: 'points' },
    { type: 'range', min: 1, max: 360, defaultValue: 32, property: 'start' },
    { type: 'range', min: 1, max: 10, defaultValue: 6, property: 'line_width' },
    { type: 'color', defaultValue: [45, 129, 252], property: 'colour1' },
    { type: 'color', defaultValue: [252, 3, 98], property: 'colour2' },
  ];

  constructor(expand, points, start, line_width, colour1, colour2) {
    super();
    this.expand = expand;
    this.points = points;
    this.start = start;
    this.line_width = line_width;
    this.colour1 = colour1;
    this.colour2 = colour2;
  }

  draw(elapsed) {
    this.updateFilters(elapsed);
    const rotation = elapsed * (this.speedMultiplier / 1000);
    const angle = (360 / 3000 * rotation) + this.start;
    let length = this.expand;

    for (let z = 1; z <= this.points; z++) {
      ctx.beginPath();
      const ncolour = colourToText(lerpRGB(this.colour1, this.colour2, z / this.points));

      ctx.moveTo(
        centerX + (Math.cos(rad(angle * (z - 1) + 0)) * (length - this.expand)),
        centerY + (Math.sin(rad(angle * (z - 1) + 0)) * (length - this.expand))
      );
      ctx.lineTo(
        centerX + (Math.cos(rad(angle * z + 0)) * length),
        centerY + (Math.sin(rad(angle * z + 0)) * length)
      );
      length += this.expand;
      ctx.lineWidth = this.line_width;
      ctx.strokeStyle = ncolour;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  }
}

shapeRegistry.register('Nodal_expanding', Nodal_expanding);
