const chalk = require('chalk');
const { use } = require('i18next');
const Backend = require('i18next-fs-backend');

/**
 *
 * @param {import('@/constants/types').Client} client
 */
module.exports = (client) => {
  client.handleLanguage = async () => {
    await use(Backend).init(
      {
        lng: 'en-US',
        // debug: true,
        supportedLngs: ['en-US', 'es-ES', 'en', 'es'],
        fallbackLng: 'en-US',
        preload: ['en-US', 'es-ES', 'en', 'es'],
        ns: ['translation'],
        defaultNs: 'translation',
        backend: {
          loadPath: './src/lang/{{lng}}/{{ns}}.json',
        },
      },
      (err) => err && console.error(chalk.red(`[error] ${err}`)),
    );
  };
};
