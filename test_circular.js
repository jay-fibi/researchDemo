// Test file to trigger circular dependency
const fileA = require('./file_a.js');

console.log('Starting circular dependency test...');
fileA.functionA();
