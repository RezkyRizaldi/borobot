const { StickerFormatType } = require('discord.js');

/**
 *
 * @param {StickerFormatType} type
 * @returns {String} The sticker format type.
 */
module.exports = (type) => {
  return {
    [StickerFormatType.PNG]: 'Portable Network Graphics (PNG)',
    [StickerFormatType.APNG]: 'Animated Portable Network Graphics (APNG)',
    [StickerFormatType.Lottie]: 'Lottie',
  }[type];
};
