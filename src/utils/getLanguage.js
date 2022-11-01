/**
 *
 * @param {String} locale
 * @param {String} languages
 * @returns {String} Enum value of translation languages.
 */
module.exports = (languages, locale) =>
  Object.values(languages).find(
    (value) =>
      languages[locale.toLowerCase()].toLowerCase() === value.toLowerCase(),
  );
