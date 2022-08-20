const { ActivityType } = require('discord.js');

/**
 *
 * @param {ActivityType} type
 */
module.exports = (type) => {
	switch (type) {
		case ActivityType.Playing:
			return 'Playing';

		case ActivityType.Streaming:
			return 'Streaming';

		case ActivityType.Listening:
			return 'Listening to';

		case ActivityType.Watching:
			return 'Watching';

		case ActivityType.Custom:
			return 'Custom Status';

		case ActivityType.Competing:
			return 'Competing in';

		default:
			break;
	}
};
