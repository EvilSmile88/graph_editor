const APIError = require('./error');

module.exports = new APIError({
  statusCode: 400,
  error: 'Bad Request',
  message: 'Invalid data request'
});
