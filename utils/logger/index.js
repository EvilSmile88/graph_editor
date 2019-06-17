const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      timestamp: true,
      colorize: true,
      showLevel: false,
      json: true,
      // stringify: true,
      // prettyPrint: true,
    })
  ]
});
module.exports = logger;
