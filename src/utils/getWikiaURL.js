const crypto = require('crypto');

/**
 *
 * @param {{ fileName: String, path: String, animated?: Boolean }} data
 * @returns {String} The WIkia URL format
 */
module.exports = ({ fileName, path, animated = false }) => {
  const baseURL = `https://static.wikia.nocookie.net/${path}/images`;
  const file = `${fileName.replace(/ /g, '_')}.${animated ? 'gif' : 'png'}`;
  const md5 = crypto.createHash('md5').update(file).digest('hex');

  return `${baseURL}/${md5.slice(0, 1)}/${md5.slice(0, 2)}/${encodeURIComponent(
    file,
  )}`;
};
