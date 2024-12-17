// Overlay Canvas (Second Layer)
const overlayCanvas = document.getElementById('overlayCanvas');
const overlayCtx = overlayCanvas.getContext('2d');



// Matrix Rain Characters
const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()-_=+[]{}|;:',.<>?/`~¡™£¢∞§¶•ªº–≠œ∑´®†¥¨ˆøπ“‘åß∂ƒ©˙∆˚¬Ω≈ç√∫˜µ≤≥÷";
const characters = matrixChars.split("");

const fontSize = 16;

// Draw Matrix Rain
function matrixRain(canvasId, speedFactor = 0.9, color = "#0F0", opacity = 0.05) {
    // Background Canvas (Matrix Rain)
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    // Canvas setup
    canvas.width = overlayCanvas.width = window.innerWidth;
    canvas.height = overlayCanvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(0);

    function drawMatrix() {
        // Clear background with slight transparency for trailing effect
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = color; // Green text
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
    // Handle window resize
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    drawMatrix();
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

    window.addEventListener('resize', () => {
        overlayCanvas.width = window.innerWidth;
        overlayCanvas.height = window.innerHeight;
    });
}

// Start animations
matrixRain('matrixCanvas1', 0.4, '#0F0', 0.05);
matrixRain('matrixCanvas2', 0.8, '#0F0', 0.05);
drawOverlay();
