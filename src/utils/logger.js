const chalk = require('chalk');

function getTimestamp() {
  return new Date().toISOString();
}

const logger = {
  info: (msg, ...args) =>
    console.log(
      chalk.blue('[INFO]'),
      chalk.gray(getTimestamp()),
      chalk.white(msg),
      ...args
    ),
  warn: (msg, ...args) =>
    console.warn(
      chalk.yellow('[WARN]'),
      chalk.gray(getTimestamp()),
      chalk.yellow(msg),
      ...args
    ),
  error: (msg, ...args) =>
    console.error(
      chalk.red('[ERROR]'),
      chalk.gray(getTimestamp()),
      chalk.red(msg),
      ...args
    ),
  success: (msg, ...args) =>
    console.log(
      chalk.green('[SUCCESS]'),
      chalk.gray(getTimestamp()),
      chalk.green(msg),
      ...args
    ),
  debug: (msg, ...args) =>
    console.debug(
      chalk.magenta('[DEBUG]'),
      chalk.gray(getTimestamp()),
      chalk.magenta(msg),
      ...args
    ),
};

module.exports = logger;
