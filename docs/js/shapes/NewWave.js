/**
 * NewWave - Sine wave pattern radiating from center
 */
class NewWave extends BaseShape {
  static config = [
    { type: 'range', min: 300, max: 1600, defaultValue: 342, property: 'width' },
    { type: 'range', min: 2, max: 40, defaultValue: 4, property: 'sides' },
    { type: 'range', min: 1, max: 100, defaultValue: 1, property: 'step' },
    { type: 'range', min: 1, max: 10, defaultValue: 4, property: 'lineWidth' },
    { type: 'range', min: 100, max: 1000, defaultValue: 100, property: 'limiter' },
  ];

  constructor(width, sides, step, lineWidth, limiter) {
    super();
    this.width = width;
    this.sides = sides;
    this.step = step;
    this.lineWidth = lineWidth;
    this.limiter = limiter;
  }

  draw(elapsed) {
    this.updateFilters(elapsed);
    const rotation = elapsed * this.speedMultiplier / 400;
    ctx.lineWidth = this.lineWidth;
    
    for (let j = 0; j < this.sides; j++) {
      const radRotation = rad(360 / this.sides * j);
      const inverter = 1 - (j % 2) * 2;
      let lastX = centerX;
      let lastY = centerY;
      
      for (let i = 0; i < this.width; i += this.step) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.strokeStyle = colourToText(lerpRGB([255, 51, 170], [51, 170, 255], i / this.width));
        
        const x = i;
        const y = (Math.sin(-i * inverter / 30 + rotation * inverter) * i / (this.limiter / 100));
        const xRotated = x * Math.cos(radRotation) - y * Math.sin(radRotation);
        const yRotated = x * Math.sin(radRotation) + y * Math.cos(radRotation);
        
        lastX = centerX + xRotated;
        lastY = centerY + yRotated;
        ctx.lineTo(centerX + xRotated, centerY + yRotated);
        ctx.stroke();
      }
    }
  }
}

shapeRegistry.register('NewWave', NewWave);
