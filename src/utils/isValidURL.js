/**
 *
 * @param {String} str
 * @returns {Boolean} Boolean value of the string with valid URL.
 */
module.exports = (str) =>
  !!new RegExp(
    '^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$',
    'i',
  ).test(str);
