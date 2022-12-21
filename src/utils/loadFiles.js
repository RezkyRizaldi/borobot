const { glob } = require('glob');
const { promisify } = require('util');
const globPromise = promisify(glob);

/**
 *
 * @param {String} folder
 */
module.exports = async (folder) => {
  const files = await globPromise(
    `${process.cwd().replace(/\\/g, '/')}/src/${folder}/**/*.js`,
  );

  files.forEach((file) => delete require.cache[require.resolve(file)]);

  return files;
};
