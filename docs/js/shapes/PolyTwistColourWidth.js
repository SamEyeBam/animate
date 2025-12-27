/**
 * PolyTwistColourWidth - Twisted polygon with color gradient
 */
class PolyTwistColourWidth extends BaseShape {
  static config = [
    { type: 'range', min: 3, max: 10, defaultValue: 5, property: 'sides' },
    { type: 'range', min: 400, max: 2000, defaultValue: 400, property: 'width' },
    { type: 'range', min: 2, max: 5, defaultValue: 5, property: 'line_width' },
    { type: 'range', min: 1, max: 100, defaultValue: 50, property: 'depth' },
    { type: 'range', min: -180, max: 180, defaultValue: -90, property: 'rotation' },
    { type: 'color', defaultValue: '#4287f5', property: 'colour1' },
    { type: 'color', defaultValue: '#42f57b', property: 'colour2' },
  ];

  constructor(sides, width, line_width, depth, rotation, colour1, colour2) {
    super();
    this.sides = sides;
    this.width = width;
    this.line_width = line_width;
    this.depth = depth;
    this.rotation = rotation;
    this.colour1 = colour1;
    this.colour2 = colour2;
  }

  draw(elapsed) {
    this.updateFilters(elapsed);
    const rotation = elapsed * (this.speedMultiplier / 100);
    
    let out_angle = 0;
    const innerAngle = 180 - ((this.sides - 2) * 180) / this.sides;
    const scopeAngle = rotation - (innerAngle * Math.floor(rotation / innerAngle));

    if (scopeAngle < innerAngle / 2) {
      out_angle = innerAngle / (2 * Math.cos((2 * Math.PI * scopeAngle) / (3 * innerAngle))) - innerAngle / 2;
    } else {
      out_angle = -innerAngle / (2 * Math.cos(((2 * Math.PI) / 3) - ((2 * Math.PI * scopeAngle) / (3 * innerAngle)))) + (innerAngle * 3) / 2;
    }
    const minWidth = Math.sin(rad(innerAngle / 2)) * (0.5 / Math.tan(rad(innerAngle / 2))) * 2;
    const widthMultiplier = minWidth / Math.sin(Math.PI / 180 * (90 + innerAngle / 2 - out_angle + innerAngle * Math.floor(out_angle / innerAngle)));

    for (let i = 0; i < this.depth; i++) {
      const fraction = i / this.depth;
      const ncolour = LerpHex(this.colour1, this.colour2, fraction);
      DrawPolygon(this.sides, this.width * widthMultiplier ** i, out_angle * i + this.rotation, ncolour, this.line_width);
    }
  }
}

shapeRegistry.register('PolyTwistColourWidth', PolyTwistColourWidth);
