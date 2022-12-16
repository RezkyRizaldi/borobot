const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const { generateEmbed } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ai')
    .setDescription('🤖 AI Command.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('text')
        .setDescription('🔠 Generate Text with OpenAI.')
        .addStringOption((option) =>
          option
            .setName('prompt')
            .setDescription('❓ The command to generate.')
            .setRequired(true),
        ),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    await interaction.deferReply();

    const embed = generateEmbed({ interaction });
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    return {
      text: async () => {
        const prompt = options.getString('prompt', true);

        const attachment = new AttachmentBuilder(
          './src/assets/images/openai-logo.png',
          { name: 'openai-logo.png' },
        );

        const {
          data: {
            choices: [{ text }],
          },
        } = await openai.createCompletion({
          model: 'text-davinci-002',
          prompt,
        });

        embed
          .setAuthor({
            name: 'AI Search Result',
            iconURL: 'attachment://openai-logo.png',
          })
          .setFields([
            { name: '🔠 Prompt', value: prompt },
            { name: '🔠 Completion', value: text },
          ]);

        await interaction.editReply({ embeds: [embed], files: [attachment] });
      },
    }[options.getSubcommand()]();
  },
};
