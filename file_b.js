// File B - part of circular dependency
const fileA = require('./file_a.js');

function functionB() {
    console.log('Function B called');
    fileA.functionA();
}

module.exports = { functionB };
