const chalk = require('chalk');

module.exports = {
  name: 'disconnected',
  execute() {
    console.log(chalk.yellow('[warn] Database Disconnected.'));
  },
};
