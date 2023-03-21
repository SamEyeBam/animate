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

