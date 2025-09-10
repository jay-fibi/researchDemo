// module1.js - part of circular dependency
const script = require('./script.js');
console.log('Module1 loaded');

module.exports = {
    message: 'Hello from module1'
};
