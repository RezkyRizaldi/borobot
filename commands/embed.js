const { MessageEmbed } = require('discord.js');

module.exports = {
	category: 'Testing',
	description: 'Send an embed',
	testOnly: true,
	permissions: ['ADMINISTRATOR'],
	callback: async ({ message, text }) => {
		// const json = JSON.parse(text);
		// const embed = new MessageEmbed(json);

		// return embed;

		const embed = new MessageEmbed().setTitle('Test Embed').setDescription('Hello World').setColor(0xfcc9b9).setAuthor('Kiww').setFooter('Footer');

		// return embed;
		const newMessage = await message.reply({
			embeds: [embed],
		});

		await new Promise((resolve) => setTimeout(resolve, 5000));

		const newEmbed = newMessage.embeds[0];

		newEmbed.setTitle('Edited Embed');
		newMessage.edit({
			embeds: [newEmbed],
		});
	},
};
