/**
 * FloralPhyllo - Phyllotaxis-based floral pattern with eyelid shapes
 */
class FloralPhyllo extends BaseShape {
  static config = [
    { type: 'range', min: 1, max: 600, defaultValue: 300, property: 'width' },
    { type: 'range', min: 1, max: 300, defaultValue: 150, property: 'depth' },
    { type: 'range', min: 0, max: 3141, defaultValue: 0, property: 'start' },
    { type: 'color', defaultValue: '#4287f5', property: 'colour1' },
    { type: 'color', defaultValue: '#FC0362', property: 'colour2' },
  ];

  constructor(width, depth, start, colour1, colour2) {
    super();
    this.width = width;
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
      const ncolour = LerpHex(this.colour1, this.colour2, n / this.depth);
      const a = n * rotation / 1000;
      const r = c * Math.sqrt(n);
      const x = r * Math.cos(a) + centerX;
      const y = r * Math.sin(a) + centerY;

      drawEyelid(n * 2.4 + 40, x, y, ncolour);
    }
  }
}

shapeRegistry.register('FloralPhyllo', FloralPhyllo);
