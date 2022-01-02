// import math from "math.js";

class Cube {
  constructor(ctx, width, x, y, z, rx, ry, rz, color, solid) {
    this.ctx = ctx;
    this.color = color;
    this.width = width;
    this.solid = solid;
    this.maxRadius = this.width / Math.cos(degToRad(45)); //TODO trig
    this.pointsOrg = [];
    this.pointsOrg.push([-this.width / 2, -this.width / 2, -this.width / 2]);
    this.pointsOrg.push([this.width / 2, -this.width / 2, -this.width / 2]);
    this.pointsOrg.push([this.width / 2, this.width / 2, -this.width / 2]);
    this.pointsOrg.push([-this.width / 2, this.width / 2, -this.width / 2]);

    this.pointsOrg.push([-this.width / 2, -this.width / 2, this.width / 2]);
    this.pointsOrg.push([this.width / 2, -this.width / 2, this.width / 2]);
    this.pointsOrg.push([this.width / 2, this.width / 2, this.width / 2]);
    this.pointsOrg.push([-this.width / 2, this.width / 2, this.width / 2]);

    this.points = JSON.parse(JSON.stringify(this.pointsOrg));
    this.centerX = 0;
    this.centerY = 0;
    this.globalX = x;
    this.globalY = y;
    this.globalZ = z; //might not need

    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;
  }
  draw() {
    let projPoints = [];
    for (let i = 0; i < this.points.length; i++) {
      projPoints.push(projectionOrth(this.points[i]));
    }

    if (this.solid) {
      this.ctx.fillStyle = this.color;
    } else {
      this.ctx.strokeStyle = this.color;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(
      this.globalX + projPoints[0][0],
      this.globalY + projPoints[0][1]
    );
    for (let i = 1; i < 4; i++) {
      this.ctx.lineTo(
        this.globalX + projPoints[i][0],
        this.globalY + projPoints[i][1]
      );
    }
    this.ctx.lineTo(
      this.globalX + projPoints[0][0],
      this.globalY + projPoints[0][1]
    );

    this.ctx.moveTo(
      this.globalX + projPoints[4][0],
      this.globalY + projPoints[4][1]
    );
    for (let i = 5; i < 8; i++) {
      this.ctx.lineTo(
        this.globalX + projPoints[i][0],
        this.globalY + projPoints[i][1]
      );
    }
    this.ctx.lineTo(
      this.globalX + projPoints[4][0],
      this.globalY + projPoints[4][1]
    );

    for (let i = 0; i < 4; i++) {
      this.ctx.moveTo(
        this.globalX + projPoints[i][0],
        this.globalY + projPoints[i][1]
      );
      this.ctx.lineTo(
        this.globalX + projPoints[i + 4][0],
        this.globalY + projPoints[i + 4][1]
      );
    }

    if (this.solid) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }
  drawCenter(x, y, width, color) {
    let testLineX = new Line(
      this.ctx,
      [x + this.centerX - width, y + this.centerY],
      [x + this.centerX + width, y + this.centerY],
      color
    );
    let testLineY = new Line(
      this.ctx,
      [x + this.centerX, y + this.centerY - width],
      [x + this.centerX, y + this.centerY + width],
      color
    );

    testLineX.draw();
    testLineY.draw();
  }
  rotateAddX(deg) {
    this.rotX += deg;
    for (let i = 0; i < this.points.length; i++) {
      this.points[i] = rotateMatrix3dX(this.points[i], deg);
    }
  }
  rotateAddY(deg) {
    this.rotY += deg;
    for (let i = 0; i < this.points.length; i++) {
      this.points[i] = rotateMatrix3dY(this.points[i], deg);
    }
  }
  rotateAddZ(deg) {
    this.rotZ += deg;
    for (let i = 0; i < this.points.length; i++) {
      this.points[i] = rotateMatrix3dZ(this.points[i], deg);
    }
    console.log(this.rotZ);
  }
  rotateSetOrg(x, y, z) {
    for (let i = 0; i < this.points.length; i++) {
      this.pointsOrg[i] = rotateMatrix3dX(this.pointsOrg[i], x);
    }
    for (let i = 0; i < this.points.length; i++) {
      this.pointsOrg[i] = rotateMatrix3dZ(this.pointsOrg[i], y);
    }
    for (let i = 0; i < this.points.length; i++) {
      this.pointsOrg[i] = rotateMatrix3dZ(this.pointsOrg[i], z);
    }

    this.points = JSON.parse(JSON.stringify(this.pointsOrg));
  }
}
class Tetrahedron {
  constructor(ctx, width, x, y, z, rx, ry, rz, color, solid) {
    this.ctx = ctx;
    this.color = color;
    this.width = width;
    this.solid = solid;
    this.maxRadius = this.width / Math.cos(degToRad(45)); //TODO trig
    this.pointsOrg = [];
    // this.pointsOrg.push([-1 * width, 1 * width, -1 * width]);
    // this.pointsOrg.push([1 * width, 1 * width, 1 * width]);
    // this.pointsOrg.push([1 * width, -1 * width, -1 * width]);
    // this.pointsOrg.push([-1 * width, -1 * width, 1 * width]);

    this.pointsOrg.push([1 * width, 1 * width, 1 * width]);
    this.pointsOrg.push([1 * width, -1 * width, -1 * width]);
    this.pointsOrg.push([-1 * width, 1 * width, -1 * width]);
    this.pointsOrg.push([-1 * width, -1 * width, 1 * width]);

    // this.pointsOrg.push([(8/9)^.5 * width, 0, -1/3 * width]);
    // this.pointsOrg.push([-(2/9)^.5 * width, (2/3)^.5 * width, -1/3 * width]);
    // this.pointsOrg.push([-(2/9)^.5 * width, -(2/3)^.5 * width, -1/3 * width]);
    // this.pointsOrg.push([0,0, 1 * width]);

    this.points = JSON.parse(JSON.stringify(this.pointsOrg));
    this.centerX = 0;
    this.centerY = 0;
    this.globalX = x;
    this.globalY = y;

    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;

    this.rotateSetOrg(rx, ry, rz);
    
  }
  draw() {
    let projPoints = [];
    for (let i = 0; i < this.points.length; i++) {
      projPoints.push(projectionOrth(this.points[i]));
    }

    if (this.solid) {
      this.ctx.fillStyle = this.color;
    } else {
      this.ctx.strokeStyle = this.color;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(
      this.globalX + projPoints[0][0],
      this.globalY + projPoints[0][1]
    );
    for (let i = 1; i < 3; i++) {
      this.ctx.lineTo(
        this.globalX + projPoints[i][0],
        this.globalY + projPoints[i][1]
      );
    }
    this.ctx.lineTo(
      this.globalX + projPoints[0][0],
      this.globalY + projPoints[0][1]
    );
    this.ctx.lineTo(
      this.globalX + projPoints[3][0],
      this.globalY + projPoints[3][1]
    );
    this.ctx.lineTo(
      this.globalX + projPoints[1][0],
      this.globalY + projPoints[1][1]
    );
    this.ctx.moveTo(
      this.globalX + projPoints[3][0],
      this.globalY + projPoints[3][1]
    );
    this.ctx.lineTo(
      this.globalX + projPoints[2][0],
      this.globalY + projPoints[2][1]
    );

    if (this.solid) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }
  drawCenter(x, y, width, color) {
    let testLineX = new Line(
      this.ctx,
      [x + this.centerX - width, y + this.centerY],
      [x + this.centerX + width, y + this.centerY],
      color
    );
    let testLineY = new Line(
      this.ctx,
      [x + this.centerX, y + this.centerY - width],
      [x + this.centerX, y + this.centerY + width],
      color
    );

    testLineX.draw();
    testLineY.draw();
  }
  
  rotateAddX(deg) {
    this.rotX += deg;
    for (let i = 0; i < this.points.length; i++) {
      this.points[i] = rotateMatrix3dX(this.points[i], deg);
    }
  }
  rotateAddY(deg) {
    this.rotY += deg;
    for (let i = 0; i < this.points.length; i++) {
      this.points[i] = rotateMatrix3dY(this.points[i], deg);
    }
  }
  rotateAddZ(deg) {
    this.rotZ += deg;
    for (let i = 0; i < this.points.length; i++) {
      this.points[i] = rotateMatrix3dZ(this.points[i], deg);
    }
    console.log(this.rotZ);
  }
  rotateSetOrg(x, y, z) {
    for (let i = 0; i < this.points.length; i++) {
      this.pointsOrg[i] = rotateMatrix3dX(this.pointsOrg[i], x);
    }
    for (let i = 0; i < this.points.length; i++) {
      this.pointsOrg[i] = rotateMatrix3dZ(this.pointsOrg[i], y);
    }
    for (let i = 0; i < this.points.length; i++) {
      this.pointsOrg[i] = rotateMatrix3dZ(this.pointsOrg[i], z);
    }

    this.points = JSON.parse(JSON.stringify(this.pointsOrg));
  }
}

class Square {
  constructor(ctx, width, x, y, color, solid) {
    this.ctx = ctx;
    this.color = color;
    this.width = width;
    this.solid = solid;
    this.maxRadius = this.width / Math.cos(degToRad(45));
    this.points = [];
    this.points.push([-this.width / 2, -this.width / 2, 0]);
    this.points.push([this.width / 2, -this.width / 2, 0]);
    this.points.push([this.width / 2, this.width / 2, 0]);
    this.points.push([-this.width / 2, this.width / 2, 0]);

    this.centerX = 0;
    this.centerY = 0;
    this.globalX = x;
    this.globalY = y;
  }
  draw() {
    if (this.solid) {
      this.ctx.fillStyle = this.color;
    } else {
      this.ctx.strokeStyle = this.color;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(
      this.globalX + this.points[0][0],
      this.globalY + this.points[0][1]
    );
    for (let i = 1; i < this.points.length; i++) {
      this.ctx.lineTo(
        this.globalX + this.points[i][0],
        this.globalY + this.points[i][1]
      );
    }
    this.ctx.lineTo(
      this.globalX + this.points[0][0],
      this.globalY + this.points[0][1]
    );

    if (this.solid) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }
  drawCenter(x, y, width, color) {
    let testLineX = new Line(
      this.ctx,
      [x + this.centerX - width, y + this.centerY],
      [x + this.centerX + width, y + this.centerY],
      color
    );
    let testLineY = new Line(
      this.ctx,
      [x + this.centerX, y + this.centerY - width],
      [x + this.centerX, y + this.centerY + width],
      color
    );

    testLineX.draw();
    testLineY.draw();
  }
  rotateAdd(deg) {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i] = rotateMatrix2d(this.points[i], deg);
    }
  }
  rotateSet(deg) {}
}

class RandomPolygon {
  constructor(ctx, width, x, y, sides, color) {
    this.ctx = ctx;
    this.color = color;
    this.sides = sides;
    this.width = width;
    this.maxRadius = this.width / Math.cos(degToRad(45));
    this.points = [];
    for (let i = 0; i < sides; i++) {
      const rndNumX = Math.random() * 2 - 1;
      const rndNumY = Math.random() * 2 - 1;
      const rndPointX = (this.width * rndNumX) / 2;
      const rndPointY = (this.width * rndNumY) / 2;
      this.points.push([Math.round(rndPointX), Math.round(rndPointY)]);
    }
    this.globalX = x;
    this.globalY = y;
    this.centerX;
    this.centerY;

    this.findCenter();
    for (let i = 0; i < this.points.length; i++) {
      this.points[i][0] -= this.centerX;
      this.points[i][1] -= this.centerY;
    }
    this.findCenter();
  }
  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.moveTo(
      this.globalX + this.points[0][0],
      this.globalY + this.points[0][1]
    );
    for (let i = 1; i < this.points.length; i++) {
      this.ctx.lineTo(
        this.globalX + this.points[i][0],
        this.globalY + this.points[i][1]
      );
    }
    this.ctx.fill();
  }
  drawCenter(x, y, width, color) {
    let testLineX = new Line(
      this.ctx,
      [x + this.centerX - width, y + this.centerY],
      [x + this.centerX + width, y + this.centerY],
      color
    );
    let testLineY = new Line(
      this.ctx,
      [x + this.centerX, y + this.centerY - width],
      [x + this.centerX, y + this.centerY + width],
      color
    );

    testLineX.draw();
    testLineY.draw();
  }
  findCenter() {
    let xTot = 0;
    let yTot = 0;
    for (let i = 0; i < this.points.length; i++) {
      xTot += this.points[i][0];
      yTot += this.points[i][1];
    }
    this.centerX = xTot / this.points.length;
    this.centerY = yTot / this.points.length;
  }
}

class Line {
  constructor(ctx, p1, p2, color) {
    this.ctx = ctx;
    this.p1 = p1;
    this.p2 = p2;
    this.color = color;
  }
  draw() {
    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath();
    this.ctx.moveTo(this.p1[0], this.p1[1]);
    this.ctx.lineTo(this.p2[0], this.p2[1]);
    this.ctx.closePath();
    this.ctx.stroke();
  }
}

class DebugTools {
  constructor(ctx, centerX, centerY) {
    this.ctx = ctx;
    this.centerX = centerX;
    this.centerY = centerY;
  }

  drawCenter(width) {
    let centerLineX = new Line(
      this.ctx,
      [this.centerX - width, this.centerY],
      [this.centerX + width, this.centerY],
      "orange"
    );
    let centerLineY = new Line(
      this.ctx,
      [this.centerX, this.centerY - width],
      [this.centerX, this.centerY + width],
      "orange"
    );
    centerLineX.draw();
    centerLineY.draw();
  }
}
