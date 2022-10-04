/**
 *
 * @param {Number} number
 * @returns {String} The ordinal number.
 */
module.exports = (number) => {
  if (number % 10 === 1 && number % 100 !== 11) return `${number}st`;
  if (number % 10 === 2 && number % 100 !== 12) return `${number}nd`;
  if (number % 10 === 3 && number % 100 !== 13) return `${number}rd`;

  return `${number}th`;
};
