const { ActivityType } = require('discord.js');

/**
 *
 * @param {ActivityType} type
 * @returns {String} The activity type.
 */
module.exports = (type) => {
	return {
		[ActivityType.Playing]: 'Playing',
		[ActivityType.Streaming]: 'Streaming',
		[ActivityType.Listening]: 'Listening to',
		[ActivityType.Watching]: 'Watching',
		[ActivityType.Custom]: 'Custom',
		[ActivityType.Competing]: 'Competing in',
	}[type];
};
