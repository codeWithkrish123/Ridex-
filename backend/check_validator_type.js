const { check } = require('express-validator');
const val = check('test').isNumeric();
console.log('Type:', typeof val);
console.log('Is function:', typeof val === 'function');
