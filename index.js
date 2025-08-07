/**
 * Basic JavaScript file
 * This file demonstrates some fundamental JavaScript concepts
 */

// Variable declarations
const greeting = "Hello, World!";
let counter = 0;

/**
 * A simple function that increments and returns a counter
 * @returns {number} The incremented counter value
 */
function incrementCounter() {
  counter += 1;
  return counter;
}

// Object example
const user = {
  name: "John Doe",
  age: 30,
  isActive: true,
  greet: function() {
    console.log(`Hello, my name is ${this.name}`);
  }
};

// Array example with some array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);

// Demonstrating console output
console.log(greeting);
console.log(`Counter: ${incrementCounter()}`);
console.log(`Doubled numbers: ${doubled}`);

// Event handling example (for browser environments)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
  });
}

// Export example (for module usage)
module.exports = {
  greeting,
  incrementCounter,
  user
};
