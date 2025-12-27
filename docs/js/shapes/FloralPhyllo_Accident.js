/**
 * FloralPhyllo_Accident - Phyllotaxis pattern with accidental eyelid variation
 */
class FloralPhyllo_Accident extends BaseShape {
  static config = [
    { type: 'range', min: 1, max: 50, defaultValue: 20, property: 'sides' },
    { type: 'range', min: 1, max: 600, defaultValue: 240, property: 'width' },
    { type: 'color', defaultValue: '#2D81FC', property: 'colour1' },
    { type: 'color', defaultValue: '#FC0362', property: 'colour2' },
  ];

  constructor(sides, width, colour1, colour2) {
    super();
    this.sides = sides;
    this.width = width;
    this.colour1 = colour1;
    this.colour2 = colour2;
  }

  draw(elapsed) {
    this.updateFilters(elapsed);
    const rotation = elapsed * (this.speedMultiplier / 100);
    const c = 24;

    for (let n = 0; n < 300; n += 1) {
      const ncolour = LerpHex(this.colour1, this.colour2, Math.cos(rad(n / 2)));
      const a = n * (rotation / 1000 + 100);
      const r = c * Math.sqrt(n);
      const x = r * Math.cos(a) + centerX;
      const y = r * Math.sin(a) + centerY;

      drawEyelidAccident(x, y);
    }
  }
}

shapeRegistry.register('FloralPhyllo_Accident', FloralPhyllo_Accident);
