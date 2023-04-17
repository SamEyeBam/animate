const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    alert('WebGL is not supported in your browser.');
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const vertices = [
    -0.5, -0.5,
    0.5, -0.5,
    0.5, 0.5,
    -0.5, 0.5,
];

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

const vertexShaderSource = `
    attribute vec2 a_position;

    uniform vec2 u_resolution;
    uniform vec2 u_translation;
    uniform vec2 u_scale;

    void main() {
        vec2 scaledPosition = a_position * u_scale;
        vec2 position = scaledPosition + u_translation;

        vec2 zeroToOne = position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShaderSource = `
    precision mediump float;

    void main() {
        gl_FragColor = vec4(1, 0, 0, 1);
    }
`;

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
const translationUniformLocation = gl.getUniformLocation(program, 'u_translation');
const scaleUniformLocation = gl.getUniformLocation(program, 'u_scale');

function drawScene() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

    const squareWidth = 50;
    const squareHeight = 50;
    const xCenter = (canvas.width - squareWidth) / 2;
    const yCenter = (canvas.height - squareHeight) / 2;
    gl.uniform2f(translationUniformLocation, xCenter, yCenter);

    gl.uniform2f(scaleUniformLocation, squareWidth, squareHeight);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    requestAnimationFrame(drawScene);
}

drawScene();

