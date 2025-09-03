const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generate');
const colorInput = document.getElementById('color');

generateBtn.addEventListener('click', () => {
    const color = colorInput.value;
    generateRandomShape(color);
});

function generateRandomShape(color) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const shapeType = Math.floor(Math.random() * 3); // 0: circle, 1: square, 2: triangle
    const x = Math.random() * (canvas.width - 100) + 50;
    const y = Math.random() * (canvas.height - 100) + 50;
    const size = Math.random() * 50 + 20;
    ctx.fillStyle = color;
    if (shapeType === 0) {
        // circle
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    } else if (shapeType === 1) {
        // square
        ctx.fillRect(x - size/2, y - size/2, size, size);
    } else {
        // triangle
        ctx.beginPath();
        ctx.moveTo(x, y - size/2);
        ctx.lineTo(x - size/2, y + size/2);
        ctx.lineTo(x + size/2, y + size/2);
        ctx.closePath();
        ctx.fill();
    }
}
