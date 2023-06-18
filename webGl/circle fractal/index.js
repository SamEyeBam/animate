// Get a reference to the canvas element
const canvas = document.getElementById('canvas');

// Set up WebGL context
const gl = canvas.getContext('webgl');
// Set the canvas size and WebGL viewport
canvas.width = 800;
canvas.height = 800;
//   let centerX = canvas.width / 2;
//   let centerY = canvas.height / 2;
gl.viewport(0, 0, canvas.width, canvas.height);
// Create vertex shader
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
    
    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
        vec2 uv0 = uv;
        vec3 colour = vec3(1.0, 1.5, 2.0);
        vec3 colour2 = vec3(0.2, 0.2, 1.0);
        float pi = 3.1415926;
    
        for (float i = 0.0; i < 2.0; i++) {
            uv = fract(uv * 1.5) - 0.5;
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

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// Create vertex buffer
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
const positionAttributeLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

// Set uniforms
const iResolutionLocation = gl.getUniformLocation(program, 'iResolution');
gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);

// Render the shader
function render() {
    gl.uniform1f(gl.getUniformLocation(program, 'iTime'), performance.now() / 1000.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}

render();