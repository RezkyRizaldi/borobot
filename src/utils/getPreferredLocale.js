const { Locale } = require('discord.js');

/**
 *
 * @param {Locale} locale
 * @returns {String} The locale language name.
 */
module.exports = (locale) => {
  return {
    [Locale.Bulgarian]: 'български',
    [Locale.ChineseCN]: '中文',
    [Locale.ChineseTW]: '繁體中文',
    [Locale.Croatian]: 'Hrvatski',
    [Locale.Czech]: 'Čeština',
    [Locale.Danish]: 'Dansk',
    [Locale.Dutch]: 'Nederlands',
    [Locale.EnglishGB]: 'Suomi',
    [Locale.EnglishUS]: 'English',
    [Locale.Finnish]: 'Suomalainen',
    [Locale.French]: 'Français',
    [Locale.German]: 'Deutsch',
    [Locale.Greek]: 'Ελληνικά',
    [Locale.Hindi]: 'हिन्दी',
    [Locale.Hungarian]: 'Magyar',
    [Locale.Italian]: 'Italiano',
    [Locale.Japanese]: '日本語',
    [Locale.Korean]: '한국인',
    [Locale.Lithuanian]: 'Lietuviškai',
    [Locale.Norwegian]: 'Norsk',
    [Locale.Polish]: 'Polski',
    [Locale.PortugueseBR]: 'Português do Brasil',
    [Locale.Romanian]: 'Română',
    [Locale.Russian]: 'Русский',
    [Locale.SpanishES]: 'Español',
    [Locale.Swedish]: 'Svenska',
    [Locale.Thai]: 'ไทย',
    [Locale.Turkish]: 'Türkçe',
    [Locale.Ukrainian]: 'Українська',
    [Locale.Vietnamese]: 'Tiếng Việt',
  }[locale];
};
