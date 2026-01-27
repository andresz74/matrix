const canvas = document.getElementById("matrixCanvas");
const gl = canvas.getContext("webgl2", { antialias: true });
const statusEl = document.getElementById("status");

if (!gl) {
    if (statusEl) {
        statusEl.textContent = "WebGL2 is required to render the Matrix effect.";
    }
    throw new Error("WebGL2 not supported");
}

const animationState = {
    paused: false,
    pauseOffset: 0,
    lastPauseTime: 0,
};

function togglePause() {
    animationState.paused = !animationState.paused;
    if (animationState.paused) {
        animationState.lastPauseTime = performance.now();
    } else {
        animationState.pauseOffset += performance.now() - animationState.lastPauseTime;
    }
}

function isPaused() {
    return animationState.paused;
}

const vertexSource = `#version 300 es
in vec2 a_position;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const fragmentSource = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 outColor;

float hash(float n) {
    return fract(sin(n) * 43758.5453123);
}

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float glyph(vec2 cellUv, float seed) {
    vec2 grid = floor(cellUv * vec2(5.0, 7.0));
    float index = grid.x + grid.y * 5.0;
    float bit = step(0.5, hash(vec2(index, seed)));
    float edge = smoothstep(0.0, 0.08, min(min(cellUv.x, cellUv.y), min(1.0 - cellUv.x, 1.0 - cellUv.y)));
    return bit * edge;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 centered = vec2(uv.x * aspect, uv.y);

    float columns = 80.0;
    float columnIndex = floor(centered.x * columns);
    float columnSeed = hash(columnIndex);
    float speed = mix(0.3, 1.3, columnSeed);
    float trail = mix(0.2, 0.8, hash(columnIndex + 42.0));

    float flow = fract(u_time * speed + columnSeed);
    float rowPosition = fract(centered.y + flow);

    float head = smoothstep(0.0, 0.1, rowPosition) * smoothstep(1.0, 0.85, rowPosition);

    float cellRows = 60.0;
    vec2 cellUv = vec2(fract(centered.x * columns), fract(centered.y * cellRows));
    float cellId = floor(centered.y * cellRows) + columnIndex * 131.0;
    float glyphVal = glyph(cellUv, cellId);

    float tail = pow(1.0 - rowPosition, 2.0) * trail;
    float brightness = max(head, tail) * glyphVal;

    vec3 color = vec3(0.0, 0.9, 0.2) * brightness;
    outColor = vec4(color, 1.0);
}`;

function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(info || "Shader compile error");
    }
    return shader;
}

function createProgram(vertex, fragment) {
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(info || "Program link error");
    }
    return program;
}

const vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);
const program = createProgram(vertexShader, fragmentShader);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
    ]),
    gl.STATIC_DRAW,
);

const positionLocation = gl.getAttribLocation(program, "a_position");
const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
const timeLocation = gl.getUniformLocation(program, "u_time");

function resizeCanvas() {
    const { width, height } = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function render(timestamp) {
    if (isPaused()) {
        requestAnimationFrame(render);
        return;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    const time = (timestamp - animationState.pauseOffset) * 0.001;
    gl.uniform1f(timeLocation, time);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);

window.addEventListener("keydown", (event) => {
    const key = event.key?.toLowerCase();
    if (event.code === "Space" || key === "p") {
        event.preventDefault();
        togglePause();
    }
});

window.addEventListener("click", () => {
    togglePause();
});
