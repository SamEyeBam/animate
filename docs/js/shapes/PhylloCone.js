/**
 * PhylloCone - Spiral cone pattern based on phyllotaxis
 */
class PhylloCone extends BaseShape {
  static config = [
    { type: 'range', min: 0, max: 3141, defaultValue: 0, property: 'start' },
    { type: 'range', min: 1, max: 12, defaultValue: 2, property: 'spiralProngs' },
    { type: 'range', min: 1, max: 50, defaultValue: 10, property: 'width_10' },
    { type: 'range', min: 1, max: 2000, defaultValue: 1000, property: 'iterations' },
    { type: 'range', min: 1, max: 10, defaultValue: 2, property: 'distance' },
    { type: 'range', min: 1, max: 10, defaultValue: 2, property: 'line_width' },
    { type: 'color', defaultValue: '#2D81FC', property: 'colour1' },
    { type: 'color', defaultValue: '#FC0362', property: 'colour2' },
  
  ];

  constructor(start, spiralProngs, width_10, iterations, distance,line_width, colour1, colour2) {
    super();
    this.start = start;
    this.spiralProngs = spiralProngs;
    this.width_10 = width_10;
    this.iterations = iterations;
    this.distance = distance;
    this.line_width = line_width;
    this.colour1 = colour1;
    this.colour2 = colour2;
  }

  draw(elapsed) {
    this.updateFilters(elapsed);
    const rotation = elapsed * (this.speedMultiplier / 100) + this.start;
    const angle = rotation / 1000;
    const distanceMultiplier = this.distance;
    const maxIterations = this.iterations;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    for (let n = 0; n < maxIterations; n++) {
      const nAngle = n * angle + Math.sin(angle * n * this.spiralProngs)*(this.width_10/10);
      const radius = distanceMultiplier * n;
      const xCoord = radius * Math.cos(nAngle) + centerX;
      const yCoord = radius * Math.sin(nAngle) + centerY;
      ctx.lineTo(xCoord, yCoord);
    }
    ctx.lineWidth = this.line_width;
    ctx.strokeStyle = this.colour1;
    ctx.stroke();
    console.log(this.line_width);
  }
}

shapeRegistry.register('PhylloCone', PhylloCone);
