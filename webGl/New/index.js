// Get the canvas element and create a WebGL context
const canvas = document.getElementById('canvas');
const canvas2d = document.getElementById('canvas2d');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
let ctx = canvas2d.getContext("2d");
ctx.canvas.width = 800;
ctx.canvas.height = 800;

// Check if WebGL is available
if (!gl) {
  alert('WebGL not supported in your browser.');
} else {
  // Set the canvas size and WebGL viewport
  canvas.width = 800;
  canvas.height = 800;
  let centerX = ctx.canvas.width / 2;
  let centerY = ctx.canvas.height / 2;
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Define the vertex shader source code
  const glsl = x => x;
  const vertexShaderSource = glsl`
    attribute vec2 position;
    uniform float u_rotation;
    uniform vec2 u_pos;
    void main() {
      float centerX = 0.0;
      float centerY = 0.0;
      float xPos = position.x;
      float yPos = position.y;
      float x = xPos * cos(u_rotation) - yPos * sin(u_rotation);
      float y = yPos * cos(u_rotation) + xPos * sin(u_rotation);
      gl_Position = vec4(x+u_pos.x , y+u_pos.y , 0, 1);
    }
  `;

  // Define the fragment shader source code
  const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 fColor;
    void main() {
      gl_FragColor = fColor;
    }
  `;

  // Create and compile the vertex and fragment shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Create a program, attach the shaders, and link the program
  const program = createProgram(gl, vertexShader, fragmentShader);

  // Get the attribute and uniform locations
  const positionAttributeLocation = gl.getAttribLocation(program, 'position');
  const positionLocalAttributeLocation = gl.getUniformLocation(program, 'u_pos');
  const rotationUniformLocation = gl.getUniformLocation(program, 'u_rotation');
  const fColorLocation = gl.getUniformLocation(program, "fColor");

  // Create a buffer to store vertex positions
  const positionBuffer = gl.createBuffer();

  function polyPoints(sides) {
    let pointsArr = [];
    let width = 1;
    let rotation = 0
    pointsArr.push(width * Math.cos((rotation * Math.PI) / 180));
    pointsArr.push(width * Math.sin((rotation * Math.PI) / 180))
    for (let i = 0; i < sides; i++) {
      pointsArr.push(width * Math.cos((i * 2 * Math.PI) / sides + (rotation * Math.PI) / 180))
      pointsArr.push(width * Math.sin((i * 2 * Math.PI) / sides + (rotation * Math.PI) / 180))
    }
    return pointsArr
  }


  function rad(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }

  // Function to create and compile a shader
  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    }
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  // Function to create a program and link shaders
  function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return program;
    }
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }
  // Function to draw the scene
  let prevTime = 0
  function drawScene(time) {
    // Convert time to seconds
    // console.log(time - prevTime)
    prevTime = time
    time *= 0.001;

    // Clear the canvas with a black background
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Use the shader program
    gl.useProgram(program);

    // Enable the position attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    // Create a buffer to store vertex positions
    let blue = [0.17, 0.49, 0.85] //blue
    let green = [0.17, 0.85, 0.46] //green
    let pink = [0.96, 0.24, 0.86] //green

    render_clear();
    for (let i = 0; i < 10000; i++) {
      DrawPolygon(4, 400, (0+time)*i*0.1, "Crimson")
      // drawPoly(4, time * i * 0.001, blue, 0, 0)
    }

    Draw_center()
    drawCircle()
    // console.log(time)
    // Request the next frame to be drawn
    requestAnimationFrame(drawScene);
  }
  
  const positions1 = polyPoints(4)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions1), gl.STATIC_DRAW);
  function drawPoly(sides, speed, colour, x, y) {
    gl.uniform1f(rotationUniformLocation, speed);
    gl.uniform4f(fColorLocation, colour[0], colour[1], colour[2], 1);
    gl.uniform2f(positionLocalAttributeLocation, x, y);
    
    gl.drawArrays(gl.LINE_LOOP, 0, positions1.length / 2);
  }

  // Start rendering the scene
  requestAnimationFrame(drawScene);
  function Draw_center() {
    ctx.beginPath();
    ctx.moveTo(centerX - 400, centerY);
    ctx.lineTo(centerX + 400, centerY);
    ctx.moveTo(centerX, centerY - 400);
    ctx.lineTo(centerX, centerY + 400);
    ctx.strokeStyle = "green";
    ctx.stroke();
    // console.log("drawn center")
  }
  function drawCircle() {
    ctx.beginPath();
    ctx.arc(centerX, centerY, 400, 0, 2 * Math.PI, false);
    ctx.strokeStyle = "green";
    ctx.stroke();
  }
  function DrawPolygon(sides, width, rotation, colour) {
    ctx.beginPath();
    ctx.moveTo(
      centerX + width * Math.cos((rotation * Math.PI) / 180),
      centerY + width * Math.sin((rotation * Math.PI) / 180)
    );

    for (var i = 1; i <= sides; i += 1) {
      ctx.lineTo(
        centerX + width * Math.cos((i * 2 * Math.PI) / sides + (rotation * Math.PI) / 180),
        centerY + width * Math.sin((i * 2 * Math.PI) / sides + (rotation * Math.PI) / 180)
      );
    }

    ctx.strokeStyle = colour;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  function render_clear() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "rgb(0,0,0,0)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}