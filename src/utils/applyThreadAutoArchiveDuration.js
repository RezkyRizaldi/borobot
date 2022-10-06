const { ThreadAutoArchiveDuration } = require('discord.js');

/**
 *
 * @param {ThreadAutoArchiveDuration} duration
 * @returns {String} The thread auto archive duration.
 */
module.exports = (duration) => {
  return {
    [ThreadAutoArchiveDuration.OneHour]: '1 hour',
    [ThreadAutoArchiveDuration.OneDay]: '24 hours',
    [ThreadAutoArchiveDuration.ThreeDays]: '3 days',
    [ThreadAutoArchiveDuration.OneWeek]: '1 week',
  }[duration];
};
