const canvas = document.getElementById("matrixCanvas");
const gl = canvas.getContext("webgl2", { antialias: true });
const statusEl = document.getElementById("status");

if (!gl) {
    if (statusEl) {
        statusEl.textContent = "WebGL2 is required to render the Matrix effect.";
    }
    throw new Error("WebGL2 not supported");
}

// Matrix Rain Characters
const latinChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()-_=+[]{}|;:',.<>?/`~¡™£¢∞§¶•ªº–≠œ∑´®†¥¨ˆøπ“‘åß∂ƒ©˙∆˚¬Ω≈ç√∫˜µ≤≥÷";
const japaneseChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん一二三四五六七八九十零";
const matrixChars = latinChars + japaneseChars;
const characters = matrixChars.split("");

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
uniform sampler2D u_glyphAtlas;
uniform vec2 u_atlasGrid;
uniform float u_glyphCount;

out vec4 outColor;

float hash(float n) {
    return fract(sin(n) * 43758.5453123);
}

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float glyphAlpha(vec2 cellUv, float glyphIndex) {
    float col = mod(glyphIndex, u_atlasGrid.x);
    float row = floor(glyphIndex / u_atlasGrid.x);
    vec2 atlasUv = (vec2(col, row) + cellUv) / u_atlasGrid;
    return texture(u_glyphAtlas, atlasUv).r;
}

float glyphAlphaBlur(vec2 cellUv, float glyphIndex, float blurStrength) {
    if (blurStrength <= 0.0) {
        return glyphAlpha(cellUv, glyphIndex);
    }
    float offset = 0.02 * blurStrength;
    float base = glyphAlpha(cellUv, glyphIndex) * 0.4;
    float blur = glyphAlpha(cellUv + vec2(offset, 0.0), glyphIndex);
    blur += glyphAlpha(cellUv + vec2(-offset, 0.0), glyphIndex);
    blur += glyphAlpha(cellUv + vec2(0.0, offset), glyphIndex);
    blur += glyphAlpha(cellUv + vec2(0.0, -offset), glyphIndex);
    blur = blur * 0.15;
    return base + blur;
}

float layerRain(vec2 centered, float columns, float rows, float speedMin, float speedMax, float intensity, float seedOffset, float blurStrength) {
    float columnIndex = floor(centered.x * columns);
    float columnSeed = hash(columnIndex + seedOffset);
    float speed = mix(speedMin, speedMax, columnSeed);
    float trail = mix(0.2, 0.8, hash(columnIndex + 42.0 + seedOffset));

    float flow = fract(u_time * speed + columnSeed);
    float rowPosition = fract(centered.y + flow);

    float head = smoothstep(0.0, 0.1, rowPosition) * smoothstep(1.0, 0.85, rowPosition);

    vec2 cellUv = vec2(fract(centered.x * columns), fract(centered.y * rows));
    float cellId = floor(centered.y * rows) + columnIndex * 131.0 + seedOffset * 17.0;
    float glyphIndex = floor(hash(cellId) * u_glyphCount);
    float glyph = glyphAlphaBlur(cellUv, glyphIndex, blurStrength);

    float tail = pow(1.0 - rowPosition, 2.0) * trail;
    float brightness = max(head, tail) * glyph;

    return brightness * intensity;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 centered = vec2(uv.x * aspect, uv.y);

    float farLayer = layerRain(centered * vec2(1.04, 1.0), 120.0, 95.0, 0.08, 0.35, 0.35, 19.0, 0.0);
    float midLayer = layerRain(centered * vec2(1.02, 1.0), 90.0, 70.0, 0.18, 0.55, 0.65, 7.0, 1.0);
    float nearLayer = layerRain(centered, 70.0, 50.0, 0.25, 0.8, 1.0, 0.0, 0.0);

    vec3 farColor = vec3(0.0, 0.6, 0.15) * farLayer;
    vec3 midColor = vec3(0.0, 0.8, 0.2) * midLayer;
    vec3 nearColor = vec3(0.0, 0.95, 0.25) * nearLayer;

    vec3 color = farColor + midColor + nearColor;
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

function createGlyphAtlas(glyphs) {
    const glyphSize = 32;
    const columns = 16;
    const rows = Math.ceil(glyphs.length / columns);
    const atlasCanvas = document.createElement("canvas");
    atlasCanvas.width = columns * glyphSize;
    atlasCanvas.height = rows * glyphSize;

    const ctx = atlasCanvas.getContext("2d");
    ctx.clearRect(0, 0, atlasCanvas.width, atlasCanvas.height);
    ctx.fillStyle = "white";
    ctx.font = "24px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    glyphs.forEach((glyph, index) => {
        const x = (index % columns) * glyphSize + glyphSize / 2;
        const y = Math.floor(index / columns) * glyphSize + glyphSize / 2;
        ctx.fillText(glyph, x, y);
    });

    return {
        canvas: atlasCanvas,
        columns,
        rows,
        glyphCount: glyphs.length,
    };
}

const atlas = createGlyphAtlas(characters);

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
const atlasGridLocation = gl.getUniformLocation(program, "u_atlasGrid");
const glyphCountLocation = gl.getUniformLocation(program, "u_glyphCount");
const glyphAtlasLocation = gl.getUniformLocation(program, "u_glyphAtlas");

const glyphTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, glyphTexture);
gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.R8,
    gl.RED,
    gl.UNSIGNED_BYTE,
    atlas.canvas,
);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

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
    gl.uniform2f(atlasGridLocation, atlas.columns, atlas.rows);
    gl.uniform1f(glyphCountLocation, atlas.glyphCount);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, glyphTexture);
    gl.uniform1i(glyphAtlasLocation, 0);

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
