// Matrix Rain Characters
const latinChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()-_=+[]{}|;:',.<>?/`~¡™£¢∞§¶•ªº–≠œ∑´®†¥¨ˆøπ“‘åß∂ƒ©˙∆˚¬Ω≈ç√∫˜µ≤≥÷";
const japaneseChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん一二三四五六七八九十零";
const matrixChars = latinChars + japaneseChars;
const characters = matrixChars.split("");


const animationState = {
    paused: false,
};

function togglePause() {
    animationState.paused = !animationState.paused;
}

function isPaused() {
    return animationState.paused;
}

// Utility: Set canvas dimensions to window size with devicePixelRatio support
function resizeCanvas(canvas, ctx = canvas.getContext("2d")) {
    const { width, height } = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    return { width, height };
}

// Matrix Rain Animation
function matrixRain(
    canvasId,
    {
        speedFactor = 0.9,
        color = "#0F0",
        opacity = 0.05,
        fontSize = 16,
        delayFactor = 2,
        fps = 30,
    },
) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    let canvasWidth = 0;
    let canvasHeight = 0;
    let columns = 0;
    let drops = [];
    let delays = [];

    const updateCanvasMetrics = () => {
        const { width, height } = resizeCanvas(canvas, ctx);
        canvasWidth = width;
        canvasHeight = height;
        columns = Math.floor(canvasWidth / fontSize);
        drops = new Array(columns).fill(0);
        delays = new Array(columns).fill(0); // Delay timers for each column
    };

    // Set initial canvas size
    updateCanvasMetrics();
    window.addEventListener("resize", updateCanvasMetrics);

    const frameInterval = 1000 / fps;
    let lastFrameTime = 0;

    const drawMatrix = (timestamp) => {
        if (isPaused()) {
            requestAnimationFrame(drawMatrix);
            return;
        }

        if (timestamp - lastFrameTime < frameInterval) {
            requestAnimationFrame(drawMatrix);
            return;
        }
        lastFrameTime = timestamp;

        // Clear the canvas with a trailing effect
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Set text style
        ctx.fillStyle = color;
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = characters[Math.floor(Math.random() * characters.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            ctx.fillText(text, x, y);

            // Move the drop down based on delay
            if (delays[i] <= 0) {
                drops[i] += 1; // Move down one step
                delays[i] = Math.random() * (delayFactor / speedFactor); // Reset delay with layer-specific delayFactor
            } else {
                delays[i] -= 1; // Reduce delay
            }

            // Reset drop to the top randomly
            if (y > canvasHeight && Math.random() > 0.975) {
                drops[i] = 0; // Reset to the top
            }
        }

        requestAnimationFrame(drawMatrix);
    };

    drawMatrix();
    return canvas;
}



// Matrix Overlay Animation
function matrixOverlay(
    canvasId,
    {
        fontSize = 16,
        color = "rgba(255, 255, 255, 0.8)",
        blinkSpeed = 400,
        fps = 20,
    },
) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    let canvasWidth = 0;
    let canvasHeight = 0;

    const updateCanvasMetrics = () => {
        const { width, height } = resizeCanvas(canvas, ctx);
        canvasWidth = width;
        canvasHeight = height;
    };

    // Set initial canvas size
    updateCanvasMetrics();
    window.addEventListener("resize", updateCanvasMetrics);

    const frameInterval = 1000 / fps;
    let lastFrameTime = 0;
    let lastBlinkTime = 0;

    const drawOverlay = (timestamp) => {
        if (isPaused()) {
            requestAnimationFrame(drawOverlay);
            return;
        }

        if (timestamp - lastFrameTime < frameInterval) {
            requestAnimationFrame(drawOverlay);
            return;
        }
        lastFrameTime = timestamp;

        if (timestamp - lastBlinkTime >= blinkSpeed) {
            lastBlinkTime = timestamp;
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.fillStyle = color;
            ctx.font = `${fontSize}px monospace`;

            // Draw random characters at random positions
            for (let i = 0; i < 10; i++) {
                const text = characters[Math.floor(Math.random() * characters.length)];
                const x = Math.random() * canvasWidth;
                const y = Math.random() * canvasHeight;

                ctx.fillText(text, x, y);
            }
        }

        requestAnimationFrame(drawOverlay);
    };

    drawOverlay();
    return canvas;
}

function toggleBlurWithAnimation(canvasId, interval = 1000) {
    const canvas = document.getElementById(canvasId);
    let lastTime = 0; // Tracks the last time the blur was toggled
    let isBlurred = false;

    const toggleBlur = (timestamp) => {
        if (isPaused()) {
            requestAnimationFrame(toggleBlur);
            return;
        }

        // Check if enough time has passed since the last toggle
        if (timestamp - lastTime >= interval) {
            lastTime = timestamp; // Update the last toggle time
            isBlurred = !isBlurred; // Toggle blur state
            if (isBlurred) {
                canvas.classList.add("blur");
            } else {
                canvas.classList.remove("blur");
            }
        }

        requestAnimationFrame(toggleBlur); // Schedule the next frame
    };

    requestAnimationFrame(toggleBlur); // Start the animation
}

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

// Start animations
matrixRain("matrixCanvas1", { speedFactor: 0.9, fontSize: 8, delayFactor: 1, fps: 30 });  // Faster updates
matrixRain("matrixCanvas2", { speedFactor: 0.6, fontSize: 12, delayFactor: 6, fps: 30 }); // Balanced speed
matrixRain("matrixCanvas3", { speedFactor: 0.8, fontSize: 12, delayFactor: 4, fps: 24 }); // Slower, dramatic effect

matrixOverlay("overlayCanvas", { fontSize: 12, blinkSpeed: 400, fps: 15 });
// Call the function to toggle blur
toggleBlurWithAnimation("overlayCanvas", 3000); // Toggle blur every 3 seconds
