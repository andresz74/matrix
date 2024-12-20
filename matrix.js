// Matrix Rain Characters
const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()-_=+[]{}|;:',.<>?/`~¡™£¢∞§¶•ªº–≠œ∑´®†¥¨ˆøπ“‘åß∂ƒ©˙∆˚¬Ω≈ç√∫˜µ≤≥÷アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん一二三四五六七八九十零";
const characters = matrixChars.split("");


// Utility: Set canvas dimensions to window size
function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Matrix Rain Animation
function matrixRain(canvasId, { speedFactor = 0.9, color = "#0F0", opacity = 0.05, fontSize = 16 }) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    // Set initial canvas size
    resizeCanvas(canvas);

    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(0);

    const drawMatrix = () => {
        // Clear background with trailing effect
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

            // Reset drop to the top randomly
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i] += speedFactor;
        }

        requestAnimationFrame(drawMatrix);
    };

    drawMatrix();
    return canvas;
}

// Matrix Overlay Animation
function matrixOverlay({ fontSize = 16, color = "rgba(255, 255, 255, 0.8)", blinkSpeed = 400 }) {
    const canvas = document.getElementById("overlayCanvas");
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

// Start animations
matrixRain("matrixCanvas1", { speedFactor: 0.3, fontSize: 12});
matrixRain("matrixCanvas2", { speedFactor: 0.6, fontSize: 16});
matrixRain("matrixCanvas3", { speedFactor: 0.9, fontSize: 20});
matrixOverlay({ fontSize: 12, blinkSpeed: 400 });
