module.exports = {
	data: {
		name: 'modal',
	},
	async execute(interaction, client) {
		await interaction.reply({
			content: `You selected ${interaction.fields.getTextInputValue('input')}`,
		});
	},
};
