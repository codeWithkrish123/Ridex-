const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'debug_output.txt');

function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
}

try {
    log('Starting debug...');
    const driverController = require('./src/controllers/driver.controller');
    log('driverController require success');
    log('driverController keys: ' + Object.keys(driverController).join(', '));
    log('updateLocation type: ' + typeof driverController.updateLocation);
    log('acceptRide type: ' + typeof driverController.acceptRide);
    log('completeRide type: ' + typeof driverController.completeRide);
    log('getAvailableDrivers type: ' + typeof driverController.getAvailableDrivers);
} catch (err) {
    log('Error requiring driver.controller: ' + err.stack);
}
