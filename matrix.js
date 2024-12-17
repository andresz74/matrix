const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Characters to display (Matrix-like symbols)
const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()-_=+[]{}|;:',.<>?/`~¡™£¢∞§¶•ªº–≠œ∑´®†¥¨ˆøπ“‘åß∂ƒ©˙∆˚¬Ω≈ç√∫˜µ≤≥÷";
const characters = matrixChars.split("");

// Font size and columns
const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);

// Y positions for each column (initialize at 0)
const drops = Array(columns).fill(0);

// Draw the matrix rain
function drawMatrix() {
    // Black background with slight opacity for trailing effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text color and font
    ctx.fillStyle = "#0F0"; // Green color
    ctx.font = `${fontSize}px monospace`;

    // Loop through each column
    for (let i = 0; i < drops.length; i++) {
        // Get a random character
        const text = characters[Math.floor(Math.random() * characters.length)];

        // Calculate x and y positions
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Draw the character
        ctx.fillText(text, x, y);

        // Randomly reset drop to the top with a chance of 0.01
        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        // Move the drop downward
        drops[i]++;
    }

    requestAnimationFrame(drawMatrix);
}

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Start the animation
drawMatrix();
