const APIError = require('./error');

module.exports = new APIError({
  statusCode: 500,
  error: 'Internal Server Error',
  message: 'Something went wrong during request processing'
});
