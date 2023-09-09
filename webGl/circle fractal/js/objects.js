class BaseShape {
  constructor() {
    this.controls = []; // Keep track of created elements and event listeners
    this.speedMultiplier = 100;
  }

  initialise(config) {
    for (let item of config) {
      const { element, listener } = addControl(item, this);
      this.controls.push({ element, listener });
    }

    const { element, listener } = addControl({ type: "range", min: 1, max: 500, defaultValue: 100, property: "speedMultiplier", }, this);
    this.controls.push({ element, listener });
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


class EyePrototype extends BaseShape {
  constructor(Val1) {
    super();
    this.Val1 = Val1;
    this.iVal1Location = "";
    this.iResolutionLocation = ""//gl.getUniformLocation(this.program, 'iResolution');
    this.program = gl.createProgram();
  }
  initialise(config) {
    for (let item of config) {
      const { element, listener } = addControl(item, this);
      this.controls.push({ element, listener });
    }

    const { element, listener } = addControl({ type: "range", min: 1, max: 500, defaultValue: 100, property: "speedMultiplier", }, this);
    this.controls.push({ element, listener });

    const vertexShaderSource = `
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
`;

    // Create fragment shader using the code you wrote
    const fragmentShaderSource = `
    precision mediump float;
    uniform vec2 iResolution;
    uniform float iTime;
    uniform float iVal1;
    
    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
        vec2 uv0 = uv;
        vec3 colour = vec3(1.0, 1.5, 2.0);
        vec3 colour2 = vec3(0.2, 0.2, 1.0);
        float pi = 3.1415926;
        float val1Div = iVal1/10.0;
        
    
        for (float i = 0.0; i < 2.0; i++) {
            uv = fract(uv * val1Div) - 0.5;
            float distance = length(uv);
    
            distance = sin(distance * pi * 5.0 - iTime) / (pi * 5.0);
            distance = abs(distance);
            distance = 0.02 / distance;
    
            colour = mix(colour, colour2, length(uv));
    
            colour *= distance;
        }
        
        float distance = length(uv0);
        distance = sin(distance * pi * 5.0 - iTime) / (pi * 5.0);
        distance = abs(distance);
        distance = 0.02 / distance;
    
        colour = mix(colour, colour2, length(uv0));
        colour *= distance;
    
        fragColor = vec4(colour, 1.0);
    }
    
    void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        vec2 iResolution = vec2(${canvas.width.toFixed(1)}, ${canvas.height.toFixed(1)});
        
        float iTime = ${performance.now().toFixed(3)} / 1000.0;
        vec4 fragColor;
        mainImage(fragColor, fragCoord);
        gl_FragColor = fragColor;
    }
`;

    // Compile and link shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // const this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);
    gl.useProgram(this.program);

    // Create vertex buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const positionAttributeLocation = gl.getAttribLocation(this.program, 'position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Set uniforms
    this.iResolutionLocation = gl.getUniformLocation(this.program, 'iResolution');
    this.iVal1Location = gl.getUniformLocation(this.program, 'iVal1');
    
  }

  draw(rotation) {

    gl.uniform2f(this.iResolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(gl.getUniformLocation(this.program, 'iTime'), performance.now() / 1000.0);
    gl.uniform1f(this.iVal1Location, this.Val1);
    
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // requestAnimationFrame(render);
  }
}


