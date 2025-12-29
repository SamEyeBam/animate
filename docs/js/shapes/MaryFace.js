/**
 * MaryFace - Face overlay with animated eyes
 */
class MaryFace extends BaseShape {
  static config = [
    { type: 'range', min: -400, max: 400, defaultValue: -110, property: 'x1' },
    { type: 'range', min: -400, max: 400, defaultValue: -140, property: 'y1' },
    { type: 'range', min: -180, max: 180, defaultValue: 18, property: 'rotate1' },
    { type: 'range', min: 0, max: 400, defaultValue: 160, property: 'width1' },
    { type: 'range', min: -400, max: 400, defaultValue: 195, property: 'x2' },
    { type: 'range', min: -400, max: 400, defaultValue: -30, property: 'y2' },
    { type: 'range', min: -180, max: 180, defaultValue: 18, property: 'rotate2' },
    { type: 'range', min: 0, max: 400, defaultValue: 160, property: 'width2' },
  ];

  constructor(x1, y1, rotate1, width1, x2, y2, rotate2, width2) {
    super();
    this.x1 = x1;
    this.y1 = y1;
    this.rotate1 = rotate1;
    this.width1 = width1;
    this.x2 = x2;
    this.y2 = y2;
    this.rotate2 = rotate2;
    this.width2 = width2;
    this.eye1 = new EyePrototype(x1, y1, rotate1, 0, width1, 10, 1, 1, 0, 0, 0, 1, [0, 255, 251], [0, 255, 251], [0, 255, 251]);
    this.eye2 = new EyePrototype(x2, y2, rotate2, 0, width2, 10, 1, 1, 0, 0, 0, 1, [0, 255, 251], [0, 255, 251], [0, 255, 251]);
    this.eye3 = new EyePrototype(110, -280, rotate2 + 2, 1, width2, 10, 1, 1, 0, 0, 0, 1, [0, 255, 251], [0, 255, 251], [0, 255, 251]);
  }

  draw(elapsed) {
    const img = new Image();
    img.src = "maryFace.png";

    ctx.drawImage(img, centerX - img.width / 2, centerY - img.height / 2);
    this.eye1.draw(elapsed);
    this.eye2.draw(elapsed);
    this.eye3.draw(elapsed);
  }
}

shapeRegistry.register('MaryFace', MaryFace);
