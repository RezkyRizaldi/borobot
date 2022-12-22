const chalk = require('chalk');

module.exports = {
  name: 'connecting',
  execute() {
    console.log(chalk.blue('[info] Connecting Database...'));
  },
};
