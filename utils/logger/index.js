const winston = require('winston');
const { omit } = require('lodash');

winston.addColors({
  silly: 'magenta',
  debug: 'blue',
  verbose: 'cyan',
  info: 'green',
  warn: 'yellow',
  error: 'red'
});

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
  level: process.env.LOG_LEVEL,
  prettyPrint: true,
  colorize: true,
  silent: false,
  timestamp: false
});


class Logger {
  constructor() {
    this.logger = new winston.Logger({
      transports: [this.getConsoleTransport()]
    });
  }

  get loggerInstance() {
    return this.logger;
  }

  info(info, fieldsToExclude = []) {
    const { loggerInstance } = this;

    if (typeof info === 'object') {
      loggerInstance.info(JSON.stringify(omit(info, fieldsToExclude)));
    } else {
      loggerInstance.info(info);
    }
  }

  error(info) {
    this.loggerInstance.error(info);
  }

  getConsoleTransport() {
    return new winston.transports.Console({
      timestamp: true,
      colorize: true,
      showLevel: false,
      json: true,
      // stringify: true,
      // prettyPrint: true,
    });
  }
}
