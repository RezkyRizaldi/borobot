const getMessageType = require('./getMessageType');

/**
 *
 * @param {Array<Array<import('discord.js').Message>>} arr
 * @returns {Array<Array<Array<import('discord.js').Message>>>}
 */
module.exports = (arr) => {
	arr.forEach((sub_arr, index) => {
		const collector = {};

		sub_arr.forEach((item) => {
			const groupItem = getMessageType(item);

			collector[groupItem] = collector[groupItem] || [];
			collector[groupItem].push(item);
		});

		arr[index] = Object.values(collector);
	});

	return arr;
};
