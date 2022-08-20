/**
 *
 * @param {Number} timestamp
 */
module.exports = (timestamp) => `<t:${Math.floor(timestamp / 1000)}:R>`;
