/**
 *
 * @param {String} string
 * @returns {String} The titlecased string.
 */
module.exports = (string) =>
  string
    .split(' ')
    .map((word) => {
      return ![
        'of',
        'the',
        'and',
        'for',
        'to',
        'a',
        'an',
        'in',
        'on',
        'it',
        'but',
      ].includes(word)
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word;
    })
    .join(' ');
