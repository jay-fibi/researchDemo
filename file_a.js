// File A - part of circular dependency
const fileB = require('./file_b.js');

function functionA() {
    console.log('Function A called');
    fileB.functionB();
}

module.exports = { functionA };
