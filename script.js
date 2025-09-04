// Create circular dependency: import module1.js
const module1 = require('./module1.js');
console.log('Script.js loaded with module1:', module1);

function updateClock() {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('day').innerHTML = `Today is ${day}`;
    document.getElementById('clock').innerHTML = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock();

// Introduce syntax error: unclosed function
function brokenFunction() {
    console.log("This will cause a syntax error"

// Introduce reference error: missing file
const missingModule = require('./nonexistent.js');
console.log(missingModule);
