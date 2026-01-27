# Matrix Falling Code Effect 🌌

This project recreates the **Matrix-style falling code effect** using **HTML**, **CSS**, and **WebGL 2**. The animation runs entirely on the GPU for smooth, high-performance rendering.

---

### 🎥 **Demo**
> Experience the effect live by opening the `index.html` file in any modern browser with WebGL 2 support.

---

### 📁 **Project Structure**

The project contains the following files:

```plaintext
matrix-falling-code/
│
├── index.html   # Main HTML file with the WebGL canvas
├── matrix.js    # JavaScript file for the WebGL shader animation
└── README.md    # Project documentation
```

---

### 🚀 **Getting Started**

Follow these steps to run the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/andresz74/matrix.git
   cd matrix
   ```

2. **Open the HTML file**:
   Open `index.html` in your preferred web browser.

3. **Enjoy the animation**:
   Watch the Matrix-like code rain effect.

---

### 🛠️ **How It Works**

1. A single `<canvas>` element is used for rendering.
2. A **WebGL 2 fragment shader** generates falling glyphs, trails, and head glow entirely on the GPU.
3. The JavaScript file (`matrix.js`) handles resize events, animation timing, and pause controls.

---

### 🎨 **Customization**

You can customize the following settings in `matrix.js`:

- **Glyph density**: Adjust the `columns` and `cellRows` values in the shader.
- **Speed**: Update the `speed` mix range in the shader for faster or slower rain.
- **Color**: Modify the `color` vector in the fragment shader.

---

### 🌟 **Preview Screenshot**

![Matrix Code Effect](https://zenteno.org/public_assets/matrix-rain-2.png)

---

### 📄 **License**

This project is open-source and available under the [MIT License](LICENSE).

---

### 💬 **Feedback & Contributions**

- **Contributions**: Feel free to fork the project and submit pull requests.
- **Feedback**: If you encounter issues or have suggestions, open an issue or reach out.

---

### 🔗 **Author**

**Andres Zenteno**  
GitHub: [@andresz74](https://github.com/andresz74)
