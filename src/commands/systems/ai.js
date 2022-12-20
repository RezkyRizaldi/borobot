const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const { generateEmbed } = require('@/utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ai')
    .setDescription('🤖 AI Command.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('grammar')
        .setDescription('🔤 Run a grammar correction with OpenAI.')
        .addStringOption((option) =>
          option
            .setName('prompt')
            .setDescription('❓ The command to generate.')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('image')
        .setDescription('🖼️ Generate Image with OpenAI.')
        .addStringOption((option) =>
          option
            .setName('prompt')
            .setDescription('❓ The command to generate.')
            .setRequired(true),
        ),
    )
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
    const attachment = new AttachmentBuilder(
      './src/assets/images/openai-logo.png',
      { name: 'openai-logo.png' },
    );
    const prompt = options.getString('prompt', true);

    return {
      grammar: async () => {
        const {
          data: {
            choices: [{ text }],
          },
        } = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt,
          temperature: 0,
          max_tokens: 60,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
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
      image: async () => {
        const {
          data: { data },
        } = await openai.createImage({ prompt });

        if (!data[0].url) {
          throw 'No image can be found.';
        }

        embed
          .setAuthor({
            name: 'AI Search Result',
            iconURL: 'attachment://openai-logo.png',
          })
          .setImage(data[0].url)
          .setFields([{ name: '🔠 Prompt', value: prompt }]);

        await interaction.editReply({ embeds: [embed], files: [attachment] });
      },
      text: async () => {
        const {
          data: {
            choices: [{ text }],
          },
        } = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt,
          temperature: 0,
          max_tokens: 60,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
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
