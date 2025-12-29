/**
 * Phyllotaxis - Classic phyllotaxis pattern with optional giggle effect
 */
class Phyllotaxis extends BaseShape {
  static config = [
    { type: 'range', min: 1, max: 40, defaultValue: 24, property: 'width' },
    { type: 'range', min: 1, max: 40, defaultValue: 10, property: 'size' },
    { type: 'range', min: 1, max: 40, defaultValue: 4, property: 'sizeMin' },
    { type: 'range', min: 0, max: 3141, defaultValue: 0, property: 'start' },
    { type: 'range', min: 1, max: 10000, defaultValue: 300, property: 'nMax' },
    { type: 'checkbox', defaultValue: false, property: 'giggle' },
    { type: 'color', defaultValue: [45, 129, 252], property: 'colour1' },
    { type: 'color', defaultValue: [252, 3, 98], property: 'colour2' },
  ];

  constructor(width, size, sizeMin, start, nMax, giggle, colour1, colour2) {
    super();
    this.width = width;
    this.size = size;
    this.sizeMin = sizeMin;
    this.start = start;
    this.nMax = nMax;
    this.giggle = giggle;
    this.colour1 = colour1;
    this.colour2 = colour2;
  }

  drawGiggle(angle) {
    angle /= 1000;
    const distanceMultiplier = 3;
    const maxIterations = this.nMax;

    for (let n = 0; n < maxIterations; n++) {
      ctx.beginPath();
      const ncolour = colourToText(lerpRGB(this.colour1, this.colour2, n / this.nMax));
      const nAngle = n * angle + Math.sin(rad(n * 1 + angle * 40000)) / 2;
      const radius = distanceMultiplier * n;
      const xCoord = radius * Math.cos(nAngle) + centerX;
      const yCoord = radius * Math.sin(nAngle) + centerY;
      ctx.arc(xCoord, yCoord, this.size, 0, 2 * Math.PI);
      ctx.fillStyle = ncolour;
      ctx.fill();
    }
  }

  draw(elapsed) {
    this.updateFilters(elapsed);
    const rotation = elapsed * (this.speedMultiplier / 300) + this.start;
    const sizeMultiplier = this.nMax / this.size + (5 - 3);

    if (this.giggle) {
      this.drawGiggle(rotation);
    } else {
      for (let n = 0; n < this.nMax; n += 1) {
        const ncolour = colourToText(lerpRGB(this.colour1, this.colour2, n / this.nMax));
        const a = n * (rotation / 1000);
        const r = this.width * Math.sqrt(n);
        const x = r * Math.cos(a) + centerX;
        const y = r * Math.sin(a) + centerY;

        ctx.beginPath();
        ctx.arc(x, y, (n / sizeMultiplier) + this.sizeMin, 0, 2 * Math.PI);
        ctx.fillStyle = ncolour;
        ctx.fill();
      }
    }
  }
}

shapeRegistry.register('Phyllotaxis', Phyllotaxis);
