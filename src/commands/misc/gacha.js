const AnimeImages = require('anime-images-api');
const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const nekoClient = require('nekos.life');

const { waifuChoices } = require('../../constants');
const { generateAttachmentFromBuffer, generateEmbed } = require('../../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gacha')
    .setDescription('💫 Test your luck command.')
    .addSubcommand((subcommand) =>
      subcommand.setName('loli').setDescription('👰‍♀️ Gacha for a loli.'),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('milf').setDescription('👰‍♀️ Gacha for a milf.'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('waifu')
        .setDescription('👰‍♀️ Gacha for a waifu.')
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('🖼️ The waifu image type.')
            .setRequired(true)
            .addChoices(...waifuChoices),
        ),
    ),
  type: 'Chat Input',

  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    /** @type {{ member: ?import('discord.js').GuildMember, options: Omit<import('discord.js').CommandInteractionOptionResolver<import('discord.js').CacheType>, 'getMessage' | 'getFocused'> }} */
    const { member, options } = interaction;
    const embed = generateEmbed({ interaction, type: 'member' });
    const images = new AnimeImages();
    const neko = new nekoClient();

    await interaction.deferReply();

    if (!member) throw "Member doesn't exist.";

    return {
      loli: async () => {
        /** @type {{ data: ArrayBuffer }} */
        const { data: buffer } = await axios.get(
          `https://api.lolhuman.xyz/api/random/loli?apikey=${process.env.LOLHUMAN_API_KEY}`,
          { responseType: 'arraybuffer' },
        );

        const img = await generateAttachmentFromBuffer({
          buffer,
          fileName: 'loli',
          fileDesc: 'Loli Image',
        });

        embed
          .setAuthor({
            name: `${member.user.username} Got a Loli`,
            iconURL: member.displayAvatarURL(),
          })
          .setImage(`attachment://${img.name}`);

        await interaction.editReply({ embeds: [embed], files: [img] });
      },
      milf: async () => {
        /** @type {{ data: ArrayBuffer }} */
        const { data: buffer } = await axios.get(
          `https://api.lolhuman.xyz/api/random/nsfw/milf?apikey=${process.env.LOLHUMAN_API_KEY}`,
          { responseType: 'arraybuffer' },
        );

        const img = await generateAttachmentFromBuffer({
          buffer,
          fileName: 'milf',
          fileDesc: 'Milf Image',
        });

        embed
          .setAuthor({
            name: `${member.user.username} Got a Milf`,
            iconURL: member.displayAvatarURL(),
          })
          .setImage(`attachment://${img.name}`);

        await interaction.editReply({ embeds: [embed], files: [img] });
      },
      waifu: () =>
        ({
          image: async () => {
            /** @type {{ data: { url: String } }} */
            const {
              data: { url },
            } = await axios.get('https://api.waifu.pics/sfw/waifu');

            embed
              .setAuthor({
                name: `${member.user.username} Got a Waifu`,
                iconURL: member.displayAvatarURL(),
              })
              .setImage(url);

            await interaction.editReply({ embeds: [embed] });
          },
          pfp: async () => {
            const { url } = await neko.avatar();

            /** @type {{ image: String }} */
            const { image } = await images.sfw.waifu();
            const imgArr = [url, image];
            const pfp = imgArr[Math.floor(Math.random() * imgArr.length)];

            embed
              .setAuthor({
                name: `${member.user.username} Got a Waifu`,
                iconURL: member.displayAvatarURL(),
              })
              .setImage(pfp);

            await interaction.editReply({ embeds: [embed] });
          },
          wallpaper: async () => {
            const { url } = await neko.wallpaper();

            embed
              .setAuthor({
                name: `${member.user.username} Got a Waifu`,
                iconURL: member.displayAvatarURL(),
              })
              .setImage(url);

            await interaction.editReply({ embeds: [embed] });
          },
        }[options.getString('type', true)]()),
    }[options.getSubcommand()]();
  },
};
