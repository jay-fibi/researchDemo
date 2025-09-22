// File to demonstrate reference error
const missingModule = require('./non_existent_module.js');

console.log('This will cause a reference error');
