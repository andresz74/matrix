// Background Canvas (Matrix Rain)
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Overlay Canvas (Second Layer)
const overlayCanvas = document.getElementById('overlayCanvas');
const overlayCtx = overlayCanvas.getContext('2d');

// Canvas setup
canvas.width = overlayCanvas.width = window.innerWidth;
canvas.height = overlayCanvas.height = window.innerHeight;

// Matrix Rain Characters
const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()-_=+[]{}|;:',.<>?/`~¡™£¢∞§¶•ªº–≠œ∑´®†¥¨ˆøπ“‘åß∂ƒ©˙∆˚¬Ω≈ç√∫˜µ≤≥÷";
const characters = matrixChars.split("");

const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(0);

// Draw Matrix Rain
const speedFactor = 0.9; // Adjust this value: Lower = slower, Higher = faster
function drawMatrix() {
    // Clear background with slight transparency for trailing effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0F0"; // Green text
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0; // Reset to top
        }

        drops[i] += speedFactor; // Increment the position by the speed factor
    }

    requestAnimationFrame(drawMatrix);
}

// Draw Overlay Layer
function drawOverlay() {
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    overlayCtx.fillStyle = "rgba(255, 255, 255, 0.8)"; // Brighter white overlay text
    overlayCtx.font = `${fontSize}px monospace`;

    // Randomly choose positions for the overlay symbols
    for (let i = 0; i < 10; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = Math.random() * overlayCanvas.width;
        const y = Math.random() * overlayCanvas.height;

        overlayCtx.fillText(text, x, y);
    }

    setTimeout(() => requestAnimationFrame(drawOverlay), 200); // Slow blinking effect
}

// Resize both canvases
window.addEventListener('resize', () => {
    canvas.width = overlayCanvas.width = window.innerWidth;
    canvas.height = overlayCanvas.height = window.innerHeight;
});

// Start animations
drawMatrix();
drawOverlay();
