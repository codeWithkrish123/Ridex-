class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Set the prototype explicitly
    Object.setPrototypeOf(this, ErrorResponse.prototype);
  }
}

module.exports = ErrorResponse;