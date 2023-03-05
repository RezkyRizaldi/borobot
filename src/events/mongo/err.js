const chalk = require('chalk');

module.exports = {
  name: 'err',
  execute(err) {
    console.error(chalk.red(`[error] ${err.message}`));
  },
};
