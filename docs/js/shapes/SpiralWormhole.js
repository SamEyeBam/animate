/**
 * Spiral1 - Dual-direction spiral pattern
 */
class SpiralWormhole extends BaseShape {
  static config = [
    { type: 'range', min: 1, max: 50, defaultValue: 20, property: 'sides' },
    { type: 'range', min: 1, max: 600, defaultValue: 240, property: 'width' },
    { type: 'color', defaultValue: [66, 135, 245], property: 'colour' },
  ];

  constructor(sides, width, colour) {
    super();
    this.sides = sides;
    this.width = width;
    this.colour = colour;
  }

  draw(elapsed) {
    elapsed *= 10
    this.updateFilters(elapsed);
    const rotation = elapsed * (this.speedMultiplier / 100);
    const rot = Math.round((this.sides - 2) * 180 / this.sides * 2);
    const piv = 360 / this.sides;
    let stt = 0.5 * Math.PI - rad(rot);
    let end = 0;
    const n = this.width / ((this.width / 10) * (this.width / 10));

    for (let i = 1; i < this.sides + 1; i++) {
      end = stt + rad(rot);
      ctx.lineWidth = 5;
      
      ctx.beginPath();
      ctx.arc(
        centerX + Math.cos(rad(90 + piv * i + rotation)) * this.width,
        centerY + Math.sin(rad(90 + piv * i + rotation)) * this.width,
        this.width,
        stt + rad(rotation) - (stt - end) / 2,
        end + rad(rotation) + rad(n),
        0
      );
      ctx.strokeStyle = colourToText(this.colour);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(
        centerX + Math.cos(rad(90 + piv * i - rotation)) * this.width,
        centerY + Math.sin(rad(90 + piv * i - rotation)) * this.width,
        this.width,
        stt - rad(rotation),
        end - (end - stt) / 2 + rad(n) - rad(rotation),
        0
      );
      ctx.strokeStyle = colourToText(this.colour);
      ctx.stroke();

      stt = end + -(rad(rot - piv));
    }
  }
}

shapeRegistry.register('SpiralWormhole', SpiralWormhole);
