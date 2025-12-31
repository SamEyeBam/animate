/**
 * FloralPhyllo - Phyllotaxis-based floral pattern with eyelid shapes
 */
class FloralPhyllo extends BaseShape {
  static config = [
    { type: 'range', min: 1, max: 100, defaultValue: 60, property: 'width_start' },
    { type: 'range', min: 1, max: 1000, defaultValue: 650, property: 'width_scale' },
    { type: 'range', min: 1, max: 1000, defaultValue: 200, property: 'depth' },
    { type: 'range', min: 0, max: 3141, defaultValue: 0, property: 'start' },
    { type: 'color', defaultValue: [66, 135, 245], property: 'colour1' },
    { type: 'color', defaultValue: [252, 3, 98], property: 'colour2' },
  ];

  constructor(width_start,width_scale, depth, start, colour1, colour2) {
    super();
    this.width_start = width_start;
    this.width_scale = width_scale;
    this.depth = depth;
    this.start = start;
    this.colour1 = colour1;
    this.colour2 = colour2;
    this.speedMultiplier = 500;
  }

  draw(elapsed) {
    this.updateFilters(elapsed);
    const rotation = elapsed * (this.speedMultiplier / 500) + this.start;
    const c = 1;
    
    for (let n = this.depth; n > 0; n -= 1) {
      const ncolour = colourToText(lerpRGB(this.colour1, this.colour2, n / this.depth));
      const a = n * rotation / 1000;
      const r = c * Math.sqrt(n);
      const x = r * Math.cos(a) + centerX;
      const y = r * Math.sin(a) + centerY;

      drawPetal(n * this.width_scale/100 + this.width_start, x, y, ncolour);
    }
  }
}

shapeRegistry.register('FloralPhyllo', FloralPhyllo);
