const { check } = require('express-validator');
const chains = [
    check('test').isNumeric(),
    check('test2').notEmpty()
];

console.log('Chain 0 type:', typeof chains[0]);
console.log('Chain 1 type:', typeof chains[1]);
console.log('Is array:', Array.isArray(chains));

const { requestRide } = require('./src/controllers/ride.controller');
console.log('requestRide type:', typeof requestRide);

const validate = require('./src/middlewares/validate.middleware');
console.log('validate type:', typeof validate);
