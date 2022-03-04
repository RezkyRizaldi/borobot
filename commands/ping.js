module.exports = {
	category: 'Testing',
	description: 'Replies with pong',
	slash: 'both',
	testOnly: true,
	callback: ({ message, interaction }) => {
		const reply = 'Pong!';

		if (message) {
			return message.reply({
				content: reply,
			});
		}

		interaction.reply({
			content: reply,
		});

		// return {
		//   content: reply
		// }
	},
};
