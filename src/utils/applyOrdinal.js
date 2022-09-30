/**
 *
 * @param {Number} number
 * @returns {String} The ordinal number.
 */
module.exports = (number) => {
  return (
    `${number}` +
    (number > 20 || number < 10
      ? {
          [number % 10 === 1]: 'st',
          [number % 10 === 2]: 'nd',
          [number % 10 === 3]: 'rd',
        }[number]
      : 'th')
  );
};
