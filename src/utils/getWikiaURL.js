const crypto = require('crypto');

/**
 *
 * @param {String} fileName
 * @param {String} baseURL
 * @returns {String} The WIkia URL format
 */
module.exports = (fileName, baseURL) => {
  const formattedFileName = fileName.replace(/ /g, '_');
  const md5 = crypto.createHash('md5').update(formattedFileName).digest('hex');
  const md5First = md5.substring(0, 1);
  const md5Second = md5.substring(0, 2);

  if (baseURL.slice(-1) !== '/') baseURL += '/';

  const url = `${baseURL}${md5First}/${md5Second}/${encodeURIComponent(
    formattedFileName,
  )}`;

  return url.includes('Ayato')
    ? url
        .replace('/f/fd', '/a/a2')
        .replace('Character_Ayato_Thumb', 'Character_Kamisato_Ayato_Thumb')
    : url;
};
