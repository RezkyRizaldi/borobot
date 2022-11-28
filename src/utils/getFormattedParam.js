const { paramCase } = require('change-case');

/**
 *
 * @param {String} query
 * @returns {String} The formatted query param.
 */
module.exports = (query) => {
  return query.toLowerCase().includes('itto')
    ? 'arataki-itto'
    : query.toLowerCase() === 'hutao'
    ? 'hu-tao'
    : query.toLowerCase().includes('kazuha')
    ? 'kazuha'
    : query.toLowerCase().includes('kokomi')
    ? 'kokomi'
    : query.toLowerCase().includes('shinobu')
    ? 'kuki-shinobu'
    : query.toLowerCase().includes('raiden')
    ? 'raiden'
    : query.toLowerCase().includes('sara')
    ? 'sara'
    : query.toLowerCase().includes('heizou')
    ? 'shikanoin-heizou'
    : query.toLowerCase() === 'childe'
    ? 'tartaglia'
    : query.toLowerCase().includes('miko')
    ? 'yae-miko'
    : query.toLowerCase() === 'yunjin'
    ? 'yun-jin'
    : paramCase(query);
};
