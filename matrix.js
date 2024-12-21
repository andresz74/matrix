// Matrix Rain Characters
const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()-_=+[]{}|;:',.<>?/`~¡™£¢∞§¶•ªº–≠œ∑´®†¥¨ˆøπ“‘åß∂ƒ©˙∆˚¬Ω≈ç√∫˜µ≤≥÷アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん一二三四五六七八九十零";
const characters = matrixChars.split("");


// Utility: Set canvas dimensions to window size
function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Matrix Rain Animation
function matrixRain(canvasId, { speedFactor = 0.9, color = "#0F0", opacity = 0.05, fontSize = 16, delayFactor = 2 }) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    // Set initial canvas size
    resizeCanvas(canvas);

    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(0);
    const delays = new Array(columns).fill(0); // Delay timers for each column

    const drawMatrix = () => {
        // Clear the canvas with a trailing effect
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

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
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0; // Reset to the top
            }
        }

        requestAnimationFrame(drawMatrix);
    };

    drawMatrix();
    return canvas;
}



// Matrix Overlay Animation
function matrixOverlay(canvasId, { fontSize = 16, color = "rgba(255, 255, 255, 0.8)", blinkSpeed = 400 }) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    // Set initial canvas size
    resizeCanvas(canvas);

    const drawOverlay = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color;
        ctx.font = `${fontSize}px monospace`;

        // Draw random characters at random positions
        for (let i = 0; i < 10; i++) {
            const text = characters[Math.floor(Math.random() * characters.length)];
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;

            ctx.fillText(text, x, y);
        }

        setTimeout(() => requestAnimationFrame(drawOverlay), blinkSpeed);
    };

    drawOverlay();
    return canvas;
}

// Resize all canvases on window resize
window.addEventListener("resize", () => {
    document.querySelectorAll("canvas").forEach(resizeCanvas);
});

function toggleBlurWithAnimation(canvasId, interval = 1000) {
    const canvas = document.getElementById(canvasId);
    let lastTime = 0; // Tracks the last time the blur was toggled
    let isBlurred = false;

    const toggleBlur = (timestamp) => {
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

// Start animations
matrixRain("matrixCanvas1", { speedFactor: 0.3, fontSize: 12, delayFactor: 1 });  // Faster updates
matrixRain("matrixCanvas2", { speedFactor: 0.9, fontSize: 16, delayFactor: 3 }); // Balanced speed
matrixRain("matrixCanvas3", { speedFactor: 0.9, fontSize: 16, delayFactor: 9 }); // Slower, dramatic effect

matrixOverlay("overlayCanvas", { fontSize: 16, blinkSpeed: 400 });
// Call the function to toggle blur
toggleBlurWithAnimation("overlayCanvas", 3000); // Toggle blur every 1 second
