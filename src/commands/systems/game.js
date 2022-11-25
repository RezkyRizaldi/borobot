const axios = require('axios');
const {
  bold,
  codeBlock,
  EmbedBuilder,
  SlashCommandBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('game')
    .setDescription('🎮 games command.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('brainteaser')
        .setDescription('🧠 Play a brain teaser game.'),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    /** @type {{ channel: ?import('discord.js').BaseGuildTextChannel, client: import('discord.js').Client<true>, member: ?import('discord.js').GuildMember, guild: ?import('discord.js').Guild, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'> }} */
    const { channel, client, guild, options } = interaction;

    await interaction.deferReply();

    if (!channel) throw "Channel doesn't exist.";

    const baseURL = 'https://api.lolhuman.xyz/api';

    const embed = new EmbedBuilder()
      .setColor(guild?.members.me?.displayHexColor ?? null)
      .setTimestamp(Date.now())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    switch (options.getSubcommand()) {
      case 'brainteaser': {
        /** @type {{ data: { result: import('../../constants/types').BrainTeaser } }} */
        const {
          data: {
            result: { pertanyaan, jawaban },
          },
        } = await axios.get(
          `${baseURL}/tebak/asahotak?apikey=${process.env.LOLHUMAN_API_KEY}`,
        );

        embed
          .setAuthor({ name: '🎮 Brain Teaser Game' })
          .setDescription(`${pertanyaan}${codeBlock('(15s remaining)')}`);

        const message = await interaction.editReply({ embeds: [embed] });

        let time = 15000;
        const checkMessage = () => {
          switch (true) {
            case time <= 0:
              clearInterval(interval);

              embed.setDescription(`The answer is: ${bold(jawaban)}`);

              return message.edit({ embeds: [embed] });

            case filter(channel.lastMessage):
              clearInterval(interval);

              embed.setDescription(
                `Congratulations! Your answer is correct\nThe answer is: ${bold(
                  jawaban,
                )}`,
              );

              return message.edit({ embeds: [embed] });

            default:
              time -= 1000;

              embed.setDescription(
                `${pertanyaan}${codeBlock(`(${time / 1000}s remaining)`)}`,
              );

              return message.edit({ embeds: [embed] });
          }
        };

        const interval = setInterval(async () => await checkMessage(), 1000);

        /**
         *
         * @param {import('discord.js').Message} msg
         * @returns Boolean value of the filtered interaction.
         */
        const filter = (msg) =>
          msg.content.toLowerCase() === jawaban.toLowerCase();

        return channel
          .awaitMessages({
            filter,
            time,
            max: 1,
            errors: ['time'],
          })
          .then((messages) =>
            setTimeout(async () => await messages.first().delete(), 1000),
          )
          .catch(() => console.log('No one use the command.'));
      }
    }
  },
};
