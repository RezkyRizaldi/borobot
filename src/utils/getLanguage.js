/**
 *
 * @param {String} locale
 * @param {import('@vitalets/google-translate-api').languages} languages
 * @returns {String} Enum value of translation languages.
 */
module.exports = (languages, locale) =>
  Object.values(languages).find(
    (value) =>
      languages[locale.toLowerCase()].toLowerCase() === value.toLowerCase(),
  );
