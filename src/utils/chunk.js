/**
 *
 * @param {any[]} arr
 * @param {Number} chunkSize
 * @returns {String[][]} Array of chunked string arrays.
 */
module.exports = (arr, chunkSize) =>
  arr.reduce(
    (acc, _, i) =>
      i % chunkSize ? acc : [...acc, arr.slice(i, i + chunkSize)],
    [],
  );
