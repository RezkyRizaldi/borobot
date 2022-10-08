const { StickerType } = require('discord.js');

/**
 *
 * @param {StickerType} type
 * @returns {String} The sticker format type.
 */
module.exports = (type) => {
  return {
    [StickerType.Standard]: 'Standard',
    [StickerType.Guild]: 'Guild',
  }[type];
};
