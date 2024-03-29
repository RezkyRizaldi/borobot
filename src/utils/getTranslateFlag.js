const { languages } = require('@/constants');

/**
 *
 * @param {String} locale
 * @returns {String} The region flag from the locale.
 */
module.exports = (locale) => {
  return {
    [languages.af]: '🇿🇦',
    [languages.am]: '🇪🇹',
    [languages.ar]: '🇸🇦',
    [languages.az]: '🇦🇿',
    [languages.be]: '🇧🇾',
    [languages.bg]: '🇧🇬',
    [languages.bn]: '🇧🇩',
    [languages.bs]: '🇧🇦',
    [languages.ca]: '🇪🇸',
    [languages.ceb]: '🇵🇭',
    [languages.co]: '🇫🇷',
    [languages.cs]: '🇨🇿',
    [languages.cy]: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    [languages.da]: '🇩🇰',
    [languages.de]: '🇩🇪',
    [languages.el]: '🇬🇷',
    [languages.en]: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    [languages.eo]: '🇵🇱',
    [languages.es]: '🇪🇸',
    [languages.et]: '🇪🇪',
    [languages.eu]: '🇫🇷',
    [languages.fa]: '🇮🇷',
    [languages.fi]: '🇫🇮',
    [languages.fr]: '🇫🇷',
    [languages.fy]: '🇳🇱',
    [languages.ga]: '🇮🇪',
    [languages.gd]: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    [languages.gl]: '🇪🇸',
    [languages.gu]: '🇮🇳',
    [languages.ha]: '🇹🇩',
    [languages.haw]: '🇺🇸',
    [languages.he]: '🇮🇱',
    [languages.hi]: '🇮🇳',
    [languages.hmn]: '🇨🇳',
    [languages.hr]: '🇭🇷',
    [languages.ht]: '🇭🇹',
    [languages.hu]: '🇭🇺',
    [languages.hy]: '🇦🇲',
    [languages.id]: '🇮🇩',
    [languages.ig]: '🇳🇬',
    [languages.is]: '🇮🇸',
    [languages.it]: '🇮🇹',
    [languages.ja]: '🇯🇵',
    [languages.jw]: '🇮🇩',
    [languages.ka]: '🇬🇪',
    [languages.kk]: '🇰🇿',
    [languages.km]: '🇰🇭',
    [languages.kn]: '🇨🇦',
    [languages.ko]: '🇰🇷',
    [languages.ku]: '🇮🇶',
    [languages.ky]: '🇰🇬',
    [languages.la]: '🇮🇹',
    [languages.lb]: '🇱🇺',
    [languages.lo]: '🇹🇭',
    [languages.lt]: '🇱🇹',
    [languages.lv]: '🇱🇻',
    [languages.mg]: '🇲🇬',
    [languages.mi]: '🇳🇿',
    [languages.mk]: '🇲🇰',
    [languages.ml]: '🇮🇳',
    [languages.mn]: '🇲🇳',
    [languages.mr]: '🇮🇳',
    [languages.ms]: '🇲🇾',
    [languages.mt]: '🇲🇹',
    [languages.my]: '🇲🇲',
    [languages.ne]: '🇳🇵',
    [languages.nl]: '🇳🇱',
    [languages.no]: '🇳🇴',
    [languages.ny]: '🇲🇼',
    [languages.pa]: '🇮🇳',
    [languages.pl]: '🇵🇱',
    [languages.ps]: '🇦🇫',
    [languages.pt]: '🇵🇹',
    [languages.ro]: '🇷🇴',
    [languages.ru]: '🇷🇺',
    [languages.sd]: '🇵🇰',
    [languages.si]: '🇱🇰',
    [languages.sk]: '🇸🇰',
    [languages.sl]: '🇸🇮',
    [languages.sm]: '🇼🇸',
    [languages.sn]: '🇿🇼',
    [languages.so]: '🇸🇴',
    [languages.sq]: '🇦🇱',
    [languages.sr]: '🇷🇸',
    [languages.st]: '🇱🇸',
    [languages.su]: '🇮🇩',
    [languages.sv]: '🇸🇪',
    [languages.sw]: '🇰🇪',
    [languages.ta]: '🇮🇳',
    [languages.te]: '🇮🇳',
    [languages.tg]: '🇹🇯',
    [languages.th]: '🇹🇭',
    [languages.tl]: '🇵🇭',
    [languages.tr]: '🇹🇷',
    [languages.uk]: '🇺🇦',
    [languages.ur]: '🇮🇳',
    [languages.uz]: '🇺🇿',
    [languages.vi]: '🇻🇳',
    [languages.xh]: '🇿🇦',
    [languages.yi]: '🇮🇱',
    [languages.yo]: '🇳🇬',
    [languages['zh-CN']]: '🇨🇳',
    [languages['zh-TW']]: '🇨🇳',
    [languages.zu]: '🇿🇦',
    Twi: '🇬🇭',
    Assamese: '🇮🇳',
    Aymara: '🇧🇴',
    Bhojpuri: '🇳🇵',
    Bambara: '🇲🇱',
    'Kurdish (Sorani)': '🇮🇶',
    Dogri: '🇮🇳',
    Dhivehi: '🇲🇻',
    Ewe: '🇹🇬',
    Guarani: '🇵🇾',
    Konkani: '🇮🇳',
    Ilocano: '🇵🇭',
    Krio: '🇸🇱',
    Luganda: '🇺🇬',
    Lingala: '🇨🇩',
    Mizo: '🇮🇳',
    Maithili: '🇮🇳',
    'Meiteilon (Manipuri)': '🇮🇳',
    Sepedi: '🇿🇦',
    Oromo: '🇪🇹',
    'Odia (Oriya)': '🇮🇳',
    Quechua: '🇧🇴',
    Kinyarwanda: '🇷🇼',
    Sanskrit: '🇮🇳',
    Tigrinya: '🇪🇷',
    Turkmen: '🇹🇲',
    Tsonga: '🇲🇿',
    Tatar: '🇷🇺',
    Uyghur: '🇨🇳',
  }[locale];
};
