class BaseShape {
  constructor() {
    this.controls = []; // Keep track of created elements and event listeners
  }

  initialise(config) {
    for (let item of config) {
      const { element, listener } = addControl(item,this);
      this.controls.push({ element, listener });
    }
  }

  remove() {
    this.controls.forEach(({ element, listener }) => {
      if (element && listener) {
        element.removeEventListener("input", listener);
      }
      if (element && element.parentElement) {
        element.parentElement.removeChild(element);
        const titleElement = document.getElementById("elText" + element.id.slice(2));
        titleElement.parentElement.removeChild(titleElement);
      }
    });
    this.controls = [];
  }

  draw() {
    throw new Error("Draw function not implemented");
  }
}

class PolyTwistColourWidth extends BaseShape {
  constructor(sides, width, depth, rotation, colour1, colour2) {
    super();
    this.sides = sides;
    this.width = width;
    this.depth = depth;
    this.rotation = rotation;
    this.colour1 = colour1;
    this.colour2 = colour2;
  }

  draw(innerRotation) {
    let out_angle = 0;
    const innerAngle = 180 - ((this.sides - 2) * 180) / this.sides;
    const scopeAngle = innerRotation - (innerAngle * Math.floor(innerRotation / innerAngle));

    if (scopeAngle < innerAngle / 2) {
      out_angle = innerAngle / (2 * Math.cos((2 * Math.PI * scopeAngle) / (3 * innerAngle))) - innerAngle / 2;
    } else {
      out_angle = -innerAngle / (2 * Math.cos(((2 * Math.PI) / 3) - ((2 * Math.PI * scopeAngle) / (3 * innerAngle)))) + (innerAngle * 3) / 2;
    }
    let minWidth = Math.sin(rad(innerAngle / 2)) * (0.5 / Math.tan(rad(innerAngle / 2))) * 2;

    let widthMultiplier = minWidth / Math.sin(Math.PI / 180 * (90 + innerAngle / 2 - out_angle + innerAngle * Math.floor(out_angle / innerAngle)));

    for (let i = 0; i < this.depth; i++) {
      const fraction = i / this.depth;
      const ncolour = LerpHex(this.colour1, this.colour2, fraction);
      DrawPolygon(this.sides, this.width * widthMultiplier ** i, out_angle * i + this.rotation , ncolour);
    }
  }
}
class FloralPhyllo extends BaseShape {
  constructor(width, depth, colour1, colour2) {
    super();
    this.width = width;
    this.depth = depth;
    this.colour1 = colour1;
    this.colour2 = colour2;
  }

  draw(angle) {
    // var c = 24; //something to do with width. but not width
    var c = 1; //something to do with width. but not width
    //dont make larger than 270 unless altering the number of colours in lerpedColours
    for (let n = 200; n > 0; n -= 1) {
      const a = n * angle/1000; //137.5;
      const r = c * Math.sqrt(n);
      const x = r * Math.cos(a) + centerX;
      const y = r * Math.sin(a) + centerY;

      drawEyelid(n * 2.4 + 40, x, y, this.colour1);
    }
  }
}
class Spiral1 extends BaseShape {
  constructor(sides,width, colour) {
    super();
    this.sides = sides;
    this.width = width;
    this.colour = colour;
  }

  draw(rotation) {
    var rot = Math.round((this.sides - 2) * 180 / this.sides * 2)
    var piv = 360 / this.sides;
    var stt = 0.5 * Math.PI - rad(rot) //+ rad(rotation);
    var end = 0;
    var n = this.width / ((this.width / 10) * (this.width / 10)) //pixel correction for mid leaf

    for (let i = 1; i < this.sides + 1; i++) {
      end = stt + rad(rot);

      ctx.beginPath();
      ctx.arc(centerX + Math.cos(rad(90 + piv * i + rotation)) * this.width, centerY + Math.sin(rad(90 + piv * i + rotation)) * this.width, this.width, stt + rad(rotation) - (stt - end) / 2, end + rad(rotation) + rad(n), 0);
      ctx.strokeStyle = this.colour;
      ctx.stroke();


      ctx.beginPath();
      ctx.arc(centerX + Math.cos(rad(90 + piv * i - rotation)) * this.width, centerY + Math.sin(rad(90 + piv * i - rotation)) * this.width, this.width, stt - rad(rotation), end - (end - stt) / 2 + rad(n) - rad(rotation), 0);
      ctx.strokeStyle = this.colour;
      ctx.stroke();


      stt = end + -(rad(rot - piv)) //+rad(30);
    }

  }
}

class FloralAccident extends BaseShape {
  constructor(sides,width, colour) {
    super();
    this.sides = sides;
    this.width = width;
    this.colour = colour;
  }

  draw(rotation) {
    var rot = Math.round((this.sides - 2) * 180 / this.sides * 2)
    var piv = 360 / this.sides;
    var stt = 0.5 * Math.PI - rad(rot) //+ rad(rotation);
    var end = 0;
    var n = this.width / ((this.width / 10) * (this.width / 10)) //pixel correction for mid leaf

    for (let i = 1; i < this.sides + 1; i++) {
      end = stt + rad(rot);

      ctx.beginPath();
      ctx.arc(centerX + Math.cos(rad(90 + piv * i + rotation)) * this.width, centerY + Math.sin(rad(90 + piv * i + rotation)) * this.width, this.width, stt - (stt - end + rad(rotation)) / 2, end + rad(n), 0);
      ctx.strokeStyle = this.colour;
      ctx.stroke();


      ctx.beginPath();
      ctx.arc(centerX + Math.cos(rad(90 + piv * i - rotation)) * this.width, centerY + Math.sin(rad(90 + piv * i - rotation)) * this.width, this.width, stt, end - (end - stt - rad(rotation)) / 2 + rad(n), 0);
      ctx.strokeStyle = this.colour;
      ctx.stroke();


      stt = end + -(rad(rot - piv)) //+rad(30);
    }

  }
}
class FloralPhyllo_Accident extends BaseShape {
  constructor(sides,width, colour1,colour2) {
    super();
    this.sides = sides;
    this.width = width;
    this.colour1 = colour1;
    this.colour2 = colour2;
  }

  draw(angle) {

    var c = 24; //something to do with width. but not width

    for (let n = 0; n < 300; n += 1) {
      let ncolour = LerpHex(this.colour1, this.colour2, Math.cos(rad(n / 2)));
      let a = n * (angle/1000+100); //137.5;
      let r = c * Math.sqrt(n);
      let x = r * Math.cos(a) + centerX;
      let y = r * Math.sin(a) + centerY;

      drawEyelidAccident(x, y);

    }
  }
}
class Nodal_expanding extends BaseShape {
  constructor(expand,points,line_width,colour1,colour2,colour_change) {
    super();
    this.expand = expand;
    this.points = points;
    this.line_width = line_width;
    this.colour1 = colour1;
    this.colour2 = colour2;
    this.colour_change = colour_change
  }

  draw(step) {
    let colour_change = this.colour_change/10
    var angle = 360 / this.points * step

    var start_angle = angle;
    var done = false;
    var total_moves = 1;
    var length = this.expand;

    for (let z = 1; z <= 100; z++) { //why specifically 2500
      ctx.beginPath();
      let ncolour = LerpHex(this.colour1, this.colour2, Math.cos(rad(z * colour_change)));

      ctx.moveTo(centerX + (Math.cos(rad(angle * (z - 1) + 0)) * (length - this.expand)), centerY + (Math.sin(rad(angle * (z - 1) + 0)) * (length - this.expand)));
      ctx.lineTo(centerX + (Math.cos(rad(angle * z + 0)) * length), centerY + (Math.sin(rad(angle * z + 0)) * length));
      length += this.expand;
      ctx.lineWidth = this.line_width;//try 1
      ctx.strokeStyle = ncolour;
      // ctx.strokeStyle = colourToText(ncolour);
      console.log(ncolour)
      ctx.stroke();
    }


  }
}
class Nodal extends BaseShape {
  constructor(width,points,line_width,step,colour) {
    super();
    this.width = width;
    this.points = points;
    this.line_width = line_width;
    this.step = step;
    this.colour = colour;
  }
// Draw_nodal(300, 100, 31, rotation, "blue");
  draw(rotate) {
    // console.log(rotate)
    var angle = 360 / this.points * this.step
    ctx.beginPath();
    var start_angle = angle;
    var done = false;
    var total_moves = 1;
    ctx.moveTo(centerX + (Math.cos(rad(angle + rotate)) * this.width), centerY + (Math.sin(rad(angle + rotate)) * this.width));

    while (done != true) {
      if ((total_moves * this.step) % this.points != 0) {
        total_moves++
      }
      else {
        total_moves++
        done = true
      }
    }
    for (let z = 1; z <= total_moves; z++) {
      ctx.lineTo(centerX + (Math.cos(rad(angle * z + rotate)) * this.width), centerY + (Math.sin(rad(angle * z + rotate)) * this.width));
    }
    ctx.lineWidth = this.line_width;//try 1
    ctx.strokeStyle = this.colour;
    ctx.stroke();

  }
}
class Phyllotaxis extends BaseShape {
  constructor(width,nMax,colour1,colour2) {
    super();
    this.width = width;
    this.nMax = nMax;
    this.colour1 = colour1;
    this.colour2 = colour2;
  }
// Draw_nodal(300, 100, 31, rotation, "blue");
  draw(angle) {

    for (let n = 0; n < this.nMax; n += 1) {
      const ncolour = LerpHex(this.colour1, this.colour2, n/this.nMax);
      // const ncolour = LerpHex(this.colour1, this.colour2, (n/this.nMax)**2);
      const a = n * (angle/1000)//137.5;
      const r = this.width * Math.sqrt(n);
      const x = r * Math.cos(a) + centerX;
      const y = r * Math.sin(a) + centerY;

      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = ncolour;
      // ctx.fillStyle = colourToText(ncolour);
      ctx.fill();
      // console.log(this.c)
    }

  }
}
class SquareTwist_angle extends BaseShape {
  constructor(expand,points,line_width,colour1,colour2,colour_change) {
    super();
    this.expand = expand;
    this.points = points;
    this.line_width = line_width;
    this.colour1 = colour1;
    this.colour2 = colour2;
    this.colour_change = colour_change
  }
  drawSquare(angle,size, colour) {
    ctx.save();
    ctx.translate(centerX, centerY)//-(Math.sin(rad(angle)) *centerX));
    ctx.rotate(rad(angle + 180));
    ctx.beginPath();
    ctx.strokeStyle = colour;
    ctx.rect(-size/2, -size/2, size, size);
    ctx.stroke();
    ctx.restore();
    }
    // DrawSquareTwist_angle(400,0,rotation,"red")
  draw (width, rotation,innerRotation, colour){
    let out_angle = innerRotation;
    let widthMultiplier = 1 / (2 * Math.sin(Math.PI / 180 * (130 - out_angle + 90 * Math.floor(out_angle / 90))))+0.5

    for (let i = 0; i < 25; i++) {
      drawSquare(innerRotation*i,width*widthMultiplier**i, colour)
    } 

  }
}
class rectangle_pattern1 extends BaseShape {
  constructor(expand,points,line_width,colour1,colour2,colour_change) {
    super();
    this.expand = expand;
    this.points = points;
    this.line_width = line_width;
    this.colour1 = colour1;
    this.colour2 = colour2;
    this.colour_change = colour_change
  }
  drawSquare(angle,size, colour) {
    ctx.save();
    ctx.translate(centerX, centerY)//-(Math.sin(rad(angle)) *centerX));
    ctx.rotate(rad(angle + 180));
    ctx.beginPath();
    ctx.strokeStyle = colour;
    ctx.rect(-size/2, -size/2, size, size);
    ctx.stroke();
    ctx.restore();
    }
    // Draw_rectangle_pattern1(rotation, squares, 200, "blue");
  draw (rotation, squares, size, colour) {
    for (let z = 0; z < 360; z += 360 / squares) {
      drawSquare(z + rotation,size,colour);
    }
  }
}

