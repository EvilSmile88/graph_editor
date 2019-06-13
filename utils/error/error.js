function APIError(msg) {
  this.name = 'APIError';
  this.stack = (new Error()).stack;

  if (typeof msg === 'string') {
    this.message = msg;
  }

  if (typeof msg === 'object') {
    this.message = msg.message;
    this.statusCode = msg.statusCode;
    this.error = msg.error ? msg.error : this.name;
    this.validation = msg.validation;
  }
}

APIError.prototype = Object.create(Error.prototype);
APIError.prototype.constructor = APIError;

APIError.prototype.toJSON = function() {
  return {
    statusCode: this.statusCode,
    error: this.error || this.name,
    message: this.message,
    validation: this.validation
  };
};

module.exports = APIError;